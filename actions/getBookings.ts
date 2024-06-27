import { Booking } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getBookings = async (): Promise<Booking[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userData.user?.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getBookings;
