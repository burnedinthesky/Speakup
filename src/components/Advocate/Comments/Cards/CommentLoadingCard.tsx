const CommentLoadingCard = () => {
    return (
        <div className="flex min-h-[208px] w-full flex-col rounded-md border border-slate-100 p-3 shadow-sm">
            <div className="my-1 h-4 w-14 animate-pulse rounded-md bg-slate-300" />
            <div className="my-2 h-32">
                <div className="my-1 h-5 w-full animate-pulse rounded-md bg-slate-300" />
                <div className="my-1 h-5 w-full animate-pulse rounded-md bg-slate-300" />
                <div className="my-1 h-5 w-full animate-pulse rounded-md bg-slate-300" />
                <div className="my-1 h-5 w-24 animate-pulse rounded-md bg-slate-300" />
            </div>
        </div>
    );
};

export default CommentLoadingCard;
