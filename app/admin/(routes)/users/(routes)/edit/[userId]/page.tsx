import Heading from '@/components/Heading';
import AddForm from '../../../components/AddForm';
import getUser from '@/actions/getUser';
import { EUserType } from '@/types/user';

const EditUserPage = async ({ params }: { params: { userId: string } }) => {
	const { userId } = params;
	const { company_name, email, phone, max_credit, admin_role } = await getUser(
		userId
	);
	const phonePrefix = `+${phone.slice(0, 2)}`;
	const phoneNo = phone.slice(2);

	return (
		<>
			<Heading title={`Edit ${company_name}`} />
			<AddForm
				defaultValues={{
					email,
					password: '',
					companyName: company_name,
					phone: phoneNo,
					phonePrefix,
					creditLimit: max_credit,
					role: admin_role || EUserType.USER,
				}}
				userId={userId}
			/>
		</>
	);
};

export default EditUserPage;
