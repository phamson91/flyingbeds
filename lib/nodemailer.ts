import {
	NEXT_PUBLIC_EMAIL_ACCOUNT,
	NEXT_PUBLIC_EMAIL_PASSWORD,
} from '@/utils/constant';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: NEXT_PUBLIC_EMAIL_ACCOUNT,
		pass: NEXT_PUBLIC_EMAIL_PASSWORD,
	},
});
