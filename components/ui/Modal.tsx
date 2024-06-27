import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from './Dialog';

interface ModalProps {
	title?: string;
	description?: string;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	className?: string;
	disableInteractOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	title,
	description,
	isOpen,
	onClose,
	children,
	className,
	disableInteractOutside = false,
}) => {
	const onChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent className={className} onInteractOutside={(e) => {
          disableInteractOutside && e.preventDefault();
        }}>
				<DialogHeader>
					{title && <DialogTitle data-testid="titleModal">{title}</DialogTitle>}
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div>{children}</div>
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
