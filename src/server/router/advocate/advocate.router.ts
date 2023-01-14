import { articleRouter } from "./article.router";

import { commentsRouter } from "./comments.router";
import { router } from "server/trpc";

export const advocateRouter = router({
	articles: articleRouter,
	comments: commentsRouter,
});
