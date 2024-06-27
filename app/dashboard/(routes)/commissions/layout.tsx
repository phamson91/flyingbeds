import Container from '@/components/Container';
import Heading from '@/components/Heading';

interface CommissionsLayoutProps {
  children: React.ReactNode;
}

const CommissionsLayout: React.FC<CommissionsLayoutProps> = ({ children }) => {
  return (
    <Container>
      <div className="my-4">
        <Heading title="Commissions & Fee" />
      </div>
      <div
        className="
          bg-white 
          p-8 
          rounded-md"
      >
        {children}
      </div>
    </Container>
  );
};

export default CommissionsLayout;
