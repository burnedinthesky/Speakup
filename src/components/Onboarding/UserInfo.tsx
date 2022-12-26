import { Chip, NativeSelect, NumberInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { checkUserInfo } from "../../lib/onboardValidation";
import { PageDataStages } from "../../pages/user/onboarding";

export interface UserInfoData {
	birthYear: number | undefined;
	birthMonth: number | undefined;
	gender: "m" | "f" | "o" | undefined;
}

export interface UserInfoErrors {
	birthYear: string | null;
	birthMonth: string | null;
	gender: string | null;
}

interface PageProps {
	pageStatus: PageDataStages;
	setPageStatus: (val: PageDataStages) => void;
	setData: (val: UserInfoData) => void;
}

const UserInfo = ({ pageStatus, setPageStatus, setData }: PageProps) => {
	//rome-ignore format:
	const birthMonths = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

	const [errors, setErrors] = useState<UserInfoErrors>({
		birthYear: "",
		birthMonth: "",
		gender: "",
	});

	const birthYearRef = useRef<HTMLInputElement>(null);
	const birthMonthRef = useRef<HTMLSelectElement>(null);
	const [gender, setGender] = useState<"m" | "f" | "o" | undefined>(undefined);

	useEffect(() => {
		if (pageStatus !== "validating") return;
		setErrors({
			birthYear: "",
			birthMonth: "",
			gender: "",
		});
		const {
			data,
			hasErrors,
			errors: errs,
		} = checkUserInfo({
			birthYear: birthYearRef.current?.value
				? parseInt(birthYearRef.current.value)
				: undefined,
			birthMonth: birthMonthRef.current?.selectedIndex ?? undefined,
			gender: gender,
		});
		if (!hasErrors && data) {
			setPageStatus("valPassed");
			setData(data);
		} else {
			setErrors(errs);
			setPageStatus("pendVal");
		}
	}, [pageStatus]);

	return (
		<>
			<p className="text-md text-center text-neutral-700">讓我們認識您</p>
			<div className="mt-6 flex w-full flex-col items-center">
				<p className="font-semibold">您的生日</p>
				<div className="flex w-full justify-center gap-4">
					<NumberInput
						label="出生年"
						placeholder="請輸入出生年"
						error={errors.birthYear}
						ref={birthYearRef}
						hideControls
					/>
					<NativeSelect
						label="出生月"
						data={birthMonths}
						error={errors.birthMonth}
						ref={birthMonthRef}
					/>
				</div>
			</div>
			<div className="mt-6 flex w-full flex-col items-center">
				<p className="font-semibold">您的性別</p>
				{errors.gender && (
					<p className="text-sm text-red-500">{errors.gender}</p>
				)}
				<Chip.Group
					mt={8}
					value={gender}
					onChange={(val: string) => setGender(val as "m" | "f" | "o")}
				>
					<Chip variant="filled" value="m">
						男
					</Chip>
					<Chip variant="filled" value="f">
						女
					</Chip>
					<Chip variant="filled" value="o">
						其他
					</Chip>
				</Chip.Group>
			</div>
		</>
	);
};

export default UserInfo;
