'use client';
import { Form } from '@/components/ui/form';
import { useBookingTickets } from '@/hooks/useBookingTickets';
import { useEffect } from 'react';
import ContactInfo from './ContactInfo';
import UserInfoDetail from './UserInfoDetail';
import { useUserForm } from '../../hooks/useUserForm';
import { useUser } from '@/hooks/useUser';

const UserInfo = () => {
	const { selectedTickets } = useBookingTickets();
	const { formUserInfo, fieldsUser } = useUserForm();
	const { userDetails } = useUser();

	useEffect(() => {
		const lengthUserForm = parseInt(selectedTickets?.countTicket ?? 1);
		formUserInfo.setValue(
			'usersInfo',
			Array.from({ length: lengthUserForm }, () => ({
				gender: 'mr',
				firstName: '',
				middleName: '',
				lastName: '',
				birthDay: undefined,
			}))
		);
	}, [formUserInfo, selectedTickets]);

	useEffect(() => {
		formUserInfo.setValue('contactInfo', {
			fullName: userDetails?.company_name,
			email: userDetails?.email,
			region: `+${userDetails?.phone.substring(0, 2)}`,
			phoneNumber: userDetails?.phone.substring(3),
		});
	}, [formUserInfo, userDetails]);

	return (
		<div className="w-full h-fit bg-white rounded-lg p-4">
			<Form {...formUserInfo}>
				<form
					className="w-full"
				>
					<p className="text-xl font-semibold text-center">User Information</p>
					{fieldsUser.fields.map((field: any, index: number) => (
						<UserInfoDetail
							key={field.id}
							form={formUserInfo}
							field={field}
							index={index}
						/>
					))}
				</form>
				<p className="text-xl font-semibold text-center pt-4">
					Contact Information
				</p>
				<ContactInfo form={formUserInfo} />
			</Form>
		</div>
	);
};

export default UserInfo;
