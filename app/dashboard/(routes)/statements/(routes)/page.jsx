import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Statements from '../components/Statements';

const StatementsPage = async () => {
	return (
		<Container>
			<section className="my-4">
				<Heading title="Statements" />
			</section>
			<section className="bg-white py-4 px-8 rounded-md">
				<Statements />
			</section>
		</Container>
	);
};

export default StatementsPage;
