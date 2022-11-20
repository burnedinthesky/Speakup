import { useState } from "react";

import Link from "next/link";
import { Burger, Drawer } from "@mantine/core";
import Navbar from "./Navbar";

const Header = () => {
    const [opened, setOpened] = useState<boolean>(false);

    return (
        <>
            <div
                className="fixed top-0 z-20 flex
                    h-14 w-screen items-center justify-between
                    border-b border-b-slate-400 bg-white px-6 lg:hidden"
            >
                <Burger
                    opened={opened}
                    onClick={() => {
                        setOpened((cur) => !cur);
                    }}
                    size="sm"
                ></Burger>

                <Link href="/home">
                    <img
                        className="my-auto h-8 -translate-x-1 lg:h-10"
                        src="/assets/logo-black.svg"
                        alt="logo"
                    />
                </Link>
                <div className="w-[18px]" />
            </div>
            <Drawer
                opened={opened}
                onClose={() => {
                    setOpened(false);
                }}
                withCloseButton={false}
                position="left"
                size={256}
            >
                <div className="relative h-[calc(100vh-56px)]">
                    <Navbar mobileShow={true} />
                </div>
            </Drawer>
        </>
    );
};

export default Header;
