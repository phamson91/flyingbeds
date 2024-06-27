import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

interface IViewModalProps {
	title?: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	textConfirm?: string;
	children: React.ReactNode;
	className?: string;
}

const ViewModal: React.FC<IViewModalProps> = ({
	title,
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	textConfirm = 'Confirm',
	className,
	children,
}) => {
	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={onClose}
			className={className}
		>
			{children}
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button variant="outline" disabled={isLoading} onClick={onClose}>
					Cancel
				</Button>
				<Button variant="destructive" disabled={isLoading} onClick={onConfirm}>
					{isLoading ? (
						<div className="flex gap-2">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</div>
					) : (
						<span>{textConfirm}</span>
					)}
				</Button>
			</div>
		</Modal>
	);
};

export default ViewModal;
