'use client';

import Table from '@/components/Table/Table';
import AlertModal from '@/components/modals/AlertModal';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/hooks/useUser';
import formatNumber from '@/lib/formatNumber';
import { handleDelete } from '@/lib/utils';
import { IAirlineInfo, ITicketPrice } from '@/types/airline';
import { ILocation } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FaPen, FaPlusCircle, FaTimes } from 'react-icons/fa';
import ClassServiceModal from './ClassServiceModal';
import FileAction from './FileAction';
import ManagePriceModal from './ManagePriceModal';

interface Props {
	airlineFlights: IAirlineInfo[];
	airlineId: string;
	locations: ILocation[];
}

const tableHeadTitle = ['Class of Service', 'Type', 'Price OW (AUD)', 'Price RT (AUD)', 'Condition'];

const tableHeadTitleAdmin = [
	'Class of Service',
	'Type',
	'Price OW (AUD)',
	'Price RT (AUD)',
	'Condition',
	'Action',
];

const TicketPrices: FC<Props> = ({ airlineFlights, airlineId, locations }) => {
	const router = useRouter();
	const { user } = useUser();
	const [deleteId, setDeleteId] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [deleteType, setDeleteType] = useState<string>('');
	const isAdmin = user?.role === 'service_role';
	const [classServiceOpen, setClassServiceOpen] = useState<boolean>(false);
	const [flightId, setFlightId] = useState<Pick<ITicketPrice, 'flight_id'>>({
		flight_id: '',
	});
	const [classServiceData, setClassServiceData] = useState<
		ITicketPrice | undefined
	>(undefined);
	const [flightSegmentData, setFlightSegmentData] = useState<
		IAirlineInfo | undefined
	>(undefined);
	const [enableAction, setEnableAction] = useState<boolean>(false);

	const tableHead =
		isAdmin && enableAction ? tableHeadTitleAdmin : tableHeadTitle;

	// Generate table body for each Flight
	const generateTableBody = (ticketPrice: ITicketPrice[]) => {
		if (ticketPrice.length === 0) return [];

		return ticketPrice?.map((item: ITicketPrice) => {
			const action = (
				<div className="flex justify-start items-center gap-4">
					<FaPen
						className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
						onClick={() => {
							setClassServiceData(item);
							setFlightId({ flight_id: item.flight_id });
						}}
					/>
					<FaTimes
						className="hover:fill-red-400 fill-red-600 hover:cursor-pointer w-4 h-4"
						onClick={() => {
							setDeleteId(item.id);
							setDeleteType('Price Ticket');
						}}
					/>
				</div>
			);
			return isAdmin && enableAction
				? [
						item.class,
						item.type,
						formatNumber(item.priceOW, { minimumFractionDigits: 2 }),
						formatNumber(item.priceRT, { minimumFractionDigits: 2 }),
						item.condition,
						action,
				  ]
				: [
						item.class,
						item.type,
						formatNumber(item.priceOW, { minimumFractionDigits: 2 }),
						formatNumber(item.priceRT, { minimumFractionDigits: 2 }),
						item.condition,
				  ];
		});
	}
	const resetDelete = () => {
		setDeleteId('');
		setDeleteType('');
	};

	// Delete ticket price or airline flight
	const handleDeleteModal = (id: string) =>
		handleDelete({
			id,
			setIsDeleting,
			routerRefresh: () => router.refresh(),
			setDeleteId: () => resetDelete(),
			table: deleteType === 'Flight' ? 'airline_flights_info' : 'ticket_prices',
		});

	const handleServiceEdit = (data: IAirlineInfo) => {
		setFlightSegmentData(data);
		setClassServiceOpen(true);
	};

	return (
		<>
			<div className="flex justify-between">
				<p className="font-medium">Management Price</p>
				{isAdmin && (<div className="flex items-center space-x-2">
					<Switch
						checked={enableAction}
						onCheckedChange={(checked: boolean) => setEnableAction(checked)}
						id="airplane-mode"
					/>
					<Label htmlFor="airplane-mode">{`${
						enableAction ? 'Disable' : 'Enable'
					} Action`}</Label>
					<FileAction airlineId={airlineId} />
				</div>)}
			</div>
			{/* Table Airline Flight Info */}
			<div className="w-full mt-4">
				<div className="w-full flex text-sm border-t border-b">
					<p className="w-1/2 font-bold p-2 pl-6">Departure Point</p>
					<p className="w-1/2 font-bold p-2">Arrival Point</p>
					{isAdmin && enableAction && (
						<div className="flex items-center justify-center p-2 w-[80px]">
							<FaPlusCircle
								className="hover:text-sky-500 hover:cursor-pointer w-4 h-4 text-sky-600"
								onClick={() => setClassServiceOpen(true)}
							/>
						</div>
					)}
				</div>
				<Accordion type="single" collapsible className="w-full">
					{airlineFlights
						? airlineFlights.map((flight) => {
								const tableBody = generateTableBody(flight.ticket_prices!);
								return (
									<AccordionItem value={flight.id} key={flight.id}>
										<div className="w-full flex [&_h3]:w-full">
											<AccordionTrigger className="pr-2 py-2 text-sm hover:no-underline gap-2 w-full">
												<p className="w-1/2 text-start">{flight.departure}</p>
												<p className="w-1/2 text-start">{flight.arrival}</p>
											</AccordionTrigger>
											{isAdmin && enableAction && (
												<div className="flex items-center justify-center p-2 gap-2">
													<FaPlusCircle
														className="hover:text-sky-500 hover:cursor-pointer w-4 h-4 text-sky-600"
														onClick={() =>
															setFlightId({ flight_id: flight.id })
														}
													/>
													<FaPen
														className="hover:text-sky-500 hover:cursor-pointer w-4 h-4 text-sky-600"
														onClick={() => handleServiceEdit(flight)}
													/>
													<FaTimes
														className="hover:text-red-500 hover:cursor-pointer w-4 h-4 text-red-600"
														onClick={() => {
															setDeleteId(flight.id);
															setDeleteType('Flight');
														}}
													/>
												</div>
											)}
										</div>
										<AccordionContent className="px-6">
											<Table tableHead={tableHead} tableBody={tableBody || []} />
										</AccordionContent>
									</AccordionItem>
								);
						  })
						: 'No data found'}
				</Accordion>
			</div>
			{isAdmin && enableAction && (
				<AlertModal
					title={
						deleteType === 'Flight' ? 'Delete Flight' : 'Delete Ticket Price'
					}
					isOpen={!!deleteId && !!deleteType}
					onClose={resetDelete}
					description="This action cannot be undone."
					onConfirm={async () => await handleDeleteModal(deleteId)}
					loading={isDeleting}
				/>
			)}
			{isAdmin && enableAction && (
				<ClassServiceModal
					title={
						classServiceData
							? 'Edit Class Of Service'
							: 'Add new Class Of Service'
					}
					flightId={flightId.flight_id}
					onClose={() => setFlightId({ flight_id: '' })}
					airline_id={airlineId}
					editData={classServiceData}
					setEditData={setClassServiceData}
				/>
			)}
			{isAdmin && enableAction && (
				<ManagePriceModal
					title={
						flightSegmentData ? 'Edit Flight Segment' : 'Add new Flight Segment'
					}
					locations={locations}
					airlineId={airlineId}
					isOpen={classServiceOpen}
					onClose={() => {
						setClassServiceOpen(false);
						setFlightSegmentData(undefined);
					}}
					editData={flightSegmentData}
					setEditData={setFlightSegmentData}
				/>
			)}
		</>
	);
};

export default TicketPrices;
