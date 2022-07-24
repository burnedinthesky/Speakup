import Head from "next/head";
import ArticleViewer from "../../components/discussion/ArticleViewer";
import { Article } from "../../types/issueTypes";

interface DiscussionProps {
    article: Article;
}

const DiscussionBoard = (/*{article}: DiscussionProps*/) => {
    const article: Article = {
        id: "1234",
        title: "Sth",
        tags: ["stg"],
        content: [
            {
                type: "h1",
                content: "Heading 1",
            },
            {
                type: "p",
                content:
                    "Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
            },
            {
                type: "h2",
                content: "Heading 2",
            },
            {
                type: "p",
                content:
                    "Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
            },
            {
                type: "h3",
                content: "Heading 3",
            },
            {
                type: "p",
                content:
                    "Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
            },
            {
                type: "p",
                content:
                    "Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
            },
            {
                type: "spoiler",
                spoilerTitle: "Hello",
                content:
                    "Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
            },
        ],
        views: 0,
        author: {
            username: "Hello",
            pfp: "sjkldf",
        },
        furtherReading: [
            { title: "Google", link: "https://www.google.com" },
            { title: "Google", link: "https://www.google.com" },
            { title: "Google", link: "https://www.google.com" },
        ],
    };

    return (
        <>
            <Head>
                <title>{`Speakup - ${article.title}`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <main className="fixed top-0 left-0 right-0 bottom-0 overflow-x-hidden overflow-y-auto bg-neutral-100 scrollbar-hide pb-16">
                <div className="mx-auto w-11/12 max-w-3xl scrollbar-hide lg:px-4">
                    <div className="mt-6 w-full lg:mt-10">
                        <ArticleViewer article={article} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default DiscussionBoard;
