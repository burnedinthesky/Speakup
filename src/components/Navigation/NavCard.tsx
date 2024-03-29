import { useState } from "react";

import Link from "next/link";
import { Avatar } from "@mantine/core";
import { ChatAlt2Icon } from "@heroicons/react/outline";

import AddToCollection from "./Collections/AddToCollection";
import CreateColSetModal from "./Collections/CreateCollectionsSetModal";

import { NavCardData } from "../../types/navigation.types";

interface NavCardProps {
    cardContent: NavCardData;
    showDetails: boolean;
}

const NavCard = ({ cardContent, showDetails }: NavCardProps) => {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return (
        <div className="flex w-full justify-between overflow-hidden rounded-lg bg-white pr-4 md:pr-7 lg:rounded-2xl">
            <div className="flex w-[4.5rem] flex-shrink-0 flex-col items-center justify-center bg-primary-700 text-white md:w-24">
                {cardContent.tags.map((ele, i) => (
                    <p key={i}>#{ele}</p>
                ))}
            </div>
            <div className="h-full flex-grow py-3 pl-4 md:pr-4">
                <Link href={`/discussion/${cardContent.id}`}>
                    <h3 className="text-lg text-neutral-800 md:text-xl">
                        {cardContent.title}
                    </h3>
                </Link>
                <div className={`my-2 flex w-32 gap-4 text-primary-600 `}>
                    <div className="flex items-center">
                        <Avatar
                            src={cardContent.author.profileImg}
                            size={24}
                            radius="xl"
                            color="cyan"
                            className="mr-2"
                        >
                            {cardContent.author.name[0]}
                        </Avatar>
                        <div className="h-4 max-w-[160px] truncate text-xs">
                            {cardContent.author.name}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <ChatAlt2Icon className="mr-2 h-5 flex-shrink-0 md:h-6" />
                        <p className="text-xs">
                            {formatter.format(cardContent.argumentCount)}
                        </p>
                    </div>
                    <AddToCollection
                        articleId={cardContent.id}
                        classNames={{
                            bookmarkIcon: "h-5 flex-shrink-0 md:h-6",
                            collectText: "w-10 text-xs",
                        }}
                    />
                </div>
                <Link href={`/discussion/${cardContent.id}`}>
                    <p className="mt-1 text-ellipsis text-sm text-neutral-700 line-clamp-3 md:text-base">
                        {cardContent.brief}
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default NavCard;
