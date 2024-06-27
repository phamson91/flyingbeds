import { Airline } from '@/types/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getAirlines = async (): Promise<Airline[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from('airlines')
    .select('id, name, short_name, notes');

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getAirlines;
