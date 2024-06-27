import { FC } from 'react';

interface Airline {
	code: string;
	name: string;
}

interface Props {
	selectedAirlines: string[];
	onAirlinesChange: (selected: string[]) => void;
	className?: string;
}

const availableAirlines: Airline[] = [
	{ code: 'VN', name: 'Vietnam Airline (VN)' },
	{ code: 'VJ', name: 'Vietjet Air (VJ)' },
	{ code: 'QH', name: 'Bamboo Airways (QH)' },
];

const ChooseAirlines: FC<Props> = ({
	selectedAirlines,
	onAirlinesChange,
	className,
}) => {
	const handleCheckboxChange = (airlineCode: string) => {
		const updatedAirlines = selectedAirlines.includes(airlineCode)
			? selectedAirlines.filter((selected) => selected !== airlineCode)
			: [...selectedAirlines, airlineCode];
		onAirlinesChange(updatedAirlines);
	};

	return (
		<div>
			<div className={className}>
				{availableAirlines.map((airline) => (
					<div key={airline.code} className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							value={airline.code}
							checked={selectedAirlines.includes(airline.code)}
							onChange={() => handleCheckboxChange(airline.code)}
						/>
						<label>{airline.name}</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default ChooseAirlines;
