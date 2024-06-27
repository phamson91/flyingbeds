import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

interface AlertModalProps {
	title: string;
	description: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
	title,
	description,
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	return (
		<Modal
			title={title}
			description={description}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button variant="outline" disabled={loading} onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="destructive"
					data-testid="confirmDelete"
					disabled={loading}
					onClick={onConfirm}
				>
					{loading ? (
						<div className="flex gap-2">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</div>
					) : (
						'Confirm'
					)}
				</Button>
			</div>
		</Modal>
	);
};

export default AlertModal;
