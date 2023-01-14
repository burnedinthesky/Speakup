import { ArrowCircleUpIcon } from "@heroicons/react/outline";

const Comments = () => {
	return (
		<div className="relative h-full w-full pb-12">
			<div className="h-full w-full overflow-y-auto scrollbar-hide">
				<p className="text-md text-center text-neutral-700">留言介紹</p>
				<p className="mt-4 text-center leading-7 text-neutral-700">
					Speakup的留言回覆中，有個特別的按鈕
					<ArrowCircleUpIcon className="mx-2 my-2 inline w-6" /> <br />
					這個按鈕代表的意義是
					<span className="inline-block">
						「我不認同你的立場，但是我認為你講得有道理」
					</span>
					<br />
					<span className="mt-2 inline-block">
						<span className="inline-block">我們希望各位使用者，</span>
						<span className="inline-block">就算面對立場不同的論點，</span>
						<span className="inline-block">也能理性、有邏輯的辯論</span>
					</span>
				</p>
			</div>
		</div>
	);
};

export default Comments;
