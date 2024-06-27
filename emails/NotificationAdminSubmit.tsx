import { IAdminSubmitMail, IAdminSubmitMailComponent } from '@/types/booking';
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

export const NotificationAdminSubmit = ({
	rloc,
	agreeLink,
	typeTicket,
}: IAdminSubmitMailComponent) => {
	const previewText = `The customer has agreed to ${typeTicket} the ticket with record locator ${rloc}`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans w-full">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
							The customer has agreed to <strong>{typeTicket}</strong> the
							ticket with record locator
							<strong> {rloc}</strong>
						</Heading>
						<Section>
							<Text className="text-black text-[16px]">
								Please click the button below to confirm the completion of the{' '}
								<strong> {typeTicket}</strong> for the ticket with record
								locator <strong>{rloc}</strong>
							</Text>
							<Text className="text-black text-[14px] leading-[24px] font-medium">
								NOTE **: Please log in to the system before clicking the button
							</Text>
						</Section>
						<Section className="text-center">
							<Button
								pX={20}
								pY={12}
								className="bg-green-500 rounded text-white text-[12px] font-semibold no-underline text-center"
								href={agreeLink}
							>
								Submit
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NotificationAdminSubmit;
