import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import { openSignupDialog } from "atoms/openSignupDialog";

const useLoggedInAction = () => {
	const { data: session } = useSession();
	const setSignupDialogState = useSetRecoilState(openSignupDialog);

	return (fn: Function) => {
		if (session) fn();
		else setSignupDialogState(true);
	};
};

export default useLoggedInAction;
