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
import formatNumber from '@/lib/formatNumber';
import { ICustomerPaymentSuccess } from '@/types/sendEmail';

export const NotificationCusPaymentSuccess = ({
	ticketIssued,
	sectorInfo,
}: Pick<ICustomerPaymentSuccess, 'ticketIssued' | 'sectorInfo'>) => {
	const previewText = `Your payment booking code ${ticketIssued?.rloc} has been successfully executed.`;
	const priceFormat = formatNumber(Number(ticketIssued?.price));

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
							<strong>Thank you for your order!</strong>
						</Heading>
						<Text className="text-black text-[16px] leading-[24px]">
							Information ticket <strong>{ticketIssued?.rloc}</strong>:
						</Text>
						<Section className="mt-2">
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								1. Payment:
							</Text>
							<Text className="text-[14px]">
								<b>Total Price: </b>
								{`${priceFormat} (AUD)`}
							</Text>
						</Section>
						<Section>
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								2. Tickets:
							</Text>
							<Row className="w-full">
								<Column className="w-2/12 font-medium">No</Column>
								<Column className="w-5/12 font-medium">Pax Name</Column>
								<Column className="w-5/12 font-medium">Ticket Number</Column>
							</Row>
							<Hr className="border border-solid border-[#eaeaea] my-[8px] mx-0 w-full" />
							{ticketIssued?.tickets?.map((item: ITicketInfo, index: number) => (
								<Row className="w-full" key={item.ticketNumber}>
									<Column className="w-2/12">{index + 1}</Column>
									<Column className="w-5/12">{item.paxName}</Column>
									<Column className="w-5/12">{item.ticketNumber}</Column>
								</Row>
							))}
						</Section>
						<Section className="mt-8">
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								3. Sectors:
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
							{sectorInfo?.map((sectorInfo: SectorInfo, index: number) => (
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
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NotificationCusPaymentSuccess;
