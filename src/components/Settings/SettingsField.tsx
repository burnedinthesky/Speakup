interface SettingsFieldProps {
    title: string;
    desc?: string;
    rightSection: JSX.Element;
}

const SettingsField = ({ title, desc, rightSection }: SettingsFieldProps) => {
    return (
        <div className="flex w-full items-center justify-between">
            <div>
                <h3 className="text-neutral-800">{title}</h3>
                {desc && <p className="text-sm text-neutral-500">{desc}</p>}
            </div>

            {rightSection}
        </div>
    );
};

export default SettingsField;
