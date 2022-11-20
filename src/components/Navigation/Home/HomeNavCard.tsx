import { Avatar, Badge } from "@mantine/core";
import Link from "next/link";
import { NavCardData } from "../../../types/navigation.types";

const HomeNavCard = ({ cardContent }: { cardContent: NavCardData }) => {
    return (
        <Link href={`/discussion/${cardContent.id}`}>
            <div
                className="
                    relative flex h-full w-full flex-shrink-0 items-center justify-end overflow-hidden 
                    border-b border-neutral-400 bg-neutral-50 pr-4 md:pr-7 lg:rounded-2xl 
                    lg:border-2 lg:border-primary-800 lg:pl-24
                "
            >
                <div className="absolute top-0 left-0 bottom-0 hidden w-[4.5rem] flex-shrink-0 flex-col items-center justify-center bg-primary-800 text-white md:w-24 lg:flex">
                    {cardContent.tags.map((tag, i) => (
                        <p key={i}>#{tag}</p>
                    ))}
                </div>
                <div className="flex h-full flex-grow flex-col justify-center px-2 py-3 lg:px-4">
                    <h3 className="text-lg text-neutral-800 line-clamp-2 lg:text-xl">
                        {cardContent.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2 lg:hidden">
                            {cardContent.tags.map((tag, i) => (
                                <Badge
                                    variant="light"
                                    className="bg-primary-100"
                                    classNames={{ inner: "font-light" }}
                                    key={i}
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <p className="mt-2 text-ellipsis text-sm text-neutral-700 line-clamp-3 ">
                        {cardContent.brief}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default HomeNavCard;
