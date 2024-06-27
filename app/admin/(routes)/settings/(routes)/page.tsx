import { getAllSetting } from '@/actions/setup/server';
import Heading from '@/components/Heading';
import { ISettingFormat, ISettingResponse, TSettingKey } from '@/types/setting';
import Setting from './components/Setting';

const SettingsPage = async () => {
	let data: ISettingResponse[] = [];
	let error: string = '';
	try {
		data = await getAllSetting();
	} catch (error) {
		error = error;
	}

	const settingsFormat = data.reduce(
		(acc: ISettingFormat, cur: ISettingResponse) => {
			if (!acc[cur.id as TSettingKey]) {
				acc[cur.id as TSettingKey] = cur.value;
			}
			return acc;
		},
		{}
	);

	return (
		<>
			<Heading title="Settings" />
			<section className="bg-white p-8 rounded-t-md shadow-md">
				{error ? (
					<div>Not found setting</div>
				) : (
					<Setting data={settingsFormat} />
				)}
			</section>
		</>
	);
};

export default SettingsPage;
