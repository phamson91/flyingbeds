import { FC, MouseEvent, ReactNode } from 'react';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';

interface TProps {
	title: string;
	open: boolean;
	children: ReactNode;
	onClose: () => void;
	onSubmit: () => void;
	isLoading?: boolean;
}
const Modal: FC<TProps> = ({
	title,
	children,
	open,
	onClose,
	onSubmit,
	isLoading,
}) => {
	if (!open) return null;

	const handleClose = (e: MouseEvent<HTMLDivElement>) => {
		const targetElement = e.target as HTMLDivElement;
		if (targetElement && targetElement.id) onClose();
	};

	return (
		<div
			className="relative z-10"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="false"
		>
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

			<div className="fixed inset-0 z-10 overflow-y-auto">
				<div
					onClick={handleClose}
					id="modal-wrapper"
					className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
				>
					<div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
						<div className="px-4 pt-5">
							{title && <span className="font-bold text-md">{title}</span>}
						</div>
						<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
								{children}
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<Button
								disabled={isLoading}
								type="button"
								className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:ml-3 sm:w-auto"
								onClick={() => onSubmit()}
							>
								{isLoading ? (
									<div className="flex gap-2">
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Loading...
									</div>
								) : (
									'Submit'
								)}
							</Button>
							<Button
								disabled={isLoading}
								type="button"
								className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
								onClick={() => onClose()}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
