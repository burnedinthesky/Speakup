import Head from "next/head";
import ArticleViewer from "../../components/Discussion/Article/ArticleViewer";
import { Article } from "../../types/issueTypes";
import Header from "../../components/AppShell/Header";
import Navbar from "../../components/AppShell/Navbar";
import Footbar from "../../components/AppShell/Footbar";
import CommentField from "../../components/Discussion/Comments/CommentField";

import { SampleArticle } from "../../templateData/issues";

interface DiscussionProps {
    article: Article;
}

const DiscussionBoard = ({ article }: DiscussionProps) => {
    return (
        <>
            <Head>
                <title>{`Speakup - ${article.title}`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            <main className="fixed top-0 left-0 right-0 bottom-0 overflow-x-hidden overflow-y-auto bg-neutral-100 scrollbar-hide pt-14 pb-16">
                <Header />
                <Navbar retractable={true} />
                <Footbar />
                <div className="mx-auto w-11/12 max-w-3xl scrollbar-hide lg:px-4">
                    <div className="mt-6 w-full lg:mt-10">
                        <ArticleViewer article={article} />
                        <div className="h-10" />
                        <CommentField boardId={article.id} onSide="both" sortMethod={0} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default DiscussionBoard;

export async function getServerSideProps() {
    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/home`
    // );
    // const data = await res.json();

    return { props: { article: SampleArticle } };
}
