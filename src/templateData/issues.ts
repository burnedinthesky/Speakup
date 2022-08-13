import { Article } from "../types/issueTypes";

export const SampleArticle: Article = {
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
    viewCount: 0,
    author: {
        username: "Hello",
        pfp: "sjkldf",
    },
    furtherReading: [
        { title: "Google", link: "https://www.google.com" },
        { title: "Google", link: "https://www.google.com" },
        { title: "Google", link: "https://www.google.com" },
    ],
    commentCount: 0,
};
