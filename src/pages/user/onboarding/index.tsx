import { useEffect } from "react";

const index = () => {
    useEffect(() => {
        window.location.href = "/home";
    }, []);

    return <div>index</div>;
};

export default index;
