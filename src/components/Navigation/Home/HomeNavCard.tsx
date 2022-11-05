import { Avatar } from "@mantine/core";
import Link from "next/link";
import { NavCardData } from "../../../types/navigation.types";

const HomeNavCard = ({ cardContent }: { cardContent: NavCardData }) => {
    return (
        <Link href={`/discussion/${cardContent.id}`}>
            <div className="flex h-40 w-full flex-shrink-0 justify-between overflow-hidden rounded-2xl border-2 border-primary-800 bg-neutral-50 pr-4 md:pr-7 xl:border-2 ">
                <div className="flex w-[4.5rem] flex-shrink-0 flex-col items-center justify-center bg-primary-800 text-white md:w-24">
                    {cardContent.tags.map((tag, i) => (
                        <p key={i}>#{tag}</p>
                    ))}
                </div>
                <div className="h-full flex-grow px-4 py-3">
                    <h3 className="text-lg text-neutral-800 lg:text-xl">
                        {cardContent.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                        <Avatar
                            src={cardContent.author.profileImg}
                            alt={cardContent.author.name}
                            size="sm"
                            radius="xl"
                        >
                            {cardContent.author.name[0]}
                        </Avatar>
                        <p className="text-sm text-primary-800">
                            {cardContent.author.name}
                        </p>
                    </div>
                    <p className="mt-2 h-[48px] text-ellipsis text-sm text-neutral-700 line-clamp-2 lg:h-[60px] lg:line-clamp-3 ">
                        {cardContent.brief}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default HomeNavCard;
