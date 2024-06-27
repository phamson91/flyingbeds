export interface ISettingResponse {
	id: string;
	name: string;
	value: string;
	created_at: Date;
	updated_at: Date;
}

export enum ESettingKey {
	JWT_MAIL_VERIFICATION_EXPIRES_IN = 'JWT_MAIL_VERIFICATION_EXPIRES_IN',
}

export type TSettingKey = 'JWT_MAIL_VERIFICATION_EXPIRES_IN';

export type ISettingFormat = {
	[key: string]: string;
};

export type FormInputs = {
	JWT_MAIL_VERIFICATION_EXPIRES_IN: string;
};