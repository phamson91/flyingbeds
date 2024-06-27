import { BookingTickets } from '@/types/types';
import {
	IAttachmentsFile,
	IBookingSupa,
	IFormRefund,
	IFormRefundResponse,
	ITicketInfo,
	SectorInfo,
} from './booking';

export enum EStateTicket {
	CUSTOMER_SEND_REQUEST = 'CUSTOMER:SEND_REQUEST',
	ADMIN_SEND_CONFIRM = 'ADMIN:SEND_CONFIRM',
	CUSTOMER_AGREE_CHANGE = 'CUSTOMER:AGREE_CHANGE',
	CUSTOMER_DECLINE_CHANGE = 'CUSTOMER:DECLINE_CHANGE',
	ADMIN_CONFIRM_COMPLETE = 'ADMIN:CONFIRM_COMPLETE',
	CUSTOMER_NOTICE_COMPLETE = 'CUSTOMER:NOTICE_COMPLETE',
	ADMIN_SEND_ERROR = 'ADMIN:SEND_ERROR',
	ADMIN_NOTIFY_COMPLETE = 'ADMIN:NOTIFY_COMPLETE',
	ADMIN_CANCEL_CONFIRM = 'ADMIN:CANCEL_CONFIRM',
	CUSTOMER_PAYMENT_SUCCESS = 'CUSTOMER:PAYMENT_SUCCESS',
}

export type TStateTicket = // or keyof typeof ESTateTicket (Object)

		| EStateTicket.CUSTOMER_SEND_REQUEST
		| EStateTicket.ADMIN_SEND_CONFIRM
		| EStateTicket.CUSTOMER_AGREE_CHANGE
		| EStateTicket.CUSTOMER_DECLINE_CHANGE
		| EStateTicket.ADMIN_CONFIRM_COMPLETE
		| EStateTicket.CUSTOMER_NOTICE_COMPLETE
		| EStateTicket.ADMIN_SEND_ERROR
		| EStateTicket.ADMIN_NOTIFY_COMPLETE
		| EStateTicket.ADMIN_CANCEL_CONFIRM
		| EStateTicket.CUSTOMER_PAYMENT_SUCCESS;

export interface ReqParamsSendMail {
	state: TStateTicket;
	payload: IRequestTicket | IAdminSendResult | IMailWithToken | ICustomerPaymentSuccess;
}

export interface ICustomerPaymentSuccess {
	emailRecipients: string;
	ticketIssued: BookingTickets;
	sectorInfo: SectorInfo[];
}

export interface ParamsSendMail {
	emailRecipients: string;
	html: string;
	subject: string;
	attachments: IAttachmentsFile[];
}

export interface IResponseEmail extends INoticeEmail {
	agreeLink: string;
	declineLink: string;
	title?: string;
}

export interface INoticeEmail extends IFormRefundResponse {
	// emailRecipients: string;
	tickets: ITicketInfo[];
	rloc: string;
	typeTicket: string;
	attachmentsFile?: IAttachmentsFile[] | null;
}

export interface IRequestTicket extends IFormRefund {
	booking: IBookingSupa;
	sectorInfos: SectorInfo[];
	rloc: string;
	typeTicket: string;
	attachmentsFile?: IAttachmentsFile[] | null;
}

export interface IResponseTicket extends IFormRefundResponse {
	booking: IBookingSupa;
	rloc: string;
	typeTicket: string;
	attachmentsFile?: IAttachmentsFile[] | null;
	adminId: string;
}

export interface IAdminSendResult extends IFormRefundResponse {
	booking: IBookingSupa;
	rloc: string;
	typeTicket: string;
	attachmentsFile?: IAttachmentsFile[] | null;
	adminId: string;
}

export interface IMailWithToken {
	token: string;
	tokenKey?: string;
	tickets: string;
	ticketsChange?: Record<string, string>;
}

export interface IConfirmCompleteTicket {
	title: string;
	notes: string;
}
export interface IConfirmCompleteTicketReq {
	title: string;
	tickets: ITicketInfo[];
	amount: number | string;
	notes: string;
	ticketsChange?: Record<string, string> | null;
}
