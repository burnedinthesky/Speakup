import algoliasearch from "algoliasearch";

// Connect and authenticate with your Algolia app
export const algoliaSearch = algoliasearch(
    "BB9MIIXCI1",
    process.env.ALGOLIA_SEARCH_API_KEY as string
);

// Create a new algArticleIndex and add a record
export const articleIndex = algoliaSearch.initIndex("articles");

export const algoliaMod = algoliasearch(
    "BB9MIIXCI1",
    process.env.ALGOLIA_MOD_API_KEY as string
);

export const articleIndexMod = algoliaMod.initIndex("articles");
