import { UserDetails } from '@/types/types';
import { User } from '@supabase/auth-helpers-nextjs';
import {
	useSessionContext,
	useUser as useSupaUser,
} from '@supabase/auth-helpers-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type UserContextType = {
	user: User | null;
	userDetails: UserDetails | null;
	isLoading: boolean;
	setUserDetails: (userDetails: UserDetails | null) => void;
	fetchUserDetails: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
	[propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
	const { isLoading: isLoadingUser, supabaseClient: supabase } =
		useSessionContext();
	const user = useSupaUser();
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

	const getUserDetails = (id: string) =>
		supabase.from('users').select('*').eq('id', id).single();

	const fetchUserDetails = async () => {
		const {
			data: { user: _user },
		} = await supabase.auth.getUser();

		if (_user && !isLoadingData) {
			setIsLoadingData(true);

			getUserDetails(_user.id).then(({ data, error }) => {
				if (error) {
					toast.error(error.message);
					return;
				}
				const email = _user.email;
				const phone = _user.phone;
				const userData = { ...data, email, phone };
				setUserDetails(userData as UserDetails);
				setIsLoadingData(false);
			});
		} else if (!_user && !isLoadingUser && !isLoadingData) {
			setUserDetails(null);
		}
	};

	useEffect(() => {
		user && fetchUserDetails();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const value = {
		user,
		isLoading: isLoadingUser || isLoadingData,
		userDetails,
		setUserDetails,
		fetchUserDetails,
	};

	return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserContextProvider');
	}
	return context;
};
