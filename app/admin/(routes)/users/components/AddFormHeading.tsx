interface AddFormHeadingProps {
  children: React.ReactNode;
}

const AddFormHeading: React.FC<AddFormHeadingProps> = ({ children }) => {
  return <div className="pb-1 text-sm">{children}</div>;
};

export default AddFormHeading;
