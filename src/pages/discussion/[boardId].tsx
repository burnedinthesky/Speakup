import { MouseEvent, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { prisma } from "../../utils/prisma";

import { AppShell } from "../../components/AppShell";
import ArticleViewer from "../../components/Article/ArticleViewer";
import CommentField from "../../components/Discussion/Comments/CommentField";

import StanceSelector from "../../components/Discussion/Selectors/StanceSelector";
import SortSelector from "../../components/Discussion/Selectors/SortSelector";

import { Article } from "../../types/article.types";
import { trpc } from "../../utils/trpc";

interface DiscussionProps {
	article: Article;
}

const DiscussionBoard = ({ article }: DiscussionProps) => {
	const [viewingStance, setViewingStance] = useState<string | null>("both");
	const [sortMethod, setSortMethod] = useState<"default" | "time" | "replies">(
		"default",
	);
	const [screenSize, setScreenSize] = useState<"mob" | "des">("mob");

	const registerViewMutation = trpc.articles.registerView.useMutation();

	useEffect(() => {
		registerViewMutation.mutate(article.id);
	}, []);

	const updateSortMethod = (e: MouseEvent<HTMLButtonElement>) => {
		const updateMode = e.currentTarget.innerText as
			| "預設排序"
			| "依時間排序"
			| "依回覆數排序";
		if (updateMode == "預設排序") setSortMethod("default");
		else if (updateMode == "依時間排序") setSortMethod("time");
		else if (updateMode == "依回覆數排序") setSortMethod("replies");
	};

	useEffect(() => {
		if (window.innerWidth < 1024) setScreenSize("mob");
		else setScreenSize("des");
		window.onresize = () => {
			if (window.innerWidth < 1024) setScreenSize("mob");
			else setScreenSize("des");
		};
		return () => {
			window.onresize = null;
		};
	}, []);

	return (
		<AppShell
			title={`Speakup - ${article.title}`}
			rootDivStyle="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto bg-neutral-100 pt-14 pb-16 scrollbar-hide overflow-x-hidden"
			navbarRetractable={true}
		>
			<div className="mx-auto w-11/12 max-w-3xl scrollbar-hide lg:px-4">
				<div className="mt-6 w-full lg:mt-10">
					<ArticleViewer article={article} showInteractions={false} />
					<div className="h-10" />
					<div className="mx-auto flex w-full justify-between lg:mb-4">
						<div className="w-full bg-neutral-50 pb-1 pt-0.5 lg:w-1/2 lg:min-w-[360px] lg:rounded-full lg:px-8">
							<StanceSelector
								viewingStance={viewingStance}
								screenSize={screenSize}
								setViewingStance={setViewingStance}
								updateSortMethod={updateSortMethod}
							/>
						</div>
						<div className="hidden lg:block">
							<SortSelector updateSortMethod={updateSortMethod} />
						</div>
					</div>
					<CommentField
						articleId={article.id}
						viewingStance={viewingStance as "sup" | "agn" | "both"}
						sortMethod={sortMethod}
					/>
				</div>
			</div>
		</AppShell>
	);
};

export default DiscussionBoard;

export const getStaticProps: GetStaticProps = async (context) => {
	const boardId = context?.params?.boardId as string;

	const data = await prisma.articles.findUnique({
		where: {
			id: boardId,
		},
		select: {
			id: true,
			title: true,
			tags: true,
			content: true,
			references: {
				select: {
					title: true,
					description: true,
					img: true,
					link: true,
				},
			},
			viewCount: true,
			author: {
				select: { name: true, profileImg: true },
			},
		},
	});

	if (!data) {
		return { notFound: true };
	}

	return {
		props: { article: data },
		revalidate: 600,
	};
};

export async function getStaticPaths() {
	const articleIds = await prisma.articles.findMany({
		select: { id: true },
	});

	const paths = articleIds.map((article) => ({
		params: { boardId: article.id },
	}));

	return { paths, fallback: "blocking" };
}
