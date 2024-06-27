'use client';

import { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover';

interface Props {
	title: ReactNode;
	openPopover?: boolean;
	setOpenPopover?: (open: boolean) => void;
	onSubmit: ({ type, price }: any) => void;
	// classNameTitle: string;
}

const PopoverConfirm: FC<Props> = ({
	title,
	openPopover,
	setOpenPopover,
	onSubmit,
}) => {
	return (
		<Popover open={openPopover} onOpenChange={setOpenPopover}>
			<PopoverTrigger asChild>{title}</PopoverTrigger>
			<PopoverContent>
				<div className="w-full flex flex-col justify-center items-center gap-4">
					<p className="text-center text-sm">
						Do you want to confirm and proceed with the booking?
					</p>
					<Button onClick={onSubmit} className="h-9 text-sm">
						Confirm and Continue
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default PopoverConfirm;
