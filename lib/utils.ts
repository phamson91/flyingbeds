import deleteRow from '@/actions/deleteRow';
import { updateRow } from '@/actions/updateRow';
import { type ClassValue, clsx } from 'clsx';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// move modal action code to utils so it can be reused in multiple places
interface IHandleDelete {
	id: string;
	setIsDeleting: (value: boolean) => void;
	routerRefresh: () => void;
	setDeleteId: (value: string) => void;
	table: string;
}

export const handleDelete = async ({
	id,
	setIsDeleting,
	routerRefresh,
	setDeleteId,
	table,
}: IHandleDelete) => {
	setIsDeleting(true);

	try {
		await deleteRow({ id, table: table });
	} catch (error) {
		toast.error('Failed to delete');
	}

	routerRefresh();
	setDeleteId('');
	setIsDeleting(false);
};

interface IHandleClose<T> {
	setEditData: (data?: T) => void;
	onClose: () => void;
	reset: () => void;
}

export const handleClose = <T>({
	setEditData,
	onClose,
	reset,
}: IHandleClose<T>) => {
	setEditData(undefined);
	onClose();
	reset();
};

interface IOnSubmit<T> {
	data: T;
	setIsSubmitting: (value: boolean) => void;
	id?: string;
	routerRefresh: () => void;
	handleClose: () => void;
	table: string;
}

export const onSubmit = async <T>({
	data,
	setIsSubmitting,
	id,
	routerRefresh,
	handleClose,
	table,
}: IOnSubmit<T>): Promise<void> => {
	setIsSubmitting(true);

	try {
		await updateRow({
			...data,
			table: table,
			id: id,
		});
	} catch (error) {
		toast.error('Failed to add record');
	}

	setIsSubmitting(false);
	routerRefresh();
	handleClose();
};
