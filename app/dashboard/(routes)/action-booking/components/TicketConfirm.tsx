import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';

const TicketConfirm = () => {
	const { ticketIssued, resetForm, sectorInfos } = useBooking();

	if (!ticketIssued) return null;

	const { rloc, tickets } = ticketIssued;
	const tableBody = tickets.map((ticket) => [
		ticket.paxName,
		ticket.ticketNumber,
	]);

	const sectorsTableHead = ['Flight Details', 'Class', 'Journey', 'Dept Date'];

	const sectorsTableBody = sectorInfos!.map((sectorInfo) => [
		`${sectorInfo.airline}${sectorInfo.flightNumber}`,
		sectorInfo.classOfService,
		sectorInfo.journey,
		sectorInfo.departureDate,
	]);

	return (
		<>
			<div
				data-testid="heading"
				className="bg-white p-8 rounded-t-md border-b-2 text-2xl"
			>
				<Heading title={`Confirmation - Issue Ticket: ${rloc}`} />
			</div>
			<div className="bg-white p-8 pt-2 rounded-b-md">
				<Table tableHead={sectorsTableHead} tableBody={sectorsTableBody} />
				<Table
					tableHead={['Pax Name', 'Ticket Number']}
					tableBody={tableBody}
				/>
				<div className="flex justify-end">
					<Button type="button" onClick={resetForm}>
						Back
					</Button>
				</div>
			</div>
		</>
	);
};

export default TicketConfirm;
