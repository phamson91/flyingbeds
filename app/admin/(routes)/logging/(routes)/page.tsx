import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Logging from '../components/Logging';

const LoggingPage = () => {
	return (
		<Container>
			<section className="my-4">
				<Heading title="Logging" />
			</section>
			<section className="bg-white py-4 px-8 rounded-md">
				<Logging />
			</section>
		</Container>
	);
};

export default LoggingPage;
