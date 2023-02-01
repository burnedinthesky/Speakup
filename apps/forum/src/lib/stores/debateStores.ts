import { create } from "zustand";
import produce from "immer";

import { UIDebate, UserScfDebate } from "@/types/debate.types";

interface DebateState {
	inDebate: UIDebate[];
	otherPOV: UIDebate[];
	userLaunched: UIDebate[];
	general: UIDebate[];
	promotedDebates: {
		id: string;
		origin: "otherPOV" | "userLaunched" | { origin: "general"; order: number };
	}[];
	updateVote: (id: string, button: "upvote" | "downvote") => void;
	addToTheme: (
		debates: UserScfDebate[],
		theme: "inDebate" | "otherPOV" | "userLaunched",
	) => void;
	addToGeneral: (debates: UserScfDebate[]) => void;
	registerTypingUser: (id: string, username: string) => void;
	unregisterTypingUser: (id: string, username: string) => void;
	removeDebate: (id: string) => void;
}

const FindDebate = (state: DebateState, id: string): UIDebate => {
	const AllDebates = state.inDebate
		.concat(state.otherPOV)
		.concat(state.userLaunched)
		.concat(state.general);
	const TargetDebate = AllDebates.find((debate) => debate.id === id);
	if (TargetDebate === undefined) {
		throw new Error(
			"Debate not registered in store, did you add to theme/general?",
		);
	}
	return TargetDebate;
};

export const useDebateStore = create<DebateState>()((set) => ({
	inDebate: [],
	otherPOV: [],
	userLaunched: [],
	general: [],
	promotedDebates: [],
	updateVote: (id, button) =>
		set(
			produce((state: DebateState) => {
				const TargetDebate = FindDebate(state, id);
				if (button === "upvote") {
					if (TargetDebate.userUpvoted) {
						TargetDebate.upvotes -= 1;
						TargetDebate.userUpvoted = false;
					} else if (TargetDebate.userDownvoted) {
						TargetDebate.upvotes += 2;
						TargetDebate.userDownvoted = false;
						TargetDebate.userUpvoted = true;
					} else {
						TargetDebate.upvotes += 1;
						TargetDebate.userUpvoted = true;
					}
				} else {
					if (TargetDebate.userDownvoted) {
						TargetDebate.upvotes += 1;
						TargetDebate.userDownvoted = false;
					} else if (TargetDebate.userUpvoted) {
						TargetDebate.upvotes -= 2;
						TargetDebate.userUpvoted = false;
						TargetDebate.userDownvoted = true;
					} else {
						TargetDebate.upvotes -= 1;
						TargetDebate.userDownvoted = true;
					}
				}
			}),
		),
	addToTheme: (debates, theme) =>
		set(
			produce((state: DebateState) => {
				const UIedDebates: UIDebate[] = debates.map((debate) => ({
					...debate,
					typing: [],
				}));
				const InDebAndUserLaunched = state.inDebate.concat(state.userLaunched);
				if (theme === "inDebate")
					state.inDebate = state.inDebate.concat(
						theme === "inDebate" ? UIedDebates : [],
					);
				else if (theme === "otherPOV")
					state.otherPOV = state.otherPOV.concat(
						UIedDebates.filter(
							(debate) =>
								!InDebAndUserLaunched.some((tDeb) => debate.id === tDeb.id),
						),
					);
				else if (theme === "userLaunched")
					state.userLaunched = state.userLaunched.concat(
						UIedDebates.filter(
							(debate) => !state.inDebate.some((tDeb) => debate.id === tDeb.id),
						),
					);
			}),
		),
	addToGeneral: (debates) =>
		set((state) => {
			const ThemedDebates = state.inDebate
				.concat(state.otherPOV)
				.concat(state.userLaunched);

			const reducedDebates: UIDebate[] = debates
				.filter(
					(debate) =>
						!ThemedDebates.some((tDebate) => tDebate.id === debate.id),
				)
				.map((debate) => ({ ...debate, typing: [] }));
			return { general: state.general.concat(reducedDebates) };
		}),
	registerTypingUser: (id, username) =>
		set(
			produce((state: DebateState) => {
				const TargetDebate = FindDebate(state, id);
				if (!TargetDebate.typing.includes(username))
					TargetDebate.typing.push(username);

				if (!state.inDebate.some((debate) => debate.id === TargetDebate.id))
					state.inDebate.push(TargetDebate);
				if (state.otherPOV.some((debate) => debate.id === TargetDebate.id)) {
					state.otherPOV = state.otherPOV.filter(
						(debate) => debate.id !== TargetDebate.id,
					);
					state.promotedDebates.push({
						id: TargetDebate.id,
						origin: "otherPOV",
					});
				} else if (
					state.userLaunched.some((debate) => debate.id === TargetDebate.id)
				) {
					state.userLaunched = state.userLaunched.filter(
						(debate) => debate.id !== TargetDebate.id,
					);
					state.promotedDebates.push({
						id: TargetDebate.id,
						origin: "userLaunched",
					});
				} else if (
					state.general.some((debate) => debate.id === TargetDebate.id)
				) {
					state.promotedDebates.push({
						id: TargetDebate.id,
						origin: {
							origin: "general",
							order: state.general.findIndex(
								(debate) => debate.id === TargetDebate.id,
							),
						},
					});
					state.general = state.general.filter(
						(debate) => debate.id !== TargetDebate.id,
					);
				}
			}),
		),
	unregisterTypingUser: (id, username) =>
		set(
			produce((state: DebateState) => {
				const TargetDebate = FindDebate(state, id);
				TargetDebate.typing.splice(TargetDebate.typing.indexOf(username));
				if (TargetDebate.typing.length === 0) {
					state.inDebate = state.inDebate.filter(
						(debate) => debate.id !== TargetDebate.id,
					);
					const pmDebateInstance = state.promotedDebates.find(
						(debate) => debate.id,
					);
					if (!pmDebateInstance) {
						state.general.push(TargetDebate);
						return;
					}
					if (
						typeof pmDebateInstance.origin === "object" &&
						pmDebateInstance.origin.origin === "general"
					) {
						state.general.splice(
							pmDebateInstance.origin.order,
							0,
							TargetDebate,
						);
					} else if (pmDebateInstance.origin === "otherPOV") {
						state.otherPOV.push(TargetDebate);
					} else if (pmDebateInstance.origin === "userLaunched") {
						state.userLaunched.push(TargetDebate);
					}
					state.promotedDebates = state.promotedDebates.filter(
						(debate) => debate.id !== pmDebateInstance.id,
					);
				}
			}),
		),
	removeDebate: (id) =>
		set(
			produce((state: DebateState) => {
				if (state.inDebate.some((debate) => debate.id === id)) {
					state.inDebate = state.inDebate.filter((debate) => debate.id !== id);
				} else if (state.otherPOV.some((debate) => debate.id === id)) {
					state.otherPOV = state.otherPOV.filter((debate) => debate.id !== id);
				} else if (state.userLaunched.some((debate) => debate.id === id)) {
					state.userLaunched = state.userLaunched.filter(
						(debate) => debate.id !== id,
					);
				} else if (state.general.some((debate) => debate.id === id)) {
					state.general = state.general.filter((debate) => debate.id !== id);
				}
			}),
		),
}));
