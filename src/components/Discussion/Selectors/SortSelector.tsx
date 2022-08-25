import { MouseEvent } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import { ChevronDownIcon, SortDescendingIcon } from "@heroicons/react/outline";

interface SortSelectorProps {
    screenSize?: string;
    updateSortMethod: (e: MouseEvent<HTMLButtonElement>) => void;
}

function SortSelector({ screenSize, updateSortMethod }: SortSelectorProps) {
    return (
        <Menu
            classNames={{
                dropdown: "bg-neutral-50 shadow-lg",
            }}
            position="bottom-end"
        >
            <Menu.Target>
                {screenSize == "mob" ? (
                    <ActionIcon className="my-[12px] mr-4">
                        <SortDescendingIcon className="h-5 w-5" />
                    </ActionIcon>
                ) : (
                    <button className="flex h-[42px] items-center gap-2 rounded-full bg-neutral-50 px-4">
                        <ChevronDownIcon className="h-5 w-5" />
                        <p className="text-sm">選擇排序方式</p>
                    </button>
                )}
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={updateSortMethod}>預設排序</Menu.Item>
                <Menu.Item onClick={updateSortMethod}>依時間排序</Menu.Item>
                <Menu.Item onClick={updateSortMethod}>依回覆數排序</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default SortSelector;
