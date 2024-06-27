import { ITicketInfo } from '@/types/booking';
import { IConfirmCompleteTicketReq } from '@/types/sendEmail';
import {
	Body,
	Column,
	Container,
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

export const NotificationCompleteTicketReq = ({
	title,
	tickets,
	amount,
	ticketsChange,
	notes
}: IConfirmCompleteTicketReq) => {
	return (
		<Html>
			<Head />
			<Preview>{title}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans w-full">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
							{title}
						</Heading>
						<Section>
							<Text className="text-[16px]">
								{notes}
							</Text>
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								Tickets Information:
							</Text>
							<Row className="w-full">
								<Column className="w-2/12 font-medium">No</Column>
								<Column className="w-5/12 font-medium">Pax Name</Column>
								<Column className="w-5/12 font-medium">Ticket Number</Column>
							</Row>
							<Hr className="border border-solid border-[#eaeaea] my-[8px] mx-0 w-full" />
							{tickets
								?.filter((item) => item.selected)
								.map((item: ITicketInfo, index: number) => (
									<Row className="w-full" key={index}>
										<Column className="w-2/12">{index + 1}</Column>
										<Column className="w-5/12">{item.paxName}</Column>
										<Column className="w-5/12">
											{ticketsChange && ticketsChange[item.ticketNumber]
												? `${item.ticketNumber} ➝ ${ticketsChange[item.ticketNumber]
												}`
												: item.ticketNumber}
										</Column>
									</Row>
								))}
						</Section>
						<Section>
							<Text className="text-[14px]">
								<b>Amount (AUD): </b>
								{amount}
							</Text>
							<Text className="text-black text-[16px]">
								Please log in to the system to get more detailed information
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NotificationCompleteTicketReq;
