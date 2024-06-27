'use client';
import { sendMailNotice } from '@/actions/sendMail/sendMail';
import Loader from '@/components/Loader';
import { EStateTicket } from '@/types/sendEmail';
import { FC, useEffect, useState } from 'react';

const data = {
	CUSTOMER_AGREE_CHANGE: {
		title:
			'You have agreed to change the ticket. Feedback has been sent to the admin',
		subtitle: 'Please monitor your email to receive the latest notifications',
	},
	CUSTOMER_DECLINE_CHANGE: {
		title:
			'You have decline to change the ticket. Feedback has been sent to the admin',
		subtitle: 'Please monitor your email to receive the latest notifications',
	},
	ADMIN_CONFIRM_COMPLETE: {
		title: 'Confirmation notification has been sent to the user',
		subtitle: 'Please monitor your email to receive the latest notifications',
	},
	ERROR: {
		title: 'An error occurred during the process',
		subtitle: 'Please contact the admin to address this issue',
	},
	ERROR_TOKEN_FINISHED: {
		title: 'This request has been completed or has exceeded the access time.',
		subtitle: 'Please contact the admin to address this issue',
	},
	ERROR_TICKET_CONFLICT: {
		title:
			'There is a ticket that has been successfully processed in this request. It is not possible to proceed with this request further.',
		subtitle: 'Please contact the admin to address this issue',
	},
	ERROR_NOT_FOUND_TICKET: {
		title: 'Not found information ticket in booking of current user.',
		subtitle:
			'Please verify that your login credentials match the ticket booking account.',
	},
};

interface ContentPageProps {
	token: string | null | unknown;
	status: string;
	error: string;
	tokenKey: string;
	ticketsNumber: string;
	ticketsChange?: { [key: string]: string };
}
const ContentPage: FC<ContentPageProps> = ({
	ticketsNumber,
	tokenKey,
	token,
	status,
	error,
	ticketsChange,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataDisplay, setDataDisplay] = useState(
		data[status as keyof typeof data]
	);

	// Fetch data show content
	const fetchData = async () => {
		// Check token and error
		if (error || !token) {
			setDataDisplay(data[error as keyof typeof data]);
			setIsLoading(false);
			return;
		}
		try {
			// Call api send mail
			if (status) {
				await sendMailNotice({
					state: EStateTicket[status as keyof typeof EStateTicket],
					payload: {
						tickets: ticketsNumber,
						token: token as string,
						tokenKey,
						ticketsChange,
					},
				});
			}
		} catch (error) {
			console.log('error:', error);
			setDataDisplay(data['ERROR']);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isLoading ? (
		<Loader />
	) : (
		<article className="w-full text-center p-8">
			<p className="text-black text-xl mb-2">{dataDisplay?.title}</p>
			<p className="text-black text-lg">{dataDisplay?.subtitle}</p>
		</article>
	);
};

export default ContentPage;
