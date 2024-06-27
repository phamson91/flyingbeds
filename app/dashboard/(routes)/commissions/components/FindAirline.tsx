'use client';

import Input from '@/components/Input/Input';
import Loader from '@/components/Loader';
import { filterData } from '@/lib/handleData';
import { PATHS } from '@/lib/paths';
import { Airline } from '@/types/types';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

interface FindAirlineProps {
	airlines: Airline[];
}

const FindAirline: React.FC<FindAirlineProps> = ({ airlines }) => {
	const [searchedAirlines, setSearchedAirlines] = useState<Airline[] | null>(
		null
	);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		if (value.length === 0) {
			setSearchedAirlines([]);
			return;
		}
		const searchResult = filterData({
			searchValue: value,
			data: airlines,
			findValues: ['name', 'short_name'],
		});

		setSearchedAirlines(searchResult);
	};

	return (
		<div className="w-full">
			<Input
				className={`
          rounded-none
          rounded-r-md
        `}
				id="airlineSearch"
				data-testid="airlineSearch"
				placeholder="Type to search.."
				onChange={onSearch}
				onFocus={async () => setIsInputFocused(true)}
				onBlur={() => {
					if (!isMouseDown) {
						setIsInputFocused(false);
					}
				}}
			/>
			{isInputFocused && (
				<div className="transition absolute top-10 mt-2 py-2 w-full bg-white rounded-md shadow-lg z-10">
					{isLoading ? (
						<div>
							<Loader />
						</div>
					) : searchedAirlines && searchedAirlines.length > 0 ? (
						searchedAirlines.map((result, index) => (
							<Link
								onMouseDown={() => setIsMouseDown(true)}
								onMouseUp={() => setIsMouseDown(false)}
								onClick={() => setIsLoading(true)}
								key={index}
								href={`${PATHS.DASHBOARD_COMMISSIONS}/${result.id}`}
								className="flex p-2 px-5 hover:bg-slate-50 w-full"
							>
								{result.name}
							</Link>
						))
					) : searchedAirlines && searchedAirlines.length === 0 ? (
						<div className="p-2 px-5">No result</div>
					) : (
						<div className="p-2 px-5">Please enter 1 or more characters</div>
					)}
				</div>
			)}
		</div>
	);
};

export default FindAirline;
