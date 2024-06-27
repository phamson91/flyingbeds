import { useCallback, useState } from 'react';
import { useRouteChangeEvents } from 'nextjs-router-events';
import useBeforeUnload from './useBeforeUnload'; // read further for an explanation
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogAction,
} from '@/components/ui/alert-dialog'; // this is just radix-ui Alert Dialog, replace it with whatever fits your project
import { ISessionInfo } from '@/types/bookingTicket';
import { PATHS } from '@/lib/paths';

interface Props {
	shouldPreventRouteChange: boolean;
	sessionInfo: ISessionInfo;
	message?: string;
}
const useLeaveConfirmation = ({
	shouldPreventRouteChange,
	sessionInfo,
	message,
}: Props) => {
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const onBeforeRouteChange = useCallback(() => {
		if (shouldPreventRouteChange) {
			setShowConfirmationDialog(true);
			return false;
		}

		return true;
	}, [shouldPreventRouteChange]);

	const ignoreSession = async (sessionInfo: ISessionInfo): Promise<void> => {
		try {
			const res = await fetch(`${PATHS.API_IGNORE_SESSION}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(sessionInfo),
			});
		} catch (error: any) {
			console.log('error', error);
		}
	};

	const { allowRouteChange } = useRouteChangeEvents({ onBeforeRouteChange });
	// this is technically unrelated to this package, but probably still is something you might want to do
	useBeforeUnload({shouldPreventUnload: shouldPreventRouteChange, sessionInfo, ignoreSession });

	const handleSubmit = async () => {
		setIsLoading(prev => !prev);
		await ignoreSession(sessionInfo)
		setIsLoading(prev => !prev);
		allowRouteChange();
	}

	return {
		confirmationDialog: (
			<AlertDialog
				open={showConfirmationDialog}
				onOpenChange={setShowConfirmationDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>You are in-process!</AlertDialogTitle>
						<AlertDialogDescription>
							{message}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleSubmit}
							// disabled={setIsLoading}
						>
							Proceed
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		),
	};
};

export default useLeaveConfirmation;
