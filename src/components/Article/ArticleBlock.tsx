import { Spoiler } from "@mantine/core";
import { ArticleBlock } from "../../types/article.types";

const ArticleBlock = ({
    type,
    content,
    spoilerTitle,
    styles,
}: ArticleBlock) => {
    const blockStyles = {
        h1: styles?.h1 ? styles.h1 : "text-2xl text-primary-800",
        h2: styles?.h2 ? styles.h2 : "text-xl text-primary-800",
        h3: styles?.h3 ? styles.h3 : "text-lg text-primary-800",
        p: styles?.p ? styles.p : "text-base",
    };

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

    const textSize = blockStyles[type];
    return <p className={`${textSize}`}>{content}</p>;
};
export default ArticleBlock;
