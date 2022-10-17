import Link from "next/link";
import { ChatAlt2Icon, EyeIcon } from "@heroicons/react/outline";
import { Avatar } from "@mantine/core";
import { NavCardData } from "../../schema/navigation.schema";

interface NavCardProps {
    cardContent: NavCardData;
    showDetails: boolean;
}

const NavCard = ({ cardContent, showDetails }: NavCardProps) => {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return (
        <Link href={`/discussion/${cardContent.id}`}>
            <div className="flex w-full cursor-pointer justify-between overflow-hidden rounded-2xl bg-white pr-4 md:pr-7">
                <div className="w-[4.5rem] flex-shrink-0 bg-primary-700  md:w-24"></div>
                <div className="h-full flex-grow px-4 py-3">
                    <h3 className=" text-lg text-neutral-800 md:text-xl">
                        {cardContent.title}
                    </h3>
                    <p className="mt-1 h-[72px] text-ellipsis text-neutral-700 line-clamp-3">
                        {cardContent.brief}
                    </p>
                </div>
                <div
                    className={`hidden w-24 flex-shrink-0 flex-col justify-end gap-1 pb-4 text-primary-600 ${
                        showDetails && "md:flex"
                    }`}
                >
                    <div className="flex items-center overflow-hidden text-ellipsis">
                        <Avatar
                            src={cardContent.author.profileImg}
                            size={24}
                            radius="xl"
                            color="cyan"
                            className="mr-2"
                        >
                            {cardContent.author.username[0]}
                        </Avatar>
                        <div className="h-4 w-[calc(100%-32px)] truncate text-xs">
                            {cardContent.author.username}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <EyeIcon className="mr-2 h-6 w-6 flex-shrink-0" />
                        <p className="text-xs">
                            {formatter.format(cardContent.viewCount)}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <ChatAlt2Icon className="mr-2 h-6 w-6 flex-shrink-0" />
                        <p className="text-xs">
                            {formatter.format(cardContent.argumentCount)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NavCard;
