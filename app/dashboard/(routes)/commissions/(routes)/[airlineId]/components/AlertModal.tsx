import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface Props {
	open: boolean;
	onOpenChange: (isShow: boolean) => void;
	handleSubmit: () => void;
}

const AlertModal = ({
	open,
	onOpenChange,
	handleSubmit,
}: Props) => {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to upload the file?
					</AlertDialogTitle>
					<AlertDialogDescription>
						All ticket price data will be deleted. Do you want to continue
						uploading files?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleSubmit}>Agree</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AlertModal;
