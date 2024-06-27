import {
	ReqParamsSendMail,
	EStateTicket,
	ParamsSendMail,
} from '@/types/sendEmail';
import { NextRequest, NextResponse } from 'next/server';
import {
	handleAdminConfirmComplete,
	handleAdminNotifyComplete,
	handleAdminSendConfirm,
	handleAdminSendError,
	handleCustomerAgreeChange,
	handleCustomerDeclineChange,
	handleCustomerSendRequest,
	handleCustomerPaymentSuccess
} from './executeFlow';
import { transporter } from '@/lib/nodemailer';
import { NEXT_PUBLIC_EMAIL_ACCOUNT } from '@/utils/constant';
import { IAttachmentsFile } from '@/types/booking';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
	const params: ReqParamsSendMail = await req.json();
	const parseUrl = new URL(req.url);
	const baseUrl = parseUrl.origin;

	try {
		// Check params and execute flow by state
		const data = await manageStateAndFlow(params, baseUrl);
		// Send email
		await sendMail(data);

		return new NextResponse(JSON.stringify({ message: 'Success' }), {
			status: 200,
		});
	} catch (error: any) {
		console.log('error:', error);
		return new NextResponse(JSON.stringify({ message: error.message }), {
			status: 400,
			statusText: error.message,
		});
	}
}

/**
 * Sends an email with the given parameters.
 */
const sendMail = async (params: ParamsSendMail | ParamsSendMail[]) => {
	try {
		// Check if params is array to send email
		if (Array.isArray(params)) {
			params.forEach(async (param) => {
				const { emailRecipients, html, subject, attachments } = param;
				// Send email
				console.log(`Sending email to ${emailRecipients}`);
				await transporter.sendMail({
					from: `"Flyingbeds Notification" <${NEXT_PUBLIC_EMAIL_ACCOUNT}>`,
					to: emailRecipients,
					html,
					subject,
					attachments,
				});
				console.log(`Send email to ${emailRecipients} success`);
				// Remove file upload
				if (attachments && attachments.length > 0) {
					await removeFileUpload(attachments);
				}
			});
			return true;
		}
		// Check params is object to send email
		const { emailRecipients, html, subject, attachments } = params;
		// Send email
		console.log(`Sending email to ${emailRecipients}`);
		await transporter.sendMail({
			from: `"Flyingbeds Notification" <${NEXT_PUBLIC_EMAIL_ACCOUNT}>`,
			to: emailRecipients,
			html,
			subject,
			attachments,
		});
		console.log(`Send email to ${emailRecipients} success`);
		// Remove file upload
		if (attachments && attachments.length > 0) {
			await removeFileUpload(attachments);
		}
		return true;
	} catch (error: any) {
		console.log('error', error);
		throw new Error(error.message as string);
	}
};

/**
 * Manages the state and flow of sending an email.
 */
const manageStateAndFlow = async (
	params: ReqParamsSendMail,
	baseUrl: string
) => {
	const { state, payload } = params;

	if (!state) throw new Error('State invalid');

	// Execute flow by state
	const executeFlow: Record<string, Function> = {
		[EStateTicket.CUSTOMER_SEND_REQUEST]: handleCustomerSendRequest,
		[EStateTicket.ADMIN_SEND_CONFIRM]: handleAdminSendConfirm,
		[EStateTicket.CUSTOMER_AGREE_CHANGE]: handleCustomerAgreeChange,
		[EStateTicket.CUSTOMER_DECLINE_CHANGE]: handleCustomerDeclineChange,
		[EStateTicket.ADMIN_CONFIRM_COMPLETE]: handleAdminConfirmComplete,
		[EStateTicket.ADMIN_SEND_ERROR]: handleAdminSendError,
		[EStateTicket.ADMIN_NOTIFY_COMPLETE]: handleAdminNotifyComplete,
		[EStateTicket.CUSTOMER_PAYMENT_SUCCESS]: handleCustomerPaymentSuccess,
	};

	if (executeFlow[state]) {
		console.log('Executing function for state:', state);
		const data = await executeFlow[state](payload, baseUrl);
		return data;
	} else {
		throw new Error('The flow does not exist in the system');
	}
};

/**
 * Removes uploaded files from the server.
 */
const removeFileUpload = async (files: IAttachmentsFile[]) => {
	try {
		for (const file of files) {
			// Check if file exists
			await fs.stat(file.path);
			// Remove file
			await fs.unlink(file.path);
		}
	} catch (err) {
		throw new Error('Error remove file upload');
	}
};
