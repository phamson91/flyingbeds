import { FC, useState } from 'react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface IPaginationProps {
	className?: string;
	previousPage: (page: number) => void;
	nextPage: (page: number) => void;
	total: number;
	pageSize?: number;
	countItems: number;
}
const Pagination: FC<IPaginationProps> = ({
	previousPage,
	nextPage,
	className,
	total,
	pageSize = 10,
	countItems = 0,
}) => {
	const [page, setPage] = useState<number>(1);

	const handleNext = () => {
		const nextPageNumber = page + 1;
		setPage((prev) => prev + 1);
		nextPage(nextPageNumber);
	};
	const handlePrevious = () => {
		const prevPageNumber = page - 1;
		setPage((prev) => prev - 1);
		previousPage(prevPageNumber);
	};

	const showTotal = () => {
		const from = (page - 1) * pageSize + 1;
		const to = (page - 1) * pageSize + countItems;
		const result = `${from} - ${to} of ${total} items`;
		return result;
	};

	return countItems === 0 ? (
		<></>
	) : (
		<div
			className={cn(className, 'flex items-center justify-end space-x-2 py-4')}
		>
			<span className="text-sm">{showTotal()}</span>
			<Button
				variant="outline"
				size="sm"
				onClick={handlePrevious}
				disabled={page === 1}
			>
				Previous
			</Button>
			<span className="text-sm">{`${page} / ${Math.ceil(
				total / pageSize
			)}`}</span>
			<Button
				variant="outline"
				size="sm"
				onClick={handleNext}
				disabled={total / pageSize <= page}
			>
				Next
			</Button>
		</div>
	);
};

export default Pagination;
