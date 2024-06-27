import { useBooking } from '@/hooks/useBooking';
import { IUserInformation } from '@/types/bookingTicket';
import { differenceInYears } from 'date-fns';
import { FC } from 'react';

interface Props {
	usersInfo: IUserInformation[];
}

const Passengers: FC<Props> = ({ usersInfo }) => {
	const checkGender = (gender: string) => {
		return ['mr', 'master'].includes(gender) ? 'Mr' : 'Ms';
	};


	const checkPassengerType = (birthDay: Date, userInfo: IUserInformation) => {
		let age = differenceInYears(new Date(), birthDay);

		if (userInfo.gender.includes('mr') || userInfo.gender.includes('ms')) {
			return 'Adults';
		}

		if (birthDay) {
			if (age <= 1) return 'Infants';
			else if (age <= 17) return 'Children';
			else return 'Adults';
		}
	};

	return (
		<div className="pb-4">
			<div className="pb-4 flex justify-between items-center">
				<div className="text-base font-medium">List of Passenger(s)</div>
			</div>
			<div className="flex flex-col items-start gap-2">
				{usersInfo.map((user, index) => (
					<div
						key={index}
						className="flex justify-between items-center pl-4 w-full"
					>
						<p className="text-sm font-semibold">
							{`${checkGender(user.gender)}. ${user.firstName} ${
								user.middleName
							} ${user.lastName}`}
						</p>
						<p className="text-xs font-medium">
							{checkPassengerType(user.birthDay || new Date(), user)}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Passengers;
