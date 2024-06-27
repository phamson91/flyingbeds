import { ISettingResponse, TSettingKey } from '@/types/setting';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getAllSetting = async (): Promise<ISettingResponse[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase.from('settings').select();

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	return (data as ISettingResponse[]) || [];
};

export const getSettingByKey = async (
	key: TSettingKey
): Promise<ISettingResponse> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const { data, error } = await supabase
		.from('settings')
		.select('*')
		.eq('id', key)
		.maybeSingle();

	if (error) {
		console.log(error.message);
	}
	if (!data) {
		throw new Error('Not found settings');
	}

	return data as ISettingResponse;
};
