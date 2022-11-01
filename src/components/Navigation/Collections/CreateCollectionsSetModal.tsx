import { useState } from "react";
import { Button, Modal, TextInput } from "@mantine/core";
import useCreateColSetMutation from "../../../hooks/navigation/useCreateColSetMutation";

interface CreateColSetModalProps {
    opened: boolean;
    setOpened: (value: boolean) => void;
}

const CreateColSetModal = ({ opened, setOpened }: CreateColSetModalProps) => {
    const [colSetName, setColSetName] = useState<string>("");
    const [inputError, setInputError] = useState<string | null>(null);

    const completeFn = () => {
        setColSetName("");
        setInputError(null);
        setOpened(false);
    };

    const createColSetMutation = useCreateColSetMutation(completeFn);

    const submitCollectionSet = () => {
        setInputError(null);
        if (colSetName.length < 2) {
            setInputError("名稱過短");
        } else if (colSetName.length > 10) {
            setInputError("名稱過長，請輸入十個字內");
        } else {
            createColSetMutation.mutate({
                name: colSetName,
            });
        }
    };

    return (
        <Modal
            centered
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            title="新增收藏集"
            overflow="inside"
        >
            <>
                <TextInput
                    value={colSetName}
                    onChange={(e) => setColSetName(e.currentTarget.value)}
                    error={inputError}
                    placeholder="請輸入收藏列名稱"
                />
                <div className="mt-2 flex w-full justify-end">
                    <Button
                        className="bg-primary-600 font-normal"
                        onClick={() => {
                            submitCollectionSet();
                        }}
                        loading={createColSetMutation.isLoading}
                    >
                        新增
                    </Button>
                </div>
            </>
        </Modal>
    );
};

export default CreateColSetModal;
