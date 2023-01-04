import { avcProcedure, router } from "../../trpc";

import z from "zod";
import { TRPCError } from "@trpc/server";
import { getLinkPreview } from "link-preview-js";

import type { ArticleModStatus, Prisma } from "@prisma/client";
import type { AvcArticleCard } from "../../../types/advocate/article.types";
import type { ReferencesLink } from "../../../types/article.types";

type LinkPreviewPromise = Promise<
	| {
			url: string;
			mediaType: string;
			contentType: string;
			favicons: string[];
	  }
	| {
			url: string;
			title: string;
			siteName: string | undefined;
			description: string | undefined;
			mediaType: string;
			contentType: string | undefined;
			images: string[];
			favicons: string[];
	  }
>;

export const fetchLinksPreview = async (links: string[]) => {
	const fetchTasks = links.map((link) => {
		return {
			task: Promise.race([
				getLinkPreview(link),
				new Promise((resolve) =>
					setTimeout(() => {
						resolve({
							title: link,
							description: "",
							images: [],
							link: link,
						});
					}, 2000),
				),
			]) as LinkPreviewPromise,
			link: link,
		};
	});

	const results: ReferencesLink[] = await Promise.all(
		fetchTasks.map(async (task) => {
			try {
				var previewData = await task.task;
			} catch (e) {
				return {
					title: task.link,
					description: "",
					img: null,
					link: task.link,
				};
			}

			let ret: ReferencesLink;

			if ("title" in previewData) {
				ret = {
					title: previewData.title,
					description: previewData.description
						? previewData.description
						: task.link,
					img: previewData.images[0] ? previewData.images[0] : null,
					link: task.link,
				};
			} else {
				ret = {
					title: task.link,
					description: "",
					img: null,
					link: task.link,
				};
			}

			return ret;
		}),
	);

	return results;
};

export const articleRouter = router({
	allArticles: avcProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.number().nullish(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const limit = input.limit ?? 20;
			const cursor = input.cursor ? input.cursor : 0;
			const items = await ctx.prisma.avcArticle.findMany({
				where: {
					authorId: ctx.user.id,
				},
				select: {
					id: true,
					title: true,
					tags: true,
					content: true,
					status: true,
					articleInstance: {
						select: {
							viewCount: true,
							_count: {
								select: { arguments: true },
							},
						},
					},
				},
				take: limit + 1,
				skip: cursor * limit,
				orderBy: {
					createdTime: "desc",
				},
			});

			let nextCursor: typeof cursor | undefined = undefined;
			if (items.length > limit) {
				items.pop();
				nextCursor = cursor + 1;
			}

			const data = items.map((item) => {
				let status = item.status;
				if (!status)
					status = {
						articleId: item.id,
						status: "pending_mod",
						desc: "因議題初次發布或被更新，因此正在等候審核中",
					} as ArticleModStatus;

				return {
					id: item.id,
					title: item.title,
					tags: item.tags,
					status: status.status,
					status_desc: status.desc,
					viewCount: item.articleInstance?.viewCount,
					argumentCount: item.articleInstance?._count.arguments,
					modPending: 0,
				} as AvcArticleCard;
			});
			return {
				data,
				nextCursor,
			};
		}),

	createArticle: avcProcedure
		.input(
			z.object({
				title: z.string(),
				tags: z.array(z.string()).min(1).max(4),
				brief: z.string().min(30).max(80),
				content: z.array(
					z.object({
						type: z.enum(["h1", "h2", "h3", "p", "spoiler"]),
						content: z.string(),
					}),
				),
				references: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let references: ReferencesLink[];
			try {
				references = await fetchLinksPreview(input.references);
			} catch (e) {
				throw new TRPCError({
					code: "TIMEOUT",
					message: "Failed to load references",
				});
			}

			const articleWTitle = await ctx.prisma.articles.findFirst({
				where: {
					title: input.title,
				},
			});
			if (articleWTitle)
				throw new TRPCError({
					code: "CONFLICT",
					message: "Article with title exists",
				});

			const moderator = await ctx.prisma.user.findFirst({
				where: { role: { in: ["SENIOR_ADVOCATE", "ADMIN"] } },
				orderBy: {
					pendModArticles: { _count: "asc" },
				},
			});

			if (!moderator)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Senior Advocate not found",
				});

			const data = await ctx.prisma.avcArticle.create({
				data: {
					title: input.title,
					author: { connect: { id: ctx.user.id } },
					tags: input.tags,
					brief: input.brief,
					content: input.content,
					references: { createMany: { data: references } },
					status: {
						create: {
							moderator: { connect: { id: moderator.id } },
							registeredModDate: new Date(),
						},
					},
				},
			});

			return {
				id: data.id,
			};
		}),

	updateArticle: avcProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
				tags: z.array(z.string()).min(1).max(4),
				brief: z.string().min(30).max(80),
				content: z.array(
					z.object({
						type: z.enum(["h1", "h2", "h3", "p", "spoiler"]),
						content: z.string(),
					}),
				),
				references: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let references: ReferencesLink[];
			try {
				references = await fetchLinksPreview(input.references);
			} catch (e) {
				throw new TRPCError({
					code: "TIMEOUT",
					message: "Failed to load references",
				});
			}

			let prevRefLinks: string[];

			const currentArticle = await ctx.prisma.avcArticle.findFirstOrThrow({
				where: {
					id: input.id,
					authorId: ctx.user.id,
				},
				select: {
					references: { select: { id: true, link: true } },
					status: { select: { status: true } },
				},
			});

			prevRefLinks = currentArticle.references.map((ref) => ref.link);
			let deleteRefIds: bigint[] = [];
			currentArticle.references.forEach((refLink) => {
				if (!input.references.includes(refLink.link)) {
					deleteRefIds.push(refLink.id);
				}
			});

			if (!currentArticle.status)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						"Article mod status not found, please contact Speakup support",
				});

			const moderator = await ctx.prisma.user.findFirst({
				where: { role: { in: ["SENIOR_ADVOCATE", "ADMIN"] } },
				orderBy: {
					pendModArticles: { _count: "asc" },
				},
			});

			if (!moderator)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Senior Advocate not found",
				});

			const data = await ctx.prisma.avcArticle.update({
				where: { id: input.id },
				data: {
					title: input.title,
					tags: input.tags,
					brief: input.brief,
					content: input.content,
					references: {
						deleteMany: {
							id: { in: deleteRefIds },
						},
						createMany: {
							skipDuplicates: true,
							data: references.filter(
								(cur) => !prevRefLinks.includes(cur.link),
							),
						},
					},
					status: ["passed", "failed"].includes(currentArticle.status.status)
						? {
								update: {
									status: "pending_mod",
									desc: "議題更新，等待審核中",
									moderator: { connect: { id: moderator.id } },
									registeredModDate: new Date(),
								},
						  }
						: undefined,
				},
			});

			return {
				id: data.id,
			};
		}),

	deleteArticle: avcProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.avcArticle.findFirstOrThrow({
				where: {
					id: input.id,
					authorId: ctx.user.id,
				},
			});

			await ctx.prisma.avcArticle.delete({
				where: { id: input.id },
			});
		}),

	pendingModeration: avcProcedure.query(async ({ ctx }) => {
		const pending_mod = await ctx.prisma.articleModStatus.findMany({
			where: { moderatorId: ctx.user.id },
			select: {
				article: {
					select: { id: true, title: true },
				},
				registeredModDate: true,
			},
			orderBy: { registeredModDate: "asc" },
		});

		let updateDateQueries: Prisma.Prisma__ArticleModStatusClient<
			ArticleModStatus,
			never
		>[] = [];

		const ret = pending_mod.map((atc) => {
			let currentTime = new Date();
			if (!atc.registeredModDate) {
				updateDateQueries.push(
					ctx.prisma.articleModStatus.update({
						where: { articleId: atc.article.id },
						data: { registeredModDate: currentTime },
					}),
				);
			}

			let registeredModDate = atc.registeredModDate
				? atc.registeredModDate
				: currentTime;

			let remainingDays =
				7 -
				Math.floor(
					(new Date().getTime() - registeredModDate.getTime()) / 1000 / 86400,
				);

			return {
				id: atc.article.id,
				title: atc.article.title,
				remainingDays: remainingDays,
			};
		});

		await Promise.all(updateDateQueries);

		return ret;
	}),

	moderationPassed: avcProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const modStatus = await ctx.prisma.articleModStatus.findFirstOrThrow({
				where: { articleId: input.id, moderatorId: ctx.user.id },
			});

			const updatedAVCArticle =
				await ctx.prisma.articleModStatus.findUniqueOrThrow({
					where: { articleId: input.id },
					select: {
						article: {
							include: {
								references: true,
								articleInstance: { include: { references: true } },
							},
						},
					},
				});

			let clearReports = false;

			if (modStatus.status === "report_pending_mod") clearReports = true;

			if (updatedAVCArticle.article.articleInstance === null) {
				await ctx.prisma.avcArticle.update({
					where: { id: updatedAVCArticle.article.id },
					data: {
						articleInstance: {
							create: {
								title: updatedAVCArticle.article.title,
								tags: updatedAVCArticle.article.tags,
								brief: updatedAVCArticle.article.brief,
								content: updatedAVCArticle.article
									.content as Prisma.InputJsonValue,
								author: { connect: { id: updatedAVCArticle.article.authorId } },
								references: {
									createMany: {
										data: updatedAVCArticle.article.references.map((ref) => ({
											title: ref.title,
											description: ref.description,
											link: ref.link,
											img: ref.img,
										})),
									},
								},
							},
						},
					},
				});
			} else {
				await ctx.prisma.articles.update({
					where: { avcArticleId: updatedAVCArticle.article.id },
					data: {
						title: updatedAVCArticle.article.title,
						tags: updatedAVCArticle.article.tags,
						brief: updatedAVCArticle.article.brief,
						content: updatedAVCArticle.article.content as Prisma.InputJsonValue,
						references: {
							createMany: {
								data: updatedAVCArticle.article.articleInstance.references
									.filter((ref) =>
										updatedAVCArticle.article.references.every(
											(r) => r.link !== ref.link,
										),
									)
									.map((ref) => ({
										title: ref.title,
										description: ref.description,
										link: ref.link,
										img: ref.img,
									})),
								skipDuplicates: true,
							},
							deleteMany: {
								id: {
									in: updatedAVCArticle.article.articleInstance.references
										.filter((ref) =>
											updatedAVCArticle.article.references.every(
												(r) => r.link !== ref.link,
											),
										)
										.map((ref) => ref.id),
								},
							},
						},
						articleReports: {
							deleteMany: clearReports ? {} : undefined,
						},
					},
				});
			}
			await ctx.prisma.articleModStatus.update({
				where: { articleId: input.id },
				data: {
					desc: "",
					registeredModDate: null,
					status: "passed",
					moderator: { disconnect: true },
				},
				select: {
					article: {
						include: {
							references: true,
							articleInstance: { include: { references: true } },
						},
					},
				},
			});
		}),

	moderationFailed: avcProcedure
		.input(
			z.object({
				id: z.string(),
				reason: z.string().min(50),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.articleModStatus.findFirstOrThrow({
				where: { articleId: input.id, moderatorId: ctx.user.id },
			});

			await ctx.prisma.articleModStatus.update({
				where: {
					articleId: input.id,
				},
				data: {
					status: "failed",
					desc: input.reason,
					registeredModDate: null,
					moderator: { disconnect: true },
				},
			});
		}),
});
