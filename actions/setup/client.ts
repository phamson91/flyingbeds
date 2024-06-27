import { ISettingResponse, TSettingKey } from '@/types/setting';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getSettingByKey = async (
	key: TSettingKey
): Promise<ISettingResponse> => {
	const supabase = createClientComponentClient({});

	const { data, error } = await supabase
		.from('settings')
		.select('*')
		.eq('id', key)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error('Not found settings');
	}

	return data as ISettingResponse;
};
