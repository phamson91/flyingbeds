import ManageLocationsClient from '../components/ManageLocationsClient';
import { getLocations } from '@/actions/locations/server';

const tableHead = ['Code', 'Name', 'Region', 'Action'];

const ManageLocationsPage = async () => {
  const locations = await getLocations();

  return (
    <>
      <ManageLocationsClient tableHead={tableHead} locations={locations} />
    </>
  );
};

export default ManageLocationsPage;