import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Reports from '../components/Reports';

const ReportsPage = async () => {
	return (
		<Container>
			<section className="my-4">
				<Heading title="Reports" />
			</section>
			<section className="bg-white py-4 px-8 rounded-md">
				<Reports />
			</section>
		</Container>
	);
};

export default ReportsPage;
