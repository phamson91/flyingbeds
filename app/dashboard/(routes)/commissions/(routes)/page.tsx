import { FaPlane } from 'react-icons/fa';
import getAirlines from '@/actions/getAirlines';
import FindAirline from '../components/FindAirline';

const CommissionPage = async () => {
	const airlines = await getAirlines();

	return (
		<>
			<div className="text-md pb-2">Airlines</div>
			<div className="flex relative w-full">
				<div className="border-l border-y border-neutral-300 rounded-l-md p-2 pt-2 bg-slate-100">
					<FaPlane size={20} className="text-slate-400" />
				</div>
				<FindAirline airlines={airlines} />
			</div>
		</>
	);
};

export default CommissionPage;
