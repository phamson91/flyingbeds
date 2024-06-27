import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import ViewModal from '@/components/modals/ViewModal';
import { useBooking } from '@/hooks/useBooking';
import { ETypeTicket, IBookingSupa } from '@/types/booking';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface IModalDisplayPnr {
	typeModal: ETypeTicket.DISPLAY_PNR;
	onClose: () => void;
	booking: IBookingSupa;
}

const ModalDisplayPnr: FC<IModalDisplayPnr> = ({
	typeModal,
	onClose,
	booking,
}) => {
	const { getPnrData, bookingInfo, sectorInfos } = useBooking();
	const [isLoading, setIsLoading] = useState(true);
	const [passengersTableBody, setPassengersTableBody] = useState<
		(string | number)[][]
	>([]);
	const [sectorsTableBody, setSectorsTableBody] = useState<
		(string | number)[][]
	>([]);

	const fetchPNR = async () => {
		try {
			setIsLoading(true);
			await getPnrData(booking.record_locator);
			if (bookingInfo && sectorInfos && sectorInfos?.length > 0) {
				const { travellerInfos } = bookingInfo;
				const { tickets_info } = booking;

				const passengersBody = travellerInfos.map((travellerInfo) => {
					const { paxName, paxType } = travellerInfo;
					const ticketNumber =
						tickets_info.find((ticket) => ticket.paxName === paxName)
							?.ticketNumber ?? 'Not found';
					return [ticketNumber, paxName, paxType];
				});

				const sectorsBody = sectorInfos.map((sectorInfo) => [
					`${sectorInfo.airline}${sectorInfo.flightNumber}`,
					sectorInfo.classOfService,
					sectorInfo.journey,
					sectorInfo.departureDate,
					sectorInfo.status,
				]);

				setPassengersTableBody(passengersBody);
				setSectorsTableBody(sectorsBody);
				setIsLoading(false);
				return;
			}
			throw new Error('No data. Please try again.');
		} catch (error: any) {
			toast.error(error.message);
			setIsLoading(false);
			onClose();
		}
	};

	useEffect(() => {
		fetchPNR();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeModal]);

	return (
		<ViewModal
			title={`Display PNR ${booking.record_locator}`}
			isOpen={ETypeTicket.DISPLAY_PNR === typeModal}
			onClose={onClose}
			onConfirm={onClose}
			isLoading={isLoading}
		>
			<div className="py-2 rounded-b-md">
				<div className="mb-6">
					<Heading title="Passengers" />
					<Table
						tableHead={['Ticket Number', 'Pax Name', 'Pax Type']}
						tableBody={passengersTableBody}
						isLoading={isLoading}
					/>
				</div>
				<div className="mb-4">
					<Heading title="Sectors" />
					<Table
						tableHead={[
							'Flight Details',
							'Class',
							'Journey',
							'Dept Date',
							'Status',
						]}
						tableBody={sectorsTableBody}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</ViewModal>
	);
};

export default ModalDisplayPnr;
