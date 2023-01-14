import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { trpc } from "utils/trpc";
import { showNotification } from "@mantine/notifications";

import { checkArticleData } from "lib/advocate/articleEditor";
import { showErrorNotification } from "lib/errorHandling";
import {
	articleContentAtom,
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "atoms/advocate/articleEditorAtoms";

const useSubmitArticle = ({ articleId }: { articleId: string | null }) => {
	const router = useRouter();

	const articleContent = useRecoilValue(articleContentAtom);
	const setEditorInfo = useSetRecoilState(articleEditorInfoAtom);
	const atcProperties = useRecoilValue(articlePropertiesAtom);

	const onMutationSuccess = (id: string) => {
		showNotification({
			title: "更新成功",
			message: "我們正在為您重整資料",
		});
		if (id !== articleId) router.push(`/advocate/issues/${id}`);
		else router.reload();
	};

	const onMutationFailed = (error: any) => {
		if (error.message === "Article with title exists")
			setEditorInfo((cur) => ({
				...cur,
				errors: {
					...cur.errors,
					title: "本標題與其他議題重複",
				},
			}));
		else
			showErrorNotification({
				message: "發生錯誤，請再試一次",
			});
	};

	const createArticleMutation =
		trpc.advocate.articles.createArticle.useMutation({
			onSuccess: (data) => onMutationSuccess(data.id),
			onError: (error) => onMutationFailed(error),
		});
	const updateArticleMutation =
		trpc.advocate.articles.updateArticle.useMutation({
			onSuccess: (data) => onMutationSuccess(data.id),
			onError: (error) => onMutationFailed(error),
		});

	useEffect(() => {
		setEditorInfo((cur) => ({
			...cur,
			isSubmitting:
				createArticleMutation.isLoading || updateArticleMutation.isLoading,
		}));
	}, [createArticleMutation.isLoading, updateArticleMutation.isLoading]);

	const submitData = () => {
		setEditorInfo((cur) => ({
			...cur,
			errors: {
				title: null,
				tags: null,
				brief: null,
				content: null,
				refLinks: null,
			},
		}));

		const dataErrors = checkArticleData({
			title: atcProperties.title,
			brief: atcProperties.brief,
			tags: atcProperties.tags,
			content: articleContent,
			refLinks: atcProperties.refLinks,
		});

		if (dataErrors) {
			setEditorInfo((cur) => ({
				...cur,
				errors: {
					title: dataErrors.title,
					content: dataErrors.content,
					refLinks: dataErrors.refLinks,
					brief: dataErrors.brief,
					tags: dataErrors.tags,
				},
			}));

			return;
		}

		if (articleId === null)
			createArticleMutation.mutate({
				title: atcProperties.title,
				brief: atcProperties.brief,
				tags: atcProperties.tags,
				content: articleContent,
				references: atcProperties.refLinks.map((link) => link.url),
			});
		else
			updateArticleMutation.mutate({
				id: articleId,
				title: atcProperties.title,
				brief: atcProperties.brief,
				tags: atcProperties.tags,
				content: articleContent,
				references: atcProperties.refLinks.map((link) => link.url),
			});
	};

	return {
		submitData,
		isLoading:
			createArticleMutation.isLoading || updateArticleMutation.isLoading,
	};
};

export default useSubmitArticle;
