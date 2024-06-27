import NotificationAdminSubmit from '@/emails/NotificationAdminSubmit';
import NotificationCompleteTicket from '@/emails/NotificationCompleteTicket';
import NotificationConfirmTicket from '@/emails/NotificationConfirmTicket';
import NotificationRequestTicket from '@/emails/NotificationRequestTicket';
import NotificationCusPaymentSuccess from '@/emails/NotificationCusPaymentSuccess';
import redis from '@/lib/redis';
import { IAttachmentsFile } from '@/types/booking';
import {
	IAdminSendResult,
	IMailWithToken,
	IRequestTicket,
	ParamsSendMail,
	ICustomerPaymentSuccess,
} from '@/types/sendEmail';
import {
	NEXT_PUBLIC_EMAIL_ACCOUNT,
	JWT_MAIL_VERIFICATION_EXPIRES_IN,
	REDIS_TOKEN_STORAGE_PREFIX,
} from '@/utils/constant';
import {
	createToken,
	createTokenWithExpiresIn,
	decodedToken,
} from '@/utils/token';
import { render } from '@react-email/components';
import { JwtPayload } from 'jsonwebtoken';
import { updateConfirmedTicketData, updateTicketFailed } from './flowHelpers';
import { getUserById } from '@/actions/users/server';
import { getSettingByKey } from '@/actions/setup/server';
import { ESettingKey } from '@/types/setting';
import NotificationCompleteTicketReq from '@/emails/NotificationCompleteTicketReq';
import formatNumber from '../../../lib/formatNumber';

export const handleCustomerSendRequest = (
	payload: IRequestTicket
): ParamsSendMail => {
	if (!payload || !payload.rloc || !payload.typeTicket || !payload.sectorInfos)
		throw new Error('Params invalid');

	let attachments: IAttachmentsFile[] = [];

	const subject = 'Flyingbeds: The customer requests a ticket refund';

	// If there are email attachments, use them
	if (payload.attachmentsFile && payload.attachmentsFile.length > 0) {
		attachments = payload.attachmentsFile;
	}

	//Email recipients to admin
	const emailRecipients: string = NEXT_PUBLIC_EMAIL_ACCOUNT || '';
	// Get tickets number requested by the customer
	const tickets = payload.booking.tickets_info.filter(
		(ticket) => ticket.selected
	);

	const html = render(
		NotificationRequestTicket({
			...payload,
			tickets,
		})
	);

	return { emailRecipients, html, subject, attachments };
};

export const handleAdminSendConfirm = async (
	payload: IAdminSendResult,
	baseUrl: string
): Promise<ParamsSendMail[]> => {
	if (!payload || !payload.rloc || !payload.typeTicket || !payload.notes)
		throw new Error('Params invalid');

	const result: ParamsSendMail[] = [];
	//Email recipients to user
	const {
		user: { email: emailRecipients },
	} = await getUserById(payload.booking.user_id);

	if (!emailRecipients) throw new Error('Not found email user');

	// Get tickets number requested by the customer
	const tickets = payload.booking.tickets_info.filter(
		(ticket) => ticket.selected
	);
	const tickets_number = tickets.map((ticket) => ticket.ticketNumber).join('_');

	//Get email expire time from table settings
	const { value: emailExpiration } = await getSettingByKey(
		ESettingKey.JWT_MAIL_VERIFICATION_EXPIRES_IN
	);

	// Create a new token with the same data but with an expiration date
	const token = createTokenWithExpiresIn(
		{ ...payload, tickets_number },
		Number(emailExpiration) * 60 * 60 || JWT_MAIL_VERIFICATION_EXPIRES_IN
	);

	// Generate token key
	const tokenKey = `${REDIS_TOKEN_STORAGE_PREFIX}user:${tickets_number}`;
	// Save token to redis
	const resultRedis = await redis.setex(
		tokenKey,
		JWT_MAIL_VERIFICATION_EXPIRES_IN,
		token
	);

	if (resultRedis !== 'OK') throw new Error('Redis error');

	let attachments: IAttachmentsFile[] = [];
	const customerSubject = `Flyingbeds: Admin has sent a request to confirm the information for ticket ${payload.typeTicket.toLowerCase()} with booking code ${
		payload.rloc
	}.`;

	// If there are email attachments, use them
	if (payload.attachmentsFile && payload.attachmentsFile.length > 0) {
		attachments = payload.attachmentsFile;
	}
	const customerTitle = `Request for Confirmation of <strong>${payload.typeTicket}</strong> Ticket Information with record locator <strong> ${payload.rloc}</strong> on <strong>Flyingbeds</strong>`;
	const customerHtml = render(
		NotificationConfirmTicket({
			...payload,
			tickets,
			title: customerTitle,
			agreeLink: `${baseUrl}/emails/feedback/CUSTOMER_AGREE_CHANGE/${tickets_number}/${payload.booking.id}`,
			declineLink: `${baseUrl}/emails/feedback/CUSTOMER_DECLINE_CHANGE/${tickets_number}/${payload.booking.id}`,
		})
	);
	result.push({
		emailRecipients,
		html: customerHtml,
		subject: customerSubject,
		attachments,
	});

	// Send email confirm to admin
	const emailAdmin = NEXT_PUBLIC_EMAIL_ACCOUNT || '';
	const adminSubject = `Flyingbeds: Copy of Admin has sent a request to confirm the information for ticket ${payload.typeTicket.toLowerCase()} with booking code ${
		payload.rloc
	}.`;
	const adminTitle = `Copy of request for Confirmation of <strong>${payload.typeTicket}</strong> Ticket Information with record locator <strong> ${payload.rloc}</strong> on <strong>Flyingbeds</strong>`;
	const adminHtml = render(
		NotificationConfirmTicket({
			...payload,
			tickets,
			title: adminTitle,
			agreeLink: `${baseUrl}/emails/feedback/CUSTOMER_AGREE_CHANGE/${tickets_number}/${payload.booking.id}`,
			declineLink: `${baseUrl}/emails/feedback/CUSTOMER_DECLINE_CHANGE/${tickets_number}/${payload.booking.id}`,
		})
	);

	result.push({
		emailRecipients: emailAdmin,
		html: adminHtml,
		subject: adminSubject,
		attachments,
	});

	return result;
};

export const handleAdminSendError = async (
	payload: IAdminSendResult
): Promise<ParamsSendMail> => {
	if (!payload || !payload.rloc || !payload.typeTicket || !payload.notes)
		throw new Error('Params invalid');

	//Email recipients to user
	const {
		user: { email: emailRecipients },
	} = await getUserById(payload.booking.user_id);

	if (!emailRecipients) throw new Error('Not found email user');

	let attachments: IAttachmentsFile[] = [];
	// If there are email attachments, use them
	if (payload.attachmentsFile && payload.attachmentsFile.length > 0) {
		attachments = payload.attachmentsFile;
	}

	const subject = `Flyingbeds: The airline has rejected the request to the ticket ${payload?.typeTicket.toLowerCase()} with booking code ${
		payload?.rloc
	}`;
	const title = `Ticket ${payload?.typeTicket.toLowerCase()} with record locator ${
		payload?.rloc
	} has been failed. With the reason described below:`;

	const html = render(
		NotificationCompleteTicket({
			title,
			notes: payload.notes,
		})
	);

	// Get tickets number requested by the customer
	const tickets = payload.booking.tickets_info
		.filter((ticket) => ticket.selected)
		.map((ticket) => ticket.ticketNumber)
		.join('_');

	await updateTicketFailed(payload, tickets);
	return { emailRecipients, html, subject, attachments };
};

export const handleCustomerAgreeChange = async (
	payload: IMailWithToken,
	baseUrl: string
): Promise<ParamsSendMail> => {
	if (!payload || !payload.token || !payload.tokenKey)
		throw new Error('Params invalid');

	const { token, tokenKey, tickets } = payload;

	//Redis delete token
	await redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);

	// Decode token
	const decodedData = decodedToken(token);

	if (typeof decodedData === 'object') {
		// Create a new token with the same data but without an expiration date
		delete decodedData?.exp;
		delete decodedData?.iat;
		const newToken = createToken(decodedData);

		// Redis save token
		const resultRedis = await redis.set(
			`${REDIS_TOKEN_STORAGE_PREFIX}admin:${tickets}`,
			newToken
		);
		if (resultRedis !== 'OK') throw new Error('Redis error');

		const {
			user: { user_metadata },
		} = await getUserById(decodedData.booking.user_id); // Get email user

		const subject = `Flyingbeds: The customer ${user_metadata?.companyName} has agree to change the booking code ${decodedData?.rloc}`;

		const html = render(
			NotificationAdminSubmit({
				rloc: decodedData?.rloc,
				typeTicket: decodedData?.typeTicket,
				agreeLink: `${baseUrl}/emails/feedback/ADMIN_CONFIRM_COMPLETE/${tickets}/${decodedData?.booking.id}`,
			})
		);
		return {
			emailRecipients: NEXT_PUBLIC_EMAIL_ACCOUNT,
			html,
			subject,
			attachments: [],
		};
	}
	throw new Error('Token invalid');
};

export const handleCustomerDeclineChange = async (
	payload: IMailWithToken
): Promise<ParamsSendMail> => {
	if (!payload || !payload.token || !payload.tokenKey)
		throw new Error('Params invalid');

	const { token, tokenKey, tickets } = payload;

	//Redis delete token
	await redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);
	// Decode token
	const decodedData = decodedToken(token);

	if (typeof decodedData === 'object') {
		// Email recipients to user and admin
		const {
			user: { email, user_metadata },
		} = await getUserById(decodedData.booking.user_id); // Get email user

		if (!email) throw new Error('Not found email user');
		const emailRecipients: string = [email, NEXT_PUBLIC_EMAIL_ACCOUNT].join(
			', '
		);

		const subject = `Flyingbeds: The customer ${user_metadata?.companyName} has declined to change the booking code ${decodedData?.rloc}`;
		const title = `Ticket ${decodedData?.typeTicket.toLowerCase()} with booking code ${
			decodedData?.rloc
		} has been failed. With the reason described below:`;

		const notes = `The customer ${
			user_metadata?.companyName
		} has declined to change the ticket ${
			decodedData?.typeTicket
		} information with amount ${formatNumber(
			Number(decodedData?.amount)
		)} (AUD).`;

		const html = render(
			NotificationCompleteTicket({
				title,
				notes,
			})
		);

		await updateTicketFailed(
			decodedData as IAdminSendResult & JwtPayload,
			tickets
		);
		return { emailRecipients, html, subject, attachments: [] };
	}
	throw new Error('Token invalid');
};

// Handle send email to admin notify complete ticket, when customer agree change ticket
export const handleAdminConfirmComplete = async (
	payload: IMailWithToken
): Promise<ParamsSendMail> => {
	if (!payload || !payload.token || !payload.tokenKey)
		throw new Error('Params invalid');

	const { token, tokenKey, ticketsChange } = payload;

	// Decode token
	const decodedData = decodedToken(token);

	if (typeof decodedData === 'object') {
		//Email recipients to user
		const {
			user: { email: emailRecipients },
		} = await getUserById(decodedData!.booking!.user_id);

		if (ticketsChange && Object.keys(ticketsChange).length > 0) {
			decodedData.ticketsChange = ticketsChange;
		}

		if (!emailRecipients) throw new Error('Not found email user');

		const amount = formatNumber(Number(decodedData?.amount));

		const subjectEmail = `Flyingbeds: The request to the ${decodedData?.typeTicket.toLowerCase()} ticket to confirm the price of booking code ${
			decodedData?.rloc
		} has been successfully executed with confirming the price.`;
		const title = `The request to the ${decodedData?.typeTicket.toLowerCase()} ticket has been successfully executed.`;
		const notes = `
		With the choice of confirming the price of booking code ${decodedData?.rloc}. The request for the ${decodedData?.typeTicket} ticket will have a new price of ${amount} (AUD). Details below.`;

		const html = render(
			NotificationCompleteTicketReq({
				title,
				tickets: decodedData?.booking?.tickets_info,
				amount,
				ticketsChange: decodedData?.ticketsChange ?? null,
				notes,
			})
		);

		await updateConfirmedTicketData(
			decodedData as IAdminSendResult & JwtPayload
		);

		//Redis delete token
		await redis.del(`${REDIS_TOKEN_STORAGE_PREFIX}${tokenKey}`);

		return { emailRecipients, html, subject: subjectEmail, attachments: [] };
	}
	throw new Error('Token invalid');
};

// Handle send email to admin notify complete ticket, when customer no confirm price
export const handleAdminNotifyComplete = async (
	payload: IAdminSendResult
): Promise<ParamsSendMail> => {
	if (!payload || !payload.rloc || !payload.typeTicket || !payload.notes)
		throw new Error('Params invalid');

	//Email recipients to user
	const {
		user: { email: emailRecipients },
	} = await getUserById(payload.booking.user_id);

	if (!emailRecipients) throw new Error('Not found email user');
	const amount = formatNumber(Number(payload?.amount));

	const subject = `Flyingbeds: The request to the ${payload?.typeTicket.toLowerCase()} ticket to not confirm the price of booking code ${
		payload?.rloc
	} has been successfully executed.`;
	const title = `The request to the ${payload?.typeTicket.toLowerCase()} ticket has been successfully executed.`;
	const notes = `With the choice of not confirming the price of booking code ${payload?.rloc}. The request for the ${payload?.typeTicket} ticket will have a new price of ${amount} (AUD). Details below.`;

	const html = render(
		NotificationCompleteTicketReq({
			title,
			tickets: payload?.booking?.tickets_info,
			amount,
			ticketsChange: payload?.ticketsChange ?? null,
			notes,
		})
	);

	await updateConfirmedTicketData(payload as IAdminSendResult);
	return { emailRecipients, html, subject, attachments: [] };
};

//Handle send email to customer notify payment success
export const handleCustomerPaymentSuccess = async (
	payload: ICustomerPaymentSuccess
): Promise<ParamsSendMail> => {
	if (!payload) throw new Error('Params invalid');
	console.log("payload", payload)

	const { emailRecipients, ticketIssued, sectorInfo } = payload;
	if (!emailRecipients) throw new Error('Not found email user');
	const subject = `Flyingbeds: Your payment booking code ${ticketIssued?.rloc} has been successfully executed.`;

	const html = render(
		NotificationCusPaymentSuccess({ ticketIssued, sectorInfo })
	);

	return {
		emailRecipients,
		html,
		subject,
		attachments: [],
	};
};
