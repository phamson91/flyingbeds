import { IBookingRequest, IBookingRes, IBookingSupa } from '@/types/booking';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getBookingsClient = async ({
	page,
	perPage,
	startDate,
	endDate,
	searchValue,
	sttBooking,
}: IBookingRequest): Promise<IBookingRes> => {
	const supabase = createClientComponentClient({});
	const { data: userData } = await supabase.auth.getUser();

	let query = supabase
		.from('bookings')
		.select('*', { count: 'exact' })
		.eq('user_id', userData?.user?.id);

	//If search value are provided, add the like to query.
	if (sttBooking) {
		query = query.eq('status', sttBooking);
	}
	//If search value are provided, add the like to query.
	if (searchValue) {
		query = query.filter('record_locator', 'ilike', `%${searchValue}%`);
	}

	// If the page and perPage values are provided, add the range to the query
	if (page && perPage) {
		query = query.range((page - 1) * perPage, page * perPage - 1);
	}

	//If the startDate and endDate values are provided, add the range to the query
	if (startDate && endDate) {
		query = query.gte('updated_at', startDate).lte('updated_at', endDate);
	}

	// Order the query by start_date in descending order
	query = query.order('updated_at', { ascending: false });

	const { data, count, error } = await query;

	if (error) {
		console.log(error.message);
		return { data: null, count: null, error: error.message };
	}

	const parsedData = data.map((item) => {
		const parsedTicketsInfo = JSON.parse(item.tickets_info);
		return {
			...item,
			tickets_info: parsedTicketsInfo,
		};
	});

	return { data: parsedData as IBookingRes['data'], count, error: null };
};

export const getAllBookingsClient = async ({
	page,
	perPage,
	startDate,
	endDate,
	searchValue,
	sttBooking,
	sortBy,
}: IBookingRequest): Promise<IBookingRes> => {
	const supabase = createClientComponentClient({});

	let query = supabase.from('bookings').select('*', { count: 'exact' });

	//If search value are provided, add the like to query.
	if (searchValue) {
		query = query.filter('record_locator', 'ilike', `%${searchValue}%`);
	}

	// If the page and perPage values are provided, add the range to the query
	if (page && perPage) {
		query = query.range((page - 1) * perPage, page * perPage - 1);
	}

	//If the startDate and endDate values are provided, add the range to the query
	if (startDate && endDate) {
		query = query.gte('created_at', startDate).lte('created_at', endDate);
	}

	if (sttBooking) {
		query = query.eq('status', sttBooking);
	}

	// Order the query by start_date in descending order
	query = query.order('updated_at', { ascending: sortBy === 'ascending' });

	const { data, count, error } = await query;

	if (error) {
		console.log(error.message);
		return { data: null, count: null, error: error.message };
	}

	const parsedData = data.map((item) => {
		const parsedTicketsInfo = JSON.parse(item.tickets_info);
		return {
			...item,
			tickets_info: parsedTicketsInfo,
		};
	});

	return { data: parsedData as IBookingRes['data'], count, error: null };
};

export const getBookingById = async (id: string): Promise<IBookingSupa> => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('bookings')
		.select('*')
		.eq('id', id)
		.limit(1)
		.single();

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	data.tickets_info = JSON.parse(data.tickets_info);

	return data as IBookingSupa;
};
