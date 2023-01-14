import { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

import useScreenBreakpoint from "hooks/common/useScreenBreakpoint";

import { Drawer, LoadingOverlay } from "@mantine/core";

import { AppShell } from "components/Advocate/AppShell";
import ArticleEditor from "components/Advocate/Issues/Editor/ArticleEditor";
import ArticleProperties from "components/Advocate/Issues/Editor/ArticleProperties";
import DesktopBlockProperties from "components/Advocate/Issues/Editor/DesktopBlockProperties";

import {
	articleContentAtom,
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "atoms/advocate/articleEditorAtoms";

interface SelectorWrapperProps {
	opened: boolean;
	setOpened: (val: boolean) => void;
	children: JSX.Element;
}

const SelectorWrapper = ({
	opened,
	setOpened,
	children,
}: SelectorWrapperProps) => {
	const { wbpn } = useScreenBreakpoint();

	return wbpn > 2 ? (
		<div className="relative h-full w-72 flex-shrink-0 px-4 xl:w-80">
			<div className="absolute left-0 top-7 h-[calc(100%-56px)] border-r border-r-slate-300" />
			{children}
		</div>
	) : (
		<Drawer
			opened={opened}
			onClose={() => {
				setOpened(false);
			}}
			position="right"
			size={360}
		>
			<div className="mx-auto w-80">{children}</div>
		</Drawer>
	);
};

const BoardEditor = () => {
	const resetRcContent = useResetRecoilState(articleContentAtom);
	const resetRcEditorInfo = useResetRecoilState(articleEditorInfoAtom);
	const resetRcProperties = useResetRecoilState(articlePropertiesAtom);

	const [editorInfo, setEditorInfo] = useRecoilState(articleEditorInfoAtom);
	const [expandSelectionDrawer, setExpandSelectionDrawer] =
		useState<boolean>(false);

	useEffect(() => {
		resetRcContent();
		resetRcEditorInfo();
		resetRcProperties();
	}, []);

	useEffect(() => {
		if (!editorInfo.queuedBlur) return;
		const timeout: NodeJS.Timeout = setTimeout(() => {
			console.log("trie");
			setEditorInfo((cur) => ({
				...cur,
				focusedBlock: cur.overrideBlur !== false ? cur.focusedBlock : null,
				overrideBlur: false,
				queuedBlur: false,
			}));
		}, 50);
		return () => {
			clearTimeout(timeout);
		};
	}, [editorInfo.queuedBlur]);

	return (
		<AppShell title={`Speakup - 新增議題`} highlight="issues">
			<div className="flex h-full w-full lg:ml-64 lg:w-[calc(100%-256px)] relative">
				<LoadingOverlay visible={editorInfo.isSubmitting} />
				<div className="h-full w-full flex-grow-0 overflow-y-auto px-12 pt-10 pb-20">
					<div className="mx-auto h-full max-w-3xl">
						<ArticleEditor
							articleId={null}
							setOpenAtcPropDrawer={setExpandSelectionDrawer}
						/>
					</div>
				</div>
				<SelectorWrapper
					opened={expandSelectionDrawer}
					setOpened={setExpandSelectionDrawer}
				>
					{editorInfo.focusedBlock !== null ? (
						<DesktopBlockProperties />
					) : (
						<ArticleProperties />
					)}
				</SelectorWrapper>
			</div>
		</AppShell>
	);
};

export default BoardEditor;
