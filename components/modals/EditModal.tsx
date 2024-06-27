'use client';

import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface EditModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
	title,
	isOpen,
	onClose,
	onSubmit,
	isSubmitting,
	className,
	disabled,
	children,
}) => {
	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={onClose}
			className={className}
		>
			<form className="pt-6" onSubmit={onSubmit}>
				{children}
				<div className="pt-6 space-x-2 flex justify-end">
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={onClose}
						variant={'outline'}
						data-testid="cancel"
					>
						Cancel
					</Button>
					<Button
						disabled={isSubmitting || disabled}
						type="submit"
						data-testid="submit"
					>
						{isSubmitting ? (
							<div className="flex gap-2">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</div>
						) : (
							'Submit'
						)}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default EditModal;
