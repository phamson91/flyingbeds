'use client';
import { IFormUserInfo, IPassengers } from '@/types/bookingTicket';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

interface UserFormContextType {
	formUserInfo: any;
	fieldsUser: any;
	formUserData: IFormUserInfo | undefined;
	setFormUserData: (value: IFormUserInfo) => void;
	formPassenger: any;
	pricePerUser: IPassengers;
	setPricePerUser: (value: IPassengers) => void;
}

const UserFormContext = createContext<UserFormContextType | undefined>(
	undefined
);

interface Props {
	[propName: string]: any;
}

const validationFormUser = z.object({
	usersInfo: z.array(
		z.object({
			gender: z.string().min(1, {
				message: 'Gender must be at least 2 characters.',
			}),
			firstName: z.string().min(2, {
				message: 'First name must be at least 2 characters.',
			}),
			middleName: z.string().optional(),
			lastName: z.string().min(2, {
				message: 'Last name must be at least 2 characters.',
			}),
			birthDay: z.any().refine((value) => value !== '', {
				message: 'Date of birth date is required',
			}),
		})
	),
	contactInfo: z.object({
		fullName: z.string().min(2, {
			message: 'Full name must be at least 2 characters.',
		}),
		email: z.string().min(2, {
			message: 'Email must be at least 2 characters.',
		}),
		region: z.string().min(2, {
			message: 'Region must be at least 2 characters.',
		}),
		phoneNumber: z.string().min(2, {
			message: 'Phonenumber must be at least 2 characters.',
		}),
	}),
});

const FormPassengerSchema = z.object({
	passengers: z.object({
		adults: z.number().refine((value) => !isNaN(value) && value >= 1, {
			message: 'Adults must be a number greater than or equal to 1',
		}),
		children: z.number().refine((value) => !isNaN(value) && value >= 0, {
			message: 'Children must be a number greater than or equal to 0',
		}),
		infants: z.number().refine((value) => !isNaN(value) && value >= 0, {
			message: 'Infants must be a number greater than or equal to 0',
		}),
	}),
});


interface IPassenger {
	adults: number;
	children: number;
	infants: number;
}

export interface FormSchemaPassenger {
	passengers: IPassenger;
}

export const UserFormContextProvider = (props: Props) => {
	const [formUserData, setFormUserData] = useState<IFormUserInfo>();
	const [pricePerUser, setPricePerUser] = useState<IPassengers>({
		ADT: 0,
		CH: 0,
		IN: 0,
	});

	// User Information
	const formUserInfo = useForm<IFormUserInfo>({
		defaultValues: {
			usersInfo: [
				{
					gender: 'mr',
					firstName: '',
					middleName: undefined,
					lastName: '',
					birthDay: undefined,
				},
			],
			contactInfo: {
				fullName: '',
				email: '',
				region: '',
				phoneNumber: '',
			},
		},
		resolver: zodResolver(validationFormUser),
	});

	const formPassenger = useForm<FormSchemaPassenger>({
		resolver: zodResolver(FormPassengerSchema),
		defaultValues: {
			passengers: {
				adults: 1,
				children: 0,
				infants: 0,
			},
		},
	});

	const fieldsUser = useFieldArray({
		control: formUserInfo.control,
		name: 'usersInfo',
	});

	const value = {
		formUserInfo,
		fieldsUser,
		formUserData,
		setFormUserData,
		formPassenger,
		pricePerUser,
		setPricePerUser,
	};

	return <UserFormContext.Provider value={value} {...props} />;
};

export const useUserForm = () => {
	const context = useContext(UserFormContext);
	if (context === undefined) {
		throw new Error('useUserForm must be used within a UserFormContext');
	}
	return context;
};
