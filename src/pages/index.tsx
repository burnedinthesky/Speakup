import { ChevronRightIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Speakup</title>
                <meta
                    name="description"
                    content="為重要議題的交流 提供理性溝通的空間"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden ">
                <div className="relative flex h-16 w-screen items-center justify-center bg-primary-50 px-11 ">
                    <img
                        className="h-10"
                        src="/assets/logo-black.svg"
                        alt="logo"
                    />
                    <div className="absolute right-11 hidden flex-grow-0 items-center gap-8 lg:flex">
                        <Link href="/user/signup">
                            <div className="hidden  cursor-pointer items-center rounded-md bg-primary-600 px-4 py-2 lg:flex">
                                <p className="text-center text-sm text-white">
                                    開始使用
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="relative mt-20 h-[30vw] w-full">
                    <div className="mt-12">
                        <h1 className="text-center text-5xl font-bold leading-[60px] lg:pt-24 lg:text-7xl lg:leading-[84px]">
                            <span className="inline-block">為重要議題</span>
                            <span className="inline-block">
                                的
                                <span className="bg-gradient-to-br from-primary-700 to-primary-400 bg-clip-text text-transparent">
                                    交流
                                </span>
                            </span>
                            <br />
                            <span className="inline-block">提供</span>
                            <span className="bg-gradient-to-br from-primary-900 to-primary-500 bg-clip-text text-transparent">
                                理性溝通
                            </span>
                            <span className="inline-block">的空間</span>
                        </h1>
                        <div className=" h-10"></div>
                        <p className=" mx-5 text-center text-2xl leading-[40px]">
                            在Speakup，我們致力於創造一個更理性的溝通環境
                            <br />
                            使得我們可以進行深度的議題討論，而非僅僅彼此謾罵
                        </p>
                        <div className="h-10"></div>
                        <Link href="/user/signup">
                            <div className="mx-auto flex w-48 cursor-pointer items-center justify-around rounded-lg bg-primary-600 py-2 px-6">
                                <p className="text-2xl text-white">加入討論</p>
                                <ChevronRightIcon className="h-6 text-white" />
                            </div>
                        </Link>
                        <div className="h-20 lg:h-40"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
