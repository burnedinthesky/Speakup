import { MultiSelect, Textarea } from "@mantine/core";
import { useRecoilState } from "recoil";
import { articlePropertiesAtom } from "../../../../atoms/advocate/articleEditorAtoms";
import { ArticleTags, ArticleTagValues } from "../../../../types/article.types";

const ArticleProperties = () => {
    const [properties, setProperties] = useRecoilState(articlePropertiesAtom);

    const tags = ArticleTagValues;

    return (
        <div className="mt-24 w-full">
            <h3 className="text-xl font-bold">議題設定</h3>
            <MultiSelect
                className="mt-4"
                classNames={{
                    searchInput: "outline-none",
                }}
                label="議題標籤"
                description="請選擇一到四個標籤"
                data={tags}
                value={properties.tags}
                onChange={(val: string[]) => {
                    setProperties((data) => {
                        return {
                            ...data,
                            tags: val as ArticleTags[],
                        };
                    });
                }}
                searchable
                maxSelectedValues={4}
                error={properties.errors.tags}
            />
            <Textarea
                className="mt-4"
                label="議題簡介"
                description="請在六十字內描述您的議題"
                value={properties.brief}
                onChange={(e) => {
                    const updateVal = e.currentTarget.value;
                    setProperties((cur) => ({
                        ...cur,
                        brief: updateVal,
                    }));
                }}
                error={properties.errors.brief}
                autosize
            />
        </div>
    );
};

export default ArticleProperties;
