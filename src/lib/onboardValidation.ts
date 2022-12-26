import { UserInfoData } from "../components/Onboarding/UserInfo";

export const checkUserInfo = (data: UserInfoData) => {
	const currentYear = new Date().getFullYear();
	let errors: Record<"birthYear" | "birthMonth" | "gender", string | null> = {
		birthYear: null,
		birthMonth: null,
		gender: null,
	};

	if (data.birthYear === undefined) {
		errors.birthYear = "請輸入出生年";
	} else if (data.birthYear < currentYear - 100) {
		errors.birthYear = "請確認您的出生年輸入無誤";
	} else if (data.birthYear > currentYear - 13) {
		errors.birthYear = "年齡過小";
	}

	if (data.birthMonth === undefined) {
		errors.birthMonth = "請選擇出生月";
	}

	if (data.gender === undefined) {
		errors.gender = "請選擇性別";
	}

	const hasErrors =
		errors.birthYear !== null ||
		errors.birthMonth !== null ||
		errors.gender !== null;

	return {
		hasErrors: hasErrors,
		data: hasErrors
			? undefined
			: {
					birthYear: data.birthYear as number,
					birthMonth: data.birthMonth as number,
					gender: data.gender as "m" | "f" | "o",
			  },
		errors: errors,
	};
};

export const checkInterestedTopics = (topics: string[]) => {
	let errors: string | null = null;

	if (topics.length < 3) {
		errors = "請至少選擇三個標籤";
	} else if (topics.length > 5) {
		errors = "請最多選擇五個標籤";
	}

	return {
		data: topics,
		hasErrors: errors !== null,
		errors: errors,
	};
};
