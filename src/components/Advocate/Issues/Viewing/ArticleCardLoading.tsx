const ArticleCardLoading = () => {
    return (
        <div className="w-full rounded-md border border-slate-200 p-4">
            <div className="my-0.5 h-5 w-3/4 animate-pulse rounded-md bg-slate-300 " />
            <div className="mt-2 flex flex-wrap gap-2">
                <div className="flex w-full flex-wrap items-center gap-1">
                    <div className="my-0.5 h-4 w-20 animate-pulse rounded-full bg-slate-300" />
                    <div className="my-0.5 h-4 w-12 animate-pulse rounded-full bg-slate-300" />
                </div>
                <div className="my-0.5 h-4 w-12 animate-pulse rounded-full bg-slate-300" />
                <div className="my-0.5 h-4 w-12 animate-pulse rounded-full bg-slate-300" />
                <div className="my-0.5 h-4 w-12 animate-pulse rounded-full bg-slate-300" />
            </div>
        </div>
    );
};

ArticleCardLoading.displayName = "ArticleCardLoading";

export default ArticleCardLoading;
