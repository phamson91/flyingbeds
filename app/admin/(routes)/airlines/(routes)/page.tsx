import getAirlines from '@/actions/getAirlines';
import ManageAirlinesClient from '../components/ManageAirlinesClient';

const tableHead = ['Code', 'Name', 'Notes', 'Action'];

const ManageAirlinesPage = async () => {
  const airlines = await getAirlines();

  return (
    <>
      <ManageAirlinesClient tableHead={tableHead} airlines={airlines} />
    </>
  );
};

export default ManageAirlinesPage;
