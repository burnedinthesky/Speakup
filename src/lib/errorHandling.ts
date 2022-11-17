import { showNotification } from "@mantine/notifications";

export const showErrorNotification = (message: {
    title?: string;
    message: string;
}) => {
    const title = message.title ? message.title : "發生錯誤";
    const msg = message.message;

    showNotification({
        title: title,
        message: msg,
        color: "red",
        autoClose: false,
    });
};
