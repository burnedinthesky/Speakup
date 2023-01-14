import { Drawer } from "@mantine/core";

interface MobileDrawerProps {
    children?: JSX.Element;
    opened: boolean;
    onClose: () => void;
    maxWidth?: number;
}

const MobileDrawer = ({
    opened,
    onClose,
    children,
    maxWidth,
}: MobileDrawerProps) => {
    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            classNames={{ drawer: "bg-transparent" }}
            position="bottom"
            withCloseButton={false}
        >
            <div className="flex h-full w-full items-stretch">
                <span
                    className="h-full w-full cursor-pointer"
                    // onClick={onClose}
                />
                <div
                    style={{ maxWidth: maxWidth ? maxWidth : 448 }}
                    className="h-full w-full flex-shrink-0 bg-white p-4"
                >
                    {children}
                </div>
                <span
                    className=" h-full w-full cursor-pointer"
                    // onClick={onClose}
                />
            </div>
        </Drawer>
    );
};

export default MobileDrawer;
