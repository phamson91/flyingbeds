import { IConfirmCompleteTicket } from '@/types/sendEmail';
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

export const NotificationCompleteTicket = ({
	title,
	notes,
}: IConfirmCompleteTicket) => {
	return (
		<Html>
			<Head />
			<Preview>{title}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans w-full">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
						<Heading className="text-black text-[20px] text-center p-0 my-[10px] mx-0">
							Change ticket request failed
						</Heading>
						<Section>
							<Text className="text-black text-[16px]">{title}</Text>
							{notes && (
								<Text className="text-[16px]">
									<b>Reason: </b>
									{notes}
								</Text>
							)}
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

export default NotificationCompleteTicket;
