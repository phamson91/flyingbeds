import { getLocations } from '@/actions/locations/server';
import Overview from './Overview';
import PriceSummary from './PriceSummary';

async function PnrReview() {
	const locations = await getLocations();

	if (!locations) {
		return <></>;
	}

	return (
		<article className="w-full text-lg my-2 flex gap-4">
			<Overview locations={locations} />
			<PriceSummary />
		</article>
	);
}

export default PnrReview;
