import { getLocations } from '@/actions/locations/server';
import FlightInfo from './FlightInfo';
import UserInfo from './UserInfo';

const UserInformation = async ({}) => {
	const locations = await getLocations();
	return (
		<article className="w-full text-lg my-2 flex gap-4">
			<UserInfo />
			<FlightInfo locations={locations} />
		</article>
	);
};

export default UserInformation;
