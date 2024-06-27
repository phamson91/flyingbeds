import path from 'path';

export const TEST_EMAIL = process.env.TEST_EMAIL || 'test@test.com';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || '123456';

//Account email
export const NEXT_PUBLIC_EMAIL_ACCOUNT =
	process.env.NEXT_PUBLIC_EMAIL_ACCOUNT || 'dobtechh@gmail.com';
export const NEXT_PUBLIC_EMAIL_PASSWORD =
	process.env.NEXT_PUBLIC_EMAIL_PASSWORD || 'ayoomnsypqjjstuz';

//Folder file upload
export const FILE_PATH_TEMPLATE = path.resolve('public', 'template_files');
export const FILE_NAME_TICKET_PRICE = "TicketPrice.xlsx";

// JWT
export const JWT_MAIL_VERIFICATION_EXPIRES_IN = 60 * 60 * 24; // in second, 1 day
export const JWT_SECRET_MAIL_VERIFICATION =
	(process.env.JWT_SECRET_MAIL_VERIFICATION as string) || 'emailKey';

// DB
export const REDIS_TOKEN_STORAGE_PREFIX = 'flyingbeds:token_storage:';
export const REDIS_BOOKING_STORAGE_PREFIX = 'flyingbeds:booking_storage:pnr';
