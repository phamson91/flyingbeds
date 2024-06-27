import ChooseRoutes from './ChooseRoutes';
import FlightOverview from './FlightOverview';

import { getLocations } from '@/actions/locations/server';
import { ILocation } from '@/types/types';

interface Props {}
interface IFormatLocations {
	[region: string]: ILocation[];
}

export default async function FlightRoutes({}) {
	const locations = await getLocations();

	if (!locations) {
		return <></>;
	}

	const formatLocationByRegion = (locations: ILocation[]) => {
		return locations.reduce((accumulator: IFormatLocations, row: ILocation) => {
			if (accumulator[row.region]) {
				accumulator[row.region].push(row);
			} else {
				accumulator[row.region] = [row];
			}
			return accumulator;
		}, {});
	};

	return (
		<article className="w-full">
			<ChooseRoutes locations={formatLocationByRegion(locations)} />
			<FlightOverview locations={locations} />
		</article>
	);
}
