import React, { useState, useEffect } from "react";
import { ClipboardCopyIcon, SearchIcon } from "@heroicons/react/outline";
import Header from "../../components/AppShell/Header";
import Navbar from "../../components/AppShell/Navbar";
import Footbar from "../../components/AppShell/Footbar";
import { ArticleTagValues } from "../../schema/article.schema";
import { TextInput } from "@mantine/core";
import Head from "next/head";

const SearchMenu = () => {
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("AuthToken")) {
            window.location.href = "/login";
        }
    }, []);

    const tags = ArticleTagValues;

    const formSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchText !== "") {
            window.location.href = `/search/results?searchterm=${searchText}`;
        }
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-screen bg-neutral-50 lg:bg-neutral-100">
            <Head>
                <title>{`Speakup - 搜尋`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <Header />
            <Navbar retractable={false} />
            <Footbar />
            <div className="lg:ml-64">
                <div className="mx-auto mt-14 max-w-3xl px-8 py-5 md:mt-[20vh] lg:rounded-2xl">
                    <form
                        className="relative flex h-8 w-full items-center lg:h-14"
                        onSubmit={formSubmit}
                    >
                        <TextInput
                            className="w-full "
                            classNames={{
                                input: "h-10 rounded-2xl lg:h-16 lg:text-lg",
                            }}
                            placeholder="搜尋議題名字或是#標籤"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                            rightSection={
                                <button className=" h-5" type="submit">
                                    <SearchIcon className="h-full w-full" />
                                </button>
                            }
                        />
                    </form>
                    <div className="mx-auto my-7 w-full text-primary-800">
                        <h2 className="my-3 text-xl lg:my-4 lg:text-2xl">
                            #推薦標籤
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-5">
                            {tags.map((tag, i) => (
                                <button
                                    key={i}
                                    className=" bg-white-100 flex gap-2 rounded-lg border-[1px] border-primary-700 bg-white px-2 py-1"
                                    onClick={() => {
                                        window.location.href = `/search/results?searchterm=@${tag}`;
                                    }}
                                >
                                    <ClipboardCopyIcon className="h-6 w-6" />
                                    <p className="my-auto text-sm lg:text-lg">
                                        {tag}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchMenu;
