import { useEffect, useState } from "react";

const useScreenSize = () => {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        updateWindowWidth();
        window.addEventListener("resize", updateWindowWidth);
        return () => {
            window.removeEventListener("resize", updateWindowWidth);
        };
    }, []);

    return windowWidth;
};

export default useScreenSize;
