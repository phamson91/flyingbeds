import formatNumber from '@/lib/formatNumber';
import { ITicketInfo } from '@/types/booking';
import { IResponseEmail } from '@/types/sendEmail';
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
	Button,
} from '@react-email/components';
import * as React from 'react';

export const NotificationConfirmTicket = ({
	rloc,
	typeTicket,
	tickets,
	notes,
	amount,
	attachmentsFile,
	agreeLink,
	declineLink,
	title,
}: IResponseEmail) => {
	const previewText = `Request for Confirmation of Refund Ticket Information ${rloc} on Flyingbeds`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans w-full">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading
							className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0"
							dangerouslySetInnerHTML={{ __html: title || '' }}
						/>
						<Text className="text-black text-[16px] leading-[24px]">
							Information ticket {rloc}:
						</Text>
						<Section>
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								1. Tickets Information:
							</Text>
							<Row className="w-full">
								<Column className="w-2/12 font-medium">No</Column>
								<Column className="w-5/12 font-medium">Pax Name</Column>
								<Column className="w-5/12 font-medium">Ticket Number</Column>
							</Row>
							<Hr className="border border-solid border-[#eaeaea] my-[8px] mx-0 w-full" />
							{tickets?.map((item: ITicketInfo, index: number) => (
								<Row className="w-full" key={index}>
									<Column className="w-2/12">{index + 1}</Column>
									<Column className="w-5/12">{item.paxName}</Column>
									<Column className="w-5/12">{item.ticketNumber}</Column>
								</Row>
							))}
						</Section>
						<Section className="mt-8">
							<Text className="text-black text-[16px] leading-[24px] font-semibold">
								{`2. Information ${typeTicket}:`}
							</Text>
							<Text className="text-[14px]">
								<b>Amount (AUD): </b>
								{formatNumber(Number(amount))}
							</Text>
							<Text className="text-[14px]">
								<b>Notes: </b>
								{notes}
							</Text>
							<Text className="text-[14px]">
								<b>Attachment file: </b>
								{attachmentsFile && attachmentsFile?.length > 0 ? 'Yes' : 'No'}
							</Text>
							<Text className="text-black text-[14px] leading-[24px] font-light">
								NOTE **: Please log in to the system Flyingbeds before clicking
								the button
							</Text>
						</Section>
						<Section className="text-center">
							<Button
								pX={20}
								pY={12}
								className="bg-rose-500 mr-4 rounded text-white text-[12px] font-semibold no-underline text-center"
								href={declineLink}
							>
								Decline
							</Button>
							<Button
								pX={20}
								pY={12}
								className="bg-green-500 ml-4 rounded text-white text-[12px] font-semibold no-underline text-center"
								href={agreeLink}
							>
								Agree
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NotificationConfirmTicket;
