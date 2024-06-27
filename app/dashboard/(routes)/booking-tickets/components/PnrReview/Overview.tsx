'use client';
import { ILocation } from '@/types/types';
import { FC } from 'react';
import { useUserForm } from '../../hooks/useUserForm';
import BookingReference from './BookingReference';
import ContactDetail from './ContactDetail';
import FlightDetail from './FlightDetail';
import Passengers from './Passengers';

interface Props {
	locations: ILocation[];
}

const Overview: FC<Props> = ({ locations }) => {
	const { formUserData } = useUserForm();

	return (
		<div className="bg-white w-full rounded-md p-4">
			<div className="w-full flex justify-center text-xl font-semibold pb-4">
				Overview
			</div>
			{/* Booking reference */}
			<BookingReference />
			{/* Contact detail */}
			{formUserData && (
				<>
					<ContactDetail contactInfo={formUserData?.contactInfo} />

					<Passengers usersInfo={formUserData?.usersInfo} />
				</>
			)}
			<FlightDetail locations={locations} />
		</div>
	);
};

export default Overview;
