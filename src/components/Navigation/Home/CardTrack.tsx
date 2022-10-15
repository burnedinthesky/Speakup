import { useInView } from "react-intersection-observer";
import {
    ChevronDoubleRightIcon,
    SearchCircleIcon,
} from "@heroicons/react/outline";
import HomeNavCard from "./HomeNavCard";

import { Article } from "../../../schema/article.schema";
import { useRef } from "react";

interface CardTrackProps {
    title: string;
    cards: Article[];
}

const CardTrack = ({ title, cards }: CardTrackProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const { ref: lastCardRef, inView } = useInView({
        threshold: 0.5,
    });

    return (
        <div>
            <h2 className="text-2xl text-primary-800">{title}</h2>
            <div className="flex">
                <div
                    className="mt-4 flex gap-9 overflow-x-auto pb-3.5"
                    ref={trackRef}
                >
                    {cards.map((card, i, arr) => (
                        <div
                            key={i}
                            className="w-96 flex-shrink-0"
                            ref={i === arr.length - 1 ? lastCardRef : undefined}
                        >
                            <HomeNavCard cardContent={card} />
                        </div>
                    ))}
                </div>
                <div className="flex w-20 flex-shrink-0 items-center justify-center">
                    {inView ? (
                        <a
                            href={"/search"}
                            // href={`/search/results?searchterm=@${track.title}`}
                            className="w-8 rounded-full text-primary-700"
                        >
                            <SearchCircleIcon />
                        </a>
                    ) : (
                        <button
                            className="text-primary-600"
                            onClick={() => {
                                if (trackRef.current)
                                    trackRef.current.scrollLeft += 300;
                            }}
                        >
                            <ChevronDoubleRightIcon className="w-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardTrack;
