import { Fragment } from "react";
import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleComments from "../../../components/Advocate/Comments/ArticleComments";

const CommentManagement = () => {
    const articles: { id: string; title: string }[] = [
        {
            id: "clafjfp630000v5bkjjpb77m1",
            title: "應該以學習歷程作為大學選才管道嗎?",
        },
        {
            id: "clahojc2s0000v5c5bv264ri5",
            title: "威爾史密斯的奧斯卡獎應該因為閃巴掌被收回嗎?",
        },
    ];

    return (
        <AppShell title="Speakup - 留言管理" highlight="comments">
            <div className="ml-64 px-12 pt-10 pb-40">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold">留言管理</h1>
                    <div className="mt-10 flex flex-col gap-10">
                        {articles.map((article) => (
                            <Fragment key={article.id}>
                                <ArticleComments
                                    articleId={article.id}
                                    articleTitle={article.title}
                                />
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default CommentManagement;
