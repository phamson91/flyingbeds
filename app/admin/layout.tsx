'use client';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { PATHS } from '@/lib/paths';
import {
	MdOutlineAirplanemodeActive,
	MdOutlineGrading,
	MdInsertChart,
	MdOutlineViewList,
	MdSupervisedUserCircle,
	MdAirplaneTicket,
	MdLocationOn
} from 'react-icons/md';
import Container from '@/components/Container';
import { FaCog } from 'react-icons/fa';
import { useUser } from '@/hooks/useUser';
import { EUserType } from '@/types/user';

interface AdminDashboardLayoutProps {
	children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
	children,
}) => {
	const { userDetails } = useUser();
	const isAdminTicketing =
		userDetails?.admin_role === EUserType.ADMIN_TICKETING;

	const pathName = usePathname();

	const routes = useMemo(
		() =>
			isAdminTicketing
				? [
					{
						icon: MdOutlineViewList,
						label: 'Manage Bookings',
						active: pathName === PATHS.ADMIN,
						href: PATHS.ADMIN,
					},
					{
						icon: MdAirplaneTicket,
						label: 'Action Booking',
						active: pathName === PATHS['ADMIN_ACTION-BOOKING'],
						href: PATHS['ADMIN_ACTION-BOOKING'],
					},
				]
				: [
					{
						icon: MdOutlineViewList,
						label: 'Manage Bookings',
						active: pathName === PATHS.ADMIN,
						href: PATHS.ADMIN,
					},
					{
						icon: MdAirplaneTicket,
						label: 'Action Booking',
						active: pathName === PATHS['ADMIN_ACTION-BOOKING'],
						href: PATHS['ADMIN_ACTION-BOOKING'],
					},
					{
						icon: MdSupervisedUserCircle,
						label: 'Manage Agents',
						active: pathName.startsWith(PATHS.ADMIN_USERS),
						href: PATHS.ADMIN_USERS,
					},
					{
						icon: MdOutlineAirplanemodeActive,
						label: 'Manage Airlines',
						active: pathName.startsWith(PATHS.ADMIN_AIRLINES),
						href: PATHS.ADMIN_AIRLINES,
					},
					{
						icon: MdLocationOn,
						label: 'Manage Locations',
						active: pathName.startsWith(PATHS.ADMIN_LOCATIONS),
						href: PATHS.ADMIN_LOCATIONS,
					},
					{
						icon: MdOutlineGrading,
						label: 'Logging',
						active: pathName.startsWith(PATHS.ADMIN_LOGGING),
						href: PATHS.ADMIN_LOGGING,
					},
					{
						icon: MdInsertChart,
						label: 'Reports',
						active: pathName.startsWith(PATHS.ADMIN_REPORTS),
						href: PATHS.ADMIN_REPORTS,
					},
					{
						icon: FaCog,
						label: 'Settings',
						active: pathName.startsWith(PATHS.ADMIN_SETTINGS),
						href: PATHS.ADMIN_SETTINGS,
					},
				],
		[pathName, isAdminTicketing]
	);

	return (
		<>
			<Header />
			<Sidebar routes={routes}>
				<div
					className="
        pt-16
      "
				>
					<Container>{children}</Container>
				</div>
			</Sidebar>
		</>
	);
};

export default AdminDashboardLayout;