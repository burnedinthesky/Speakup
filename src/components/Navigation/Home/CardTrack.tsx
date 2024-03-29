import { useRef } from "react";
import { useInView } from "react-intersection-observer";

import { ScrollArea } from "@mantine/core";
import {
    ChevronDoubleRightIcon,
    SearchCircleIcon,
} from "@heroicons/react/outline";

import HomeNavCard from "./HomeNavCard";

import { NavCardData } from "../../../types/navigation.types";
import Link from "next/link";

interface CardTrackProps {
    title: string;
    cards: NavCardData[];
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
                <ScrollArea className="mt-4 pb-3.5" viewportRef={trackRef}>
                    <div className="flex h-48 grid-rows-1 gap-9">
                        {cards.map((card, i, arr) => (
                            <div
                                key={i}
                                className="w-[440px] flex-shrink-0"
                                ref={
                                    i === arr.length - 1
                                        ? lastCardRef
                                        : undefined
                                }
                            >
                                <HomeNavCard cardContent={card} />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="flex w-20 flex-shrink-0 items-center justify-center">
                    {inView ? (
                        title !== "為您推薦" && (
                            <Link href={`/search/results?tags=${title}`}>
                                <SearchCircleIcon className="w-8 text-primary-700" />
                            </Link>
                        )
                    ) : (
                        <button
                            className="text-primary-600"
                            onClick={() => {
                                if (!trackRef.current) return;
                                console.log("Hello");
                                trackRef.current.scrollTo({
                                    left: trackRef.current.scrollLeft + 200,
                                    behavior: "smooth",
                                });
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
