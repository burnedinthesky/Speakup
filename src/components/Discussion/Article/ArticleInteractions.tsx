import { useState } from "react";

import { FlagIcon, ShareIcon } from "@heroicons/react/outline";

import ShareDialog from "./ShareDialog";
import AddToCollection from "../../Navigation/Collections/AddToCollection";

import { useRouter } from "next/router";

interface ArticleInteractionProps {
    articleId: string;
}

const ArticleInteractions = ({ articleId }: ArticleInteractionProps) => {
    const router = useRouter();
    const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);

    return (
        <div className="flex gap-2">
            <button>
                <AddToCollection
                    articleId={articleId}
                    classNames={{
                        bookmarkIcon: "h-7 text-primary-700",
                        collectText: "hidden",
                    }}
                />
            </button>
            <button
                onClick={async () => {
                    if (navigator.share) {
                        await navigator.share({
                            title: "分享這則議題",
                            url: `https://speakup.place/${router.pathname}`,
                        });
                    } else setOpenShareMenu(true);
                }}
            >
                <ShareIcon className="h-7 w-7 text-primary-700" />
            </button>
            <ShareDialog
                opened={openShareMenu}
                closeFn={() => {
                    setOpenShareMenu(false);
                }}
                url={`https://speakup.place/${router.pathname}`}
            />
            <button>
                <FlagIcon className="h-7 w-7 text-primary-700" />
            </button>
        </div>
    );
};

export default ArticleInteractions;
