import { useRef, useState } from "react";
import {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { Button, Chip, NativeSelect, NumberInput } from "@mantine/core";

interface PageProps {
    prevPage?: () => void;
    nextPage?: () => void;
    setData: (birthTime: Date, gender: "m" | "f" | "o") => void;
}

const UserInfo = ({ prevPage, nextPage, setData }: PageProps) => {
    //prettier-ignore
    const birthMonths = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]

    const birthYearRef = useRef<HTMLInputElement>(null);
    const birthMonthRef = useRef<HTMLSelectElement>(null);
    const [gender, setGender] = useState<"m" | "f" | "o">();

    const [errors, setErrors] = useState({
        birthYear: "",
        birthMonth: "",
        gender: "",
    });

    const submitData = () => {
        if (!birthYearRef.current) throw new Error("Invalid birth year");
        if (!birthMonthRef.current) throw new Error("Invalid birth month");

        const birthYearStr = birthYearRef.current.value;
        const birthYear = parseInt(birthYearStr);
        const birthMonth = birthMonthRef.current.selectedIndex;

        const currentYear = new Date().getFullYear();
        setErrors({ birthYear: "", birthMonth: "", gender: "" });

        let hasErrors = false;

        if (!birthYearStr.length) {
            setErrors((cur) => ({
                ...cur,
                birthYear: "請輸入出生年",
            }));
            hasErrors = true;
        } else if (birthYear < currentYear - 100) {
            setErrors((cur) => ({
                ...cur,
                birthYear: "請確認您的出生年輸入無誤",
            }));
            hasErrors = true;
        } else if (birthYear > currentYear - 13) {
            setErrors((cur) => ({
                ...cur,
                birthYear: "年齡過小",
            }));
            hasErrors = true;
        }

        if (!gender) {
            setErrors((cur) => ({
                ...cur,
                gender: "請選擇性別",
            }));
            hasErrors = true;
        }

        if (!hasErrors)
            setData(
                new Date(`${birthYear}-${birthMonth + 1}-1`),
                gender as "m" | "f" | "o"
            );
        return !hasErrors;
    };

    return (
        <div className="relative h-full w-full pb-14">
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                <h1 className="text-5xl font-bold text-primary-700">
                    基本資料
                </h1>
                <p className="mt-14 text-2xl text-neutral-700">讓我們認識您</p>

                <div className="mt-6 w-full">
                    <p className="font-semibold">您的生日</p>
                    <div className="flex w-full gap-4">
                        <NumberInput
                            classNames={{ input: "bg-neutral-50" }}
                            label="出生年"
                            placeholder="請輸入出生年"
                            error={errors.birthYear}
                            hideControls
                            ref={birthYearRef}
                        />
                        <NativeSelect
                            classNames={{ input: "bg-neutral-50" }}
                            label="出生月"
                            data={birthMonths}
                            ref={birthMonthRef}
                        />
                    </div>
                </div>
                <div className="mt-6 w-full">
                    <p className="font-semibold">您的性別</p>
                    {errors.gender.length > 0 && (
                        <p className="text-sm text-red-500">{errors.gender}</p>
                    )}
                    <Chip.Group
                        mt={8}
                        value={gender}
                        onChange={(val: string) => {
                            setGender(val as "m" | "f" | "o");
                        }}
                    >
                        <Chip
                            classNames={{ label: "bg-neutral-50" }}
                            variant="filled"
                            value="m"
                        >
                            男
                        </Chip>
                        <Chip
                            classNames={{ label: "bg-neutral-50" }}
                            variant="filled"
                            value="f"
                        >
                            女
                        </Chip>
                        <Chip
                            classNames={{ label: "bg-neutral-50" }}
                            variant="filled"
                            value="o"
                        >
                            其他
                        </Chip>
                    </Chip.Group>
                </div>
            </div>

            {prevPage && (
                <Button
                    className="absolute left-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={prevPage}
                >
                    上一頁
                    <ArrowNarrowLeftIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
            {nextPage && (
                <Button
                    className="absolute right-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={() => {
                        if (submitData()) nextPage();
                    }}
                >
                    繼續
                    <ArrowNarrowRightIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default UserInfo;
