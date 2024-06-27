import Heading from '@/components/Heading';
import Report from '../components/Reports';

const ReportsPage = () => {
	return (
		<>
			<Heading title="Reports" />
			<section className="bg-white p-8 rounded-t-md shadow-md">
				<Report />
			</section>
		</>
	);
};

export default ReportsPage;
