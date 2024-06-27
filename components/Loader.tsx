import { PuffLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div
      className="
      flex 
      flex-row 
      justify-center
			mt-4
    "
    >
      <PuffLoader size={50} color="red" />
    </div>
  );
};

export default Loader;
