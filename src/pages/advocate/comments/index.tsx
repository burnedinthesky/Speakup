import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";

import { AppShell } from "components/Advocate/AppShell";
import ArticleComments from "components/Advocate/Comments/ArticleComments";

import { prisma } from "utils/prisma";

interface FetchedArticles {
	articles: { id: string; title: string }[];
}

const CommentManagement = ({ articles }: FetchedArticles) => {
	return (
		<AppShell title="Speakup - 留言管理" highlight="comments">
			<div className="px-6 pt-10 pb-40 lg:ml-64 lg:px-12">
				<div className="mx-auto max-w-6xl">
					<h1 className="text-3xl font-bold">留言管理</h1>
					<div className="mt-4 flex flex-col gap-10">
						{articles.map((article) => (
							<ArticleComments
								key={article.id}
								articleId={article.id}
								articleTitle={article.title}
							/>
						))}
					</div>
				</div>
			</div>
		</AppShell>
	);
};

export default CommentManagement;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = await getToken({ req: context.req });

	if (!token) {
		return { notFound: true };
	}

	const data = await prisma.articles.findMany({
		where: {
			authorId: token.id,
		},
		select: {
			id: true,
			title: true,
		},
	});

	return {
		props: { articles: data },
	};
};
