import { cn } from '@/lib/utils';
import React, { FC } from 'react';

interface Props {
	icon: React.ReactNode;
	label: string;
	classNameLabel?: string;
}
const LabelWithIcon: FC<Props> = ({ icon, label, classNameLabel }) => {
	return (
		<div className="flex justify-start items-center gap-2">
			{icon}
			<div className={cn("text-xs", classNameLabel)}>{label}</div>
		</div>
	);
};

export default LabelWithIcon;
