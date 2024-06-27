import React from 'react';
import { Clock5 } from 'lucide-react';
import { addDays, format, set } from 'date-fns';

const WarningTime = () => {
	const tomorrow = addDays(new Date(), 1);
	const endOfDay = set(tomorrow, { hours: 23, minutes: 59, seconds: 59 });
	return (
		<div className="flex justify-center items-center gap-2 border border-red-600 rounded-md p-2 bg-red-100">
			<Clock5 color={'#ED4337'} />
			<div className="flex flex-col items-start justify-start text-red-500">
				<p className="text-sm">Complete payment by</p>
				<p className="text-base font-semibold">
					{format(endOfDay, 'HH:mm dd/MMM/yyyy')}
				</p>
			</div>
		</div>
	);
};

export default WarningTime;
