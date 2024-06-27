import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ITicketInfo } from '@/types/booking';
import { checkAllSttTicketMatch } from '@/lib/handleData';

interface UpdateRowProps {
	data: {
		[key: string]: any;
	};
	id?: string;
	ticketsInfo?: ITicketInfo[];
	sttCheck?: string[];
	rootSttBooking?: string;
	desSttBooking?: string;
}

export const updateBookingServer = async ({
	id,
	ticketsInfo,
	sttCheck,
	rootSttBooking,
	desSttBooking,
	data,
}: UpdateRowProps) => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	let status = rootSttBooking;
	if (ticketsInfo && ticketsInfo.length > 0 && sttCheck) {
		const isAllSttTicketMatch = checkAllSttTicketMatch(ticketsInfo, sttCheck);
		status = isAllSttTicketMatch ? rootSttBooking : desSttBooking;
	}

	const updateData: any = { ...data, updated_at: new Date().toUTCString() };
	if (ticketsInfo) {
		updateData.tickets_info = JSON.stringify(ticketsInfo);
	}
	if (status) {
		updateData.status = status;
	}

	const { error } = id
		? await supabase.from('bookings').update(updateData).eq('id', id).select()
		: await supabase.from('bookings').insert([{ ...data }]);

	if (error) {
		console.log('error:', error);
		throw new Error(error.message);
	}
};
