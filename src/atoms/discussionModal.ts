import { atom } from "recoil";

interface data {
    opened: boolean;
    type: "article" | "argument" | "comment" | null;
    identifier: number | string | null;
}

export const openDisccusionModal = atom({
    key: "openDisccusionModal",
    default: {
        opened: false,
        type: null,
        identifier: null,
    } as data,
});
