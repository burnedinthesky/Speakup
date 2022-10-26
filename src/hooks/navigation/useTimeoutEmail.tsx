import { useEffect, useRef, useState } from "react";

interface hookProps {
    localStorageId: string;
}

const useTimeoutEmail = ({ localStorageId }: hookProps) => {
    const [emailCD, setEmailCD] = useState(0);
    const emailCDInterval = useRef<NodeJS.Timer | null>();

    const updateEmailCD = () => {
        const lsEmailCD = localStorage.getItem(localStorageId);
        let curTime = emailCD;

        if (lsEmailCD) {
            let localTime = parseInt(lsEmailCD);
            curTime = curTime < localTime ? localTime : curTime;
        }

        if (curTime == 0) {
            if (emailCDInterval.current) clearInterval(emailCDInterval.current);
            emailCDInterval.current = null;
            localStorage.removeItem(localStorageId);
        } else {
            curTime -= 1;
            localStorage.setItem(localStorageId, curTime.toString());
        }
        setEmailCD(curTime);
    };

    const overrideEmailCD = (time: number) => {
        console.log("yoo");
        localStorage.setItem(localStorageId, time.toString());
        setEmailCD(time);
        if (!emailCDInterval.current) {
            emailCDInterval.current = setInterval(updateEmailCD, 200);
        }
    };

    useEffect(() => {
        if (!emailCDInterval.current) {
            emailCDInterval.current = setInterval(updateEmailCD, 200);
        }

        return () => {
            if (emailCDInterval.current) {
                clearInterval(emailCDInterval.current);
                emailCDInterval.current = null;
            }
        };
    }, []);

    return {
        emailCD,
        canSendEmail: emailCD <= 0,
        resetEmailCD: (time?: number) => {
            console.log("yoo");
            overrideEmailCD(time ? time : 60);
        },
    };
};

export default useTimeoutEmail;
