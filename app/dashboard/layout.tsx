'use client';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { PATHS } from '@/lib/paths';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
	MdAirplaneTicket,
	MdArticle,
	MdInsertChart,
	MdOutlineViewList,
	MdRequestPage,
} from 'react-icons/md';
import { TbBrandBooking } from "react-icons/tb";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	const pathName = usePathname();

	const routes = useMemo(
		() => [
			{
				icon: MdOutlineViewList,
				label: 'Manage Booking',
				active: pathName === PATHS.DASHBOARD,
				href: PATHS.DASHBOARD,
			},
			{
				icon: MdAirplaneTicket,
				label: 'Action Booking',
				active: pathName === PATHS['DASHBOARD_ACTION-BOOKING'],
				href: PATHS['DASHBOARD_ACTION-BOOKING'],
			},
			{
				icon: MdRequestPage,
				label: 'Commissions',
				active: pathName.startsWith(PATHS['DASHBOARD_COMMISSIONS']),
				href: PATHS['DASHBOARD_COMMISSIONS'],
			},
			{
				icon: MdInsertChart,
				label: 'Reports',
				active: pathName.startsWith(PATHS['DASHBOARD_REPORTS']),
				href: PATHS['DASHBOARD_REPORTS'],
			},
			{
				icon: MdArticle,
				label: 'Statements',
				active: pathName.startsWith(PATHS['DASHBOARD_STATEMENTS']),
				href: PATHS['DASHBOARD_STATEMENTS'],
			},
			{
				icon: TbBrandBooking,
				label: 'Booking Ticket',
				active: pathName.startsWith(PATHS['DASHBOARD_TICKETS']),
				href: PATHS['DASHBOARD_TICKETS'],
			}
		],
		[pathName]
	);

	return (
		<>
			<Header />
			<Sidebar routes={routes}>
				<div className="pt-16">{children}</div>
			</Sidebar>
		</>
	);
};

export default DashboardLayout;