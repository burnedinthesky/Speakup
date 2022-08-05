import React from "react";
import Link from "next/link";
import { Article } from "../../types/issueTypes";

const HomeNavCard = ({ cardContent }: { cardContent: Article }) => {
    return (
        <Link href={`/discussions/${cardContent.id}`}>
            <div className="flex w-full flex-shrink-0 cursor-pointer justify-between overflow-hidden rounded-2xl border-2 border-primary-800 bg-white pr-4 md:pr-7 xl:border-0">
                <div className="w-[4.5rem] flex-shrink-0 bg-primary-800 md:w-24"></div>
                <div className="h-full flex-grow px-4 py-3">
                    <h3 className="text-lg text-neutral-800 lg:text-xl">{cardContent.title}</h3>
                    <p className="mt-1 h-[48px] text-ellipsis text-neutral-700 line-clamp-2 lg:h-[96px] lg:line-clamp-4">
                        {cardContent.content[0]?.content}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default HomeNavCard;
