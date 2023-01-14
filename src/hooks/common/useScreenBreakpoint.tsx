import { useEffect, useState } from "react";
import { WidthBreakConversion, WidthBreakpoints } from "types/window.types";

const useScreenBreakpoint = () => {
	const [windowWidth, setWindowWidth] = useState<number>(0);
	const [windowBP, setWindowBP] = useState<WidthBreakpoints>("sml");

	useEffect(() => {
		const updateWindowWidth = () => {
			setWindowWidth(window.innerWidth);
			setWindowBP(WidthBreakConversion(window.innerWidth));
		};
		updateWindowWidth();
		window.addEventListener("resize", updateWindowWidth);
		return () => {
			window.removeEventListener("resize", updateWindowWidth);
		};
	}, []);

	return {
		ww: windowWidth,
		wbp: windowBP,
		wbpn: ["sml", "sm", "md", "lg", "xl", "2xl"].findIndex(
			(val) => val === windowBP,
		),
	};
};

export default useScreenBreakpoint;
