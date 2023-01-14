export interface ConfigParams {
    title: string;
    options: { key: string; text: string }[];
    maxReasons: number;
    allowOther: boolean;
}
export const ReportConfigs: { [key: string]: ConfigParams } = {
    article: {
        title: "請問您認為此留言有什麼問題？",
        options: [
            { key: "irrelevant", text: "內容與討論無關" },
            { key: "spam", text: "廣告或洗版訊息" },
            { key: "hatred", text: "散播仇恨言論或人生攻擊" },
            { key: "sexual", text: "含有煽情露骨內容" },
            { key: "terrorism", text: "散播恐怖主義" },
        ],
        maxReasons: 3,
        allowOther: true,
    },
    argument: {
        title: "請問您認為此留言有什麼問題？",
        options: [
            { key: "irrelevant", text: "內容與討論無關" },
            { key: "spam", text: "廣告或洗版訊息" },
            { key: "hatred", text: "散播仇恨言論或人生攻擊" },
            { key: "sexual", text: "含有煽情露骨內容" },
            { key: "terrorism", text: "散播恐怖主義" },
        ],
        maxReasons: 3,
        allowOther: true,
    },
    comment: {
        title: "請問您認為此留言有什麼問題？",
        options: [
            { key: "irrelevant", text: "內容與討論無關" },
            { key: "spam", text: "廣告或洗版訊息" },
            { key: "hatred", text: "散播仇恨言論或人生攻擊" },
            { key: "sexual", text: "含有煽情露骨內容" },
            { key: "terrorism", text: "散播恐怖主義" },
        ],
        maxReasons: 3,
        allowOther: true,
    },
};
