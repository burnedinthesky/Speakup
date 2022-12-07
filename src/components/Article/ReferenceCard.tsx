import { Image } from "@mantine/core";
import type { ReferencesLink } from "../../types/article.types";

interface ReferenceCardProps {
    data: ReferencesLink;
}

const ReferenceCard = ({ data }: ReferenceCardProps) => {
    return (
        <a
            href={data.link}
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="flex h-20 w-full gap-4 overflow-hidden rounded-md border border-neutral-700">
                <Image
                    className="flex-shrink-0"
                    width={80}
                    height={80}
                    src={data.img}
                    alt="預覽連結圖像"
                    withPlaceholder
                />
                <div className="my-2 mr-2 flex-grow text-ellipsis">
                    <h3 className="font-medium">{data.title}</h3>
                    <p className="text-ellipsis text-sm text-neutral-500 line-clamp-2">
                        {data.description}
                    </p>
                </div>
            </div>
        </a>
    );
};

export default ReferenceCard;
