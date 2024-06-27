import { IEmailRequest, ITicketInfo, SectorInfo } from '@/types/booking';
import {
	Body,
	Container,
	Column,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

export const NotificationRequestTicket = ({
	rloc,
	typeTicket,
	tickets,
	sectorInfos,
	reason,
	notes,
	confirmPrice,
	attachmentsFile,
}: IEmailRequest) => {
	const previewText = `You have ticket ${typeTicket} request with record locator ${rloc} on Flyingbeds`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
							You have ticket <strong>{typeTicket}</strong> request with record
							locator
							<strong> {rloc}</strong> on <strong>Flyingbeds</strong>
						</Heading>
						<Text className="text-black text-[16px] leading-[24px]">
							Information ticket {rloc}:
						</Text>
						<Section>
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								1. Tickets:
							</Text>
							<Row className="w-full">
								<Column className="w-2/12 font-medium">No</Column>
								<Column className="w-5/12 font-medium">Pax Name</Column>
								<Column className="w-5/12 font-medium">Ticket Number</Column>
							</Row>
							<Hr className="border border-solid border-[#eaeaea] my-[8px] mx-0 w-full" />
							{tickets?.map((item: ITicketInfo, index: number) => (
								<Row className="w-full" key={item.ticketNumber}>
									<Column className="w-2/12">{index + 1}</Column>
									<Column className="w-5/12">{item.paxName}</Column>
									<Column className="w-5/12">{item.ticketNumber}</Column>
								</Row>
							))}
						</Section>
						<Section className="mt-8">
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								2. Sectors:
							</Text>
							<Row className="w-full">
								<Column className="w-1/12 font-medium">No</Column>
								<Column className="w-2/12 font-medium">Airline</Column>
								<Column className="w-2/12 font-medium">FL</Column>
								<Column className="w-2/12 font-medium">Class</Column>
								<Column className="w-3/12 font-medium">Jour</Column>
								<Column className="w-2/12 font-medium">Dep</Column>
							</Row>
							<Hr className="border border-solid border-[#eaeaea] my-[8px] mx-0 w-full" />
							{sectorInfos?.map((sectorInfo: SectorInfo, index: number) => (
								<Row className="w-full" key={sectorInfo.airlineId}>
									<Column className="w-1/12">{index + 1}</Column>
									<Column className="w-2/12">{sectorInfo.airline}</Column>
									<Column className="w-2/12">{sectorInfo.flightNumber}</Column>
									<Column className="w-2/12">
										{sectorInfo.classOfService}
									</Column>
									<Column className="w-3/12">{sectorInfo.journey}</Column>
									<Column className="w-2/12">{sectorInfo.departureDate}</Column>
								</Row>
							))}
						</Section>
						<Section className="mt-8">
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								3. Describe additional details here:
							</Text>
							<Text className="text-[14px]">
								<b>Reasons: </b>
								{reason}
							</Text>
							<Text className="text-[14px]">
								<b>Notes: </b>
								{notes}
							</Text>
							<Text className="text-[14px]">
								<b>Must confirm price: </b>
								{confirmPrice ? 'Yes' : 'No'}
							</Text>
							<Text className="text-[14px]">
								<b>Attachment file: </b>
								{attachmentsFile && attachmentsFile?.length > 0 ? 'Yes' : 'No'}
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NotificationRequestTicket;
