interface IconProps {
	className?: string;
	varient?: "outline" | "filled";
}

const DownvoteIcon = ({ className, varient }: IconProps) => {
	return (
		<svg
			className={className}
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{varient === "filled" ? (
				<path
					className="fill-inherit"
					d="M16.2192 8.8604C16.3581 8.95302 16.4665 9.08478 16.5305 9.239C16.5928 9.39368 16.6088 9.56319 16.5763 9.72679C16.5438 9.89038 16.4644 10.041 16.3477 10.1601L9.59765 16.9101C9.43843 17.0673 9.22371 17.1554 9 17.1554C8.77628 17.1554 8.56156 17.0673 8.40234 16.9101L1.65234 10.1601C1.53562 10.041 1.45617 9.89038 1.4237 9.72679C1.39123 9.56319 1.40716 9.39368 1.46953 9.239C1.53353 9.08478 1.64186 8.95302 1.7808 8.8604C1.91973 8.76778 2.08302 8.71846 2.25 8.71869H4.78125V3.37494C4.78309 3.00255 4.93185 2.64594 5.19517 2.38261C5.45849 2.11929 5.8151 1.97054 6.1875 1.96869H11.8125C12.1849 1.97054 12.5415 2.11929 12.8048 2.38261C13.0681 2.64594 13.2169 3.00255 13.2187 3.37494V8.71869H15.75C15.917 8.71846 16.0803 8.76778 16.2192 8.8604Z"
				/>
			) : (
				<path
					className="fill-inherit"
					d="M16.5305 9.23906C16.4665 9.08484 16.3582 8.95308 16.2193 8.86046C16.0803 8.76784 15.917 8.71852 15.7501 8.71875H13.2188V3.375C13.217 3.00261 13.0682 2.646 12.8049 2.38267C12.5416 2.11935 12.1849 1.9706 11.8126 1.96875H6.18756C5.81517 1.9706 5.45855 2.11935 5.19523 2.38267C4.93191 2.646 4.78315 3.00261 4.78131 3.375V8.71875H2.25006C2.08308 8.71852 1.91979 8.76784 1.78086 8.86046C1.64192 8.95308 1.5336 9.08484 1.46959 9.23906C1.40722 9.39374 1.39129 9.56325 1.42376 9.72685C1.45623 9.89044 1.53568 10.041 1.6524 10.1602L8.4024 16.9102C8.56162 17.0673 8.77634 17.1554 9.00006 17.1554C9.22378 17.1554 9.43849 17.0673 9.59771 16.9102L16.3477 10.1602C16.4644 10.041 16.5439 9.89044 16.5764 9.72685C16.6088 9.56325 16.5929 9.39374 16.5305 9.23906ZM9.00006 15.1172L4.28912 10.4062H5.62506C5.84883 10.4062 6.06344 10.3174 6.22168 10.1591C6.37991 10.0009 6.46881 9.78628 6.46881 9.5625V3.65625H11.5313V9.5625C11.5313 9.78628 11.6202 10.0009 11.7784 10.1591C11.9367 10.3174 12.1513 10.4062 12.3751 10.4062H13.711L9.00006 15.1172Z"
				/>
			)}
		</svg>
	);
};

export default DownvoteIcon;
