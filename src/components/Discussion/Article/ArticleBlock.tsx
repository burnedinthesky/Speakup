import { Spoiler } from "@mantine/core";
import { ArticleBlock } from "../../../types/article.types";

const ArticleBlock = ({ type, content, spoilerTitle }: ArticleBlock) => {
    const textSize =
        type === "h1"
            ? "text-2xl text-primary-800"
            : type === "h2"
            ? "text-xl text-primary-800"
            : type === "h3"
            ? "text-lg text-primary-800"
            : "text-base";
    if (type === "spoiler")
        return (
            <Spoiler
                maxHeight={0}
                showLabel={`展開${spoilerTitle}`}
                hideLabel={`收合${spoilerTitle}`}
                classNames={{
                    control: "text-xl leading-10 text-primary-800",
                }}
            >
                <p className="mb-2 text-base text-neutral-700">{content}</p>
            </Spoiler>
        );
    return <p className={`${textSize}`}>{content}</p>;
};
export default ArticleBlock;
