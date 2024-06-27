'use client';
import { IContactInformation } from '@/types/bookingTicket';
import { Mail, Phone, User } from 'lucide-react';
import { FC } from 'react';
import LabelWithIcon from '../LabelWithIcon';

interface Props {
	contactInfo: IContactInformation;
}

const ContactDetail: FC<Props> = ({ contactInfo }) => {

	return (
		<div className="pb-4">
			<div className="pb-4 flex justify-between items-center">
				<div className="text-base font-medium">Contact Detail</div>
				{/* <div className="text-sm">Edit</div> */}
				{/* <Button
					onClick={handleEdit}
					className="bg-white border border-sky-600 text-sky-600 text-sm hover:text-white"
				>
					<p>Edit</p>
				</Button> */}
			</div>
			<div className="flex justify-between items-center pl-4">
				<LabelWithIcon icon={<User />} label="FULL NAME" />
				<p className="text-sm font-medium p-2">{contactInfo.fullName}</p>
			</div>
			<div className="flex justify-between items-center pl-4">
				<LabelWithIcon icon={<Phone />} label="PHONE NUMBER" />
				<p className="text-sm font-medium p-2">
					{`(${contactInfo.region}) ${contactInfo.phoneNumber}`}
				</p>
			</div>
			<div className="flex justify-between items-center pl-4">
				<LabelWithIcon icon={<Mail />} label="EMAIL" />
				<p className="text-sm font-medium p-2">{contactInfo.email}</p>
			</div>
		</div>
	);
};

export default ContactDetail;
