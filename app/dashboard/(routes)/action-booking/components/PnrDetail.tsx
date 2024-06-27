import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';

const PnrDetail = () => {
	const {
		bookingInfo,
		showPriceSummary,
		priceSummary,
		isPriceLoading,
		resetForm,
		sectorInfos,
	} = useBooking();

	const buttonState = priceSummary || isPriceLoading ? true : false;

	if (!bookingInfo) {
		return null;
	}

	const { travellerInfos } = bookingInfo;
	const passengersTableHead = ['Pax Name', 'Pax Type'];
	// const passengersTableBody = [paxName, paxType];
	const passengersTableBody = travellerInfos.map((travellerInfo) => {
		const { paxName, paxType } = travellerInfo;
		return [paxName, paxType];
	});

	const sectorsTableHead = [
		'Flight Details',
		'Class',
		'Journey',
		'Dept Date',
		'Status',
	];
	const sectorsTableBody = sectorInfos!.map((sectorInfo) => [
		`${sectorInfo.airline}${sectorInfo.flightNumber}`,
		sectorInfo.classOfService,
		sectorInfo.journey,
		sectorInfo.departureDate,
		sectorInfo.status,
	]);

	const time = new Date();
	time.setSeconds(time.getSeconds() + 600);

	return (
		<div className="bg-white">
			<Timer expiryTimestamp={time} resetForm={resetForm} />
			<div className="gap-10 px-8 py-8 rounded-b-md">
				<div className="mb-12">
					<Heading title="Passengers" />
					<Table
						tableHead={passengersTableHead}
						tableBody={passengersTableBody}
					/>
				</div>
				<div className="mb-12">
					<Heading title="Sectors" />
					<Table tableHead={sectorsTableHead} tableBody={sectorsTableBody} />
				</div>
				<div className="flex justify-end">
					<Button
						type="button"
						onClick={showPriceSummary}
						disabled={buttonState}
					>
						Show Price Summary
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PnrDetail;
