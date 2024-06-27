import * as jwt from 'jsonwebtoken';
import {
	JWT_MAIL_VERIFICATION_EXPIRES_IN,
	JWT_SECRET_MAIL_VERIFICATION,
} from '@/utils/constant';

export const createTokenWithExpiresIn = (
	data: any,
	expiresIn: number
): string => {
	const token = jwt.sign({ ...data }, JWT_SECRET_MAIL_VERIFICATION, {
		expiresIn: expiresIn,
	});

	return token;
};
export const createToken = (data: any): string => {
	const token = jwt.sign({ ...data }, JWT_SECRET_MAIL_VERIFICATION);

	return token;
};

export const decodedToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET_MAIL_VERIFICATION);
		return decoded;
	} catch (err) {
		throw new Error('Token invalid');
	}
};
