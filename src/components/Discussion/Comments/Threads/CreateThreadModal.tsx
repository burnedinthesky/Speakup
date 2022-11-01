import { Button, Checkbox, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import useArgCreateThreadMutation from "../../../../hooks/discussion/useArgCreateThreadMutation";
import { ArgumentThread, Comment } from "../../../../types/comments.types";

interface ChoseCommentCardProps {
    checked: boolean;
    disabled: boolean;
    setChecked: (value: boolean) => void;
    content: string;
}

const ChoseCommentCard = ({
    checked,
    setChecked,
    content,
    disabled,
}: ChoseCommentCardProps) => {
    return (
        <div className="my-2 flex w-full items-center gap-2">
            <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.currentTarget.checked)}
                disabled={disabled}
            />
            <p>{content}</p>
        </div>
    );
};

interface CommentCardData {
    checked: boolean;
    disabled: boolean;
    id: number;
    content: string;
}

interface CreateThreadModalProps {
    opened: boolean;
    setOpened: (value: boolean) => void;
    argumentId: number;
    setAddedThreads: (
        mutateFn: (value: ArgumentThread[]) => ArgumentThread[]
    ) => void;
    comments?: Comment[];
}

const CreateThreadModal = ({
    opened,
    setOpened,
    argumentId,
    setAddedThreads,
    comments,
}: CreateThreadModalProps) => {
    const [threadName, setThreadName] = useState<string>("");
    const [inputError, setInputError] = useState<string | null>(null);

    const [stage, setStage] = useState<1 | 2>(1);

    const createThreadMutation = useArgCreateThreadMutation(
        (data?: ArgumentThread) => {
            if (data) setAddedThreads((cur) => [...cur, data]);
            setOpened(false);
        }
    );

    const [currentComments, setCurrentComments] = useState<CommentCardData[]>(
        []
    );

    useEffect(() => {
        if (stage === 2) return;
        let curComments: CommentCardData[] = [];
        if (comments) {
            curComments = comments.map(
                (element) =>
                    ({
                        checked: false,
                        disabled: element.thread ? true : false,
                        id: element.id,
                        content: element.content,
                    } as CommentCardData)
            );
        }
        setCurrentComments(curComments);
    }, [comments, stage]);

    const submitStage1 = () => {
        setInputError(null);
        if (threadName.length < 2) {
            setInputError("名稱過短");
        } else if (threadName.length > 8) {
            setInputError("名稱過長，請輸入八個字內");
        } else {
            if (currentComments.length) setStage(2);
            else submitNewThread();
        }
    };

    const submitNewThread = () => {
        createThreadMutation.mutate({
            argumentId: argumentId,
            name: threadName,
            updatingComments: currentComments
                .filter((element) => element.checked)
                .map((element) => element.id),
        });
    };

    return (
        <Modal
            centered
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            title={stage == 1 ? "新增討論串" : "選擇跟此討論串有關的留言"}
            overflow="inside"
        >
            {stage === 1 ? (
                <>
                    <TextInput
                        value={threadName}
                        onChange={(e) => setThreadName(e.currentTarget.value)}
                        error={inputError}
                        placeholder="請輸入討論串名稱"
                    />
                    <div className="mt-2 flex w-full justify-end">
                        <Button
                            className="bg-primary-600 font-normal"
                            onClick={() => {
                                submitStage1();
                            }}
                        >
                            新增
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col ">
                        {currentComments.map((element, i) => (
                            <ChoseCommentCard
                                key={i}
                                checked={element.checked}
                                content={element.content}
                                disabled={element.disabled}
                                setChecked={(checked: boolean) => {
                                    setCurrentComments((cur) =>
                                        cur.map((element, j) =>
                                            i === j
                                                ? {
                                                      ...element,
                                                      checked: checked,
                                                  }
                                                : element
                                        )
                                    );
                                }}
                            />
                        ))}
                        <div className="mt-2 flex w-full justify-end">
                            <Button
                                className="bg-primary-600 font-normal"
                                onClick={() => {
                                    submitNewThread();
                                }}
                                loading={createThreadMutation.isLoading}
                            >
                                提交
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CreateThreadModal;
