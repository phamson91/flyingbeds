'use client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Loader from '../Loader';
import { useUser } from '@/hooks/useUser';
import { PATHS } from '@/lib/paths';
import Link from 'next/link';
import { Button } from '../ui/Button';
import DropdownUser from './DropdownUser';
import SettingUserModal from '@/app/dashboard/components/SettingUserModal';
import { EUserType } from '@/types/user';

const Header = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState<boolean>(false);
	const router = useRouter();
	const supabaseClient = useSupabaseClient();
	const { user, userDetails } = useUser();

	const handleLogout = async () => {
		setIsLoading(true);
		const { error } = await supabaseClient.auth.signOut();
		router.refresh();
		router.push(PATHS.LOGIN);

		if (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="bg-white w-full py-2 px-8 flex justify-end fixed z-10 shadow-sm">
			{isLoading ? (
				<Loader />
			) : (
				<div
					className="
          flex
          flex-row
          text-slate-600
          text-sm
          items-center
          gap-x-4
        "
				>
					<DropdownUser
						email={`Hello ${userDetails?.email || ''}`}
						onOpenUser={() => setIsOpenUser(true)}
					/>

					{(user?.role === 'service_role' ||
						userDetails?.admin_role === EUserType.ADMIN_TICKETING) && (
						<Link href={PATHS.ADMIN}>
							<Button type="button" variant={'ghost'} data-testid="btnAdmin">
								Admin
							</Button>
						</Link>
					)}
					<Button
						type="button"
						onClick={handleLogout}
						variant={'ghost'}
						data-testid="logout"
					>
						Logout
					</Button>
					<SettingUserModal
						userId={userDetails?.id}
						defaultValues={{
							email: userDetails?.email,
							password: '',
							companyName: userDetails?.company_name,
							phone: userDetails?.phone.slice(2),
							phonePrefix: `+${userDetails?.phone.slice(0, 2) || 61}`,
						}}
						isOpen={isOpenUser}
						onClose={() => setIsOpenUser(false)}
						title={'Edit User'}
						isUserLoading={isLoading}
					/>
				</div>
			)}
		</div>
	);
};

export default Header;
