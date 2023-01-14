import { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";

import useScreenBreakpoint from "../../../hooks/common/useScreenBreakpoint";

import { Drawer, LoadingOverlay } from "@mantine/core";

import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleEditor from "../../../components/Advocate/Issues/Editor/ArticleEditor";
import ArticleProperties from "../../../components/Advocate/Issues/Editor/ArticleProperties";
import DesktopBlockProperties from "../../../components/Advocate/Issues/Editor/DesktopBlockProperties";

import { GetServerSideProps } from "next";
import { prisma } from "../../../utils/prisma";

import {
	ArticleBlock,
	TypeArticleTagValues,
} from "../../../types/article.types";
import {
	ArticleStatus,
	AvcArticle,
} from "../../../types/advocate/article.types";
import {
	articleContentAtom,
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "../../../atoms/advocate/articleEditorAtoms";

interface SelectorWrapperProps {
	opened: boolean;
	setOpened: (val: boolean) => void;
	children: JSX.Element;
}

const SelectorWrapper = ({
	opened,
	setOpened,
	children,
}: SelectorWrapperProps) => {
	const { wbpn } = useScreenBreakpoint();

	return wbpn > 2 ? (
		<div className="relative h-full w-72 flex-shrink-0 px-4 xl:w-80">
			<div className="absolute left-0 top-7 h-[calc(100%-56px)] border-r border-r-slate-300" />
			{children}
		</div>
	) : (
		<Drawer
			opened={opened}
			onClose={() => {
				setOpened(false);
			}}
			position="right"
			size={360}
		>
			<div className="mx-auto w-80">{children}</div>
		</Drawer>
	);
};

const BoardEditor = ({ article }: { article: AvcArticle }) => {
	const [editorInfo, setEditorInfo] = useRecoilState(articleEditorInfoAtom);
	const setArticleContent = useSetRecoilState(articleContentAtom);
	const setArticleProperties = useSetRecoilState(articlePropertiesAtom);
	const resetRcEditorInfo = useResetRecoilState(articleEditorInfoAtom);

	const [expandSelectionDrawer, setExpandSelectionDrawer] =
		useState<boolean>(false);

	useEffect(() => {
		setArticleContent(article.content);
		setArticleProperties({
			title: article.title,
			brief: article.brief,
			tags: article.tags,
			refLinks: article.references.map((ref) => ({
				data: ref,
				status: "fetched",
				url: ref.link,
			})),
		});
		resetRcEditorInfo();
	}, []);

	useEffect(() => {
		if (!editorInfo.queuedBlur) return;
		const timeout: NodeJS.Timeout = setTimeout(() => {
			console.log("trie");
			setEditorInfo((cur) => ({
				...cur,
				focusedBlock: cur.overrideBlur !== false ? cur.focusedBlock : null,
				overrideBlur: false,
				queuedBlur: false,
			}));
		}, 50);
		return () => {
			clearTimeout(timeout);
		};
	}, [editorInfo.queuedBlur]);

	return (
		<AppShell
			title={`Speakup - ${article ? article.title : "新議題"}`}
			highlight="issues"
		>
			<div className="flex h-full w-full lg:ml-64 lg:w-[calc(100%-256px)] relative">
				<LoadingOverlay visible={editorInfo.isSubmitting} />
				<div className="h-full w-full flex-grow-0 overflow-y-auto px-6 pt-10 pb-20 lg:px-12">
					<div className="mx-auto h-full max-w-3xl">
						<ArticleEditor
							articleId={article.id}
							modStatus={article.modStatus}
							setOpenAtcPropDrawer={setExpandSelectionDrawer}
						/>
					</div>
				</div>
				<SelectorWrapper
					opened={expandSelectionDrawer}
					setOpened={setExpandSelectionDrawer}
				>
					{editorInfo.focusedBlock !== null ? (
						<DesktopBlockProperties />
					) : (
						<ArticleProperties />
					)}
				</SelectorWrapper>
			</div>
		</AppShell>
	);
};

export default BoardEditor;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const boardId = context?.params?.boardId as string;

	const issue = await prisma.avcArticle.findUnique({
		where: {
			id: boardId,
		},
		select: {
			id: true,
			title: true,
			tags: true,
			brief: true,
			content: true,
			references: {
				select: {
					title: true,
					description: true,
					img: true,
					link: true,
				},
			},
			author: {
				select: {
					name: true,
					profileImg: true,
				},
			},
			articleInstance: {
				select: {
					viewCount: true,
					_count: { select: { arguments: true } },
				},
			},
			status: true,
		},
	});

	if (!issue) {
		return { notFound: true };
	}

	const data: AvcArticle = {
		id: issue.id,
		brief: issue.brief,
		author: issue.author,
		title: issue.title,
		tags: issue.tags as TypeArticleTagValues[],
		content: issue.content as ArticleBlock[],
		references: issue.references,
		viewCount: issue.articleInstance?.viewCount ?? null,
		argumentCount: issue.articleInstance?._count.arguments ?? null,
		modStatus: {
			state: issue.status?.status as ArticleStatus,
			desc: issue.status?.desc as string,
		},
		modPending: 0,
	};

	return {
		props: { article: data },
	};
};
