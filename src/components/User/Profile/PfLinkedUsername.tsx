import { Button, Loader, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";

interface PfLinkedUsernameProps {
    id: string;
    username: string;
}

const PfLinkedUsername = ({ id, username }: PfLinkedUsernameProps) => {
    const [opened, { close, open }] = useDisclosure(false);

    const { data, refetch } = trpc.users.viewProfile.useQuery(
        { id },
        { enabled: false }
    );

    return (
        <Popover opened={opened} onClose={close} position="right">
            <Popover.Target>
                <button
                    onClick={() => {
                        if (!data) refetch();
                        if (opened) close();
                        else open();
                    }}
                >
                    <h3 className="text-base text-primary-800">{username}</h3>
                </button>
            </Popover.Target>
            <Popover.Dropdown>
                {data ? (
                    <div className="w-40">
                        <h3 className=" text-primary-800">{data.name}</h3>
                        <p className="mt-1 text-xs text-neutral-700">
                            <span className="inline-block">
                                {data.arguments}個論點
                            </span>
                            ・
                            <span className="inline-block">
                                {data.comments}則回覆
                            </span>
                            ・
                            <span className="inline-block">
                                {data.articles}篇議題
                            </span>
                        </p>

                        <Link href={`/user/${id}`}>
                            <Button
                                className=" mt-3 w-full bg-primary-600 hover:bg-primary-700"
                                size="xs"
                            >
                                檢視頁面
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex h-6 w-6 items-center justify-center">
                        <Loader size="sm" />
                    </div>
                )}
            </Popover.Dropdown>
        </Popover>
    );
};

export default PfLinkedUsername;
