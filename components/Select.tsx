'use client';
import { FC, ReactNode } from 'react';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Select as SelectUI,
} from './ui/Select';
import { IOption } from '@/types/report';
import { cn } from '@/lib/utils';

interface IProps {
	className?: string;
	options: IOption[];
	placeholder?: string;
	onChange?: (value: any) => void;
	defaultValue?: string;
	field?: any;
	value?: string;
	showIcon?: boolean;
	icon?: ReactNode;
}

const Select: FC<IProps> = ({
	className,
	options,
	placeholder = 'Select a item',
	onChange,
	defaultValue,
	field,
	value,
	showIcon = true,
	icon,
}) => {
	return (
		<SelectUI
			onValueChange={(value) => onChange!(value)}
			defaultValue={defaultValue}
			value={value}
		>
			<SelectTrigger className={cn(className, 'w-[180px]')}>
				{showIcon && icon && <div className="mr-2">{icon}</div>}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="bg-white">
				{options.map((item: any) => {
					return (
						<SelectItem
							value={item.key}
							key={item.key}
							className="hover:cursor-pointer hover:bg-slate-50"
						>
							{item.value}
						</SelectItem>
					);
				})}
			</SelectContent>
		</SelectUI>
	);
};

export default Select;