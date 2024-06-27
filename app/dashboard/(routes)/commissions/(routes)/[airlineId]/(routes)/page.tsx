import getAirline from '@/actions/getAirline';
import { getLocations } from '@/actions/locations/server';
import Table from '@/components/Table/Table';
import { Button } from '@/components/ui/Button';
import { PATHS } from '@/lib/paths';
import Link from 'next/link';
import AirlineCommissions from '../components/AirlineCommissions';
import AirlineFees from '../components/AirlineFees';
import TicketPrices from '../components/TicketPrice';

const AirlineCommissionsPage = async ({
	params,
}: {
	params: { airlineId: string };
}) => {
	const { airlineId } = params;
	const airline = await getAirline(airlineId);
	const { short_name, notes, commissions, id, fees, airline_flights_info } =
		airline;

	const locations = await getLocations();

	return (
		<div className="bg-white rounded-t-md">
			<div className="w-full flex justify-between items-center border-b pb-8">
				<h2 className="text-lg">{`AIRLINES: ${short_name}`}</h2>
				<Link href={PATHS.DASHBOARD_COMMISSIONS}>
					<Button type="button" variant={'secondary'}>
						New Search
					</Button>
				</Link>
			</div>
			<div className="pt-8">
				{notes && (
					<Table title={['Airline Notes']} tableBody={[[short_name, notes]]} />
				)}
				<div className="pt-6">
					<AirlineCommissions
						shortName={short_name}
						commissions={commissions}
						airlineId={id}
					/>
				</div>
				<div className="pt-6">
					<AirlineFees fees={fees} airlineId={id} />
				</div>
				<div className="pt-6">
					<TicketPrices
						airlineFlights={airline_flights_info}
						airlineId={airlineId}
						locations={locations}
					/>
				</div>
			</div>
		</div>
	);
};

export default AirlineCommissionsPage;
