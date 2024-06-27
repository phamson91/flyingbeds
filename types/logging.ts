export interface ILogging {
	id: string;
	created_by: {
		company_name: string;
	};
	receiver_user: {
		company_name: string;
	};
	amount: number;
	currency: string;
	description: string;
	created_at: Date;
}

export interface IGetLogging {
	page?: number;
	perPage?: number;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
	companyName?: string;
}