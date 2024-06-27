interface HeadingProps {
	title: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
	return <div className="font-semibold my-4">{title}</div>;
};

export default Heading;
