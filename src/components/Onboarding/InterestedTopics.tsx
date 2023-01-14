import { useEffect, useState } from "react";

import { Chip } from "@mantine/core";
import { checkInterestedTopics } from "lib/onboardValidation";

import { ArticleTagValues } from "types/article.types";
import type { PageDataStages } from "pages/user/onboarding";

interface PageProps {
	pageStatus: PageDataStages;
	setPageStatus: (val: PageDataStages) => void;
	setData: (topics: string[]) => void;
}

const InterestedTopics = ({
	pageStatus,
	setPageStatus,
	setData,
}: PageProps) => {
	const tags = ArticleTagValues;

	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (pageStatus !== "validating") return;
		setError(null);
		const res = checkInterestedTopics(selectedTags);
		if (!res.hasErrors) {
			setData(res.data);
			setPageStatus("valPassed");
		} else {
			setError(res.errors);
			setPageStatus("pendVal");
		}
	}, [pageStatus]);

	return (
		<>
			<p className="text-md text-center text-neutral-700">
				請選擇三到五個您感興趣的標籤
			</p>

			{error && (
				<p className="mt-4 text-center text-sm text-red-500">{error}</p>
			)}
			<div className="mt-6 w-full">
				<div className="flex w-full gap-4">
					<Chip.Group
						className="justify-center"
						value={selectedTags}
						onChange={setSelectedTags}
						multiple
					>
						{tags.map((tag, i) => (
							<Chip
								key={i}
								value={tag}
								variant="filled"
								disabled={
									selectedTags.length >= 5 && !selectedTags.includes(tag)
								}
							>
								{tag}
							</Chip>
						))}
					</Chip.Group>
				</div>
			</div>
		</>
	);
};

export default InterestedTopics;
