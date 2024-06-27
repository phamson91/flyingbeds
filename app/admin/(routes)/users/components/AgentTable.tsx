'use client';

import Input from '@/components/Input/Input';
import Table from '@/components/Table/Table';
import { PATHS } from '@/lib/paths';
import { UserDetails } from '@/types/types';
import Link from 'next/link';
import Toggle from './Toggle';
import formatNumber from '@/lib/formatNumber';
import { ChangeEvent, useEffect, useState } from 'react';
import { filterData } from '@/lib/handleData';
import { FaMinus, FaPen } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import AmountModal from './AmountModal';
import { useUser } from '@/hooks/useUser';

interface AgentTableProps {
	users: UserDetails[];
}

const AgentTable: React.FC<AgentTableProps> = ({ users }) => {
	const [userList, setUserList] = useState<UserDetails[]>(users);
	const [type, setType] = useState<'topUp' | 'reduce' | null>(null);
	const [userId, setUserId] = useState<string>('');
	const { userDetails } = useUser();

	useEffect(() => {
		setUserList(users);
	}, [users]);

	const tableHead = ['Users', 'Balance (AUD)', 'Max Credit (AUD)', 'Status', 'Actions'];

	const action = (userId: string) => (
		<div className="flex justify-around items-center">
			<Link
				data-testid="editUser"
				href={`${PATHS.ADMIN_USERS_EDIT}/${userId}`}
				key={`edit-${userId}`}
			>
				<FaPen
					className="hover:text-sky-500 text-sky-600 hover:cursor-pointer"
					size={16}
				/>
			</Link>
			<BiMoneyWithdraw
				className="hover:text-sky-500 text-sky-600 hover:cursor-pointer"
				size={25}
				data-testid="topUp"
				onClick={() => {
					setUserId(userId);
					setType('topUp');
				}}
			/>
			<FaMinus
				className="hover:text-sky-500 text-sky-600 hover:cursor-pointer"
				size={18}
				data-testid="reduceAmount"
				onClick={() => {
					setUserId(userId);
					setType('reduce');
				}}
			/>
		</div>
	);

	const tableBody = userList.map((user) => {
		const toggleStatusButton = (
			<Toggle
				key={`toggle-${user.id}`}
				isActive={user.is_operating}
				userId={user.id}
			/>
		);

		return [
			user.company_name,
			formatNumber(user.balance),
			formatNumber(user.max_credit),
			toggleStatusButton,
			action(user.id),
		];
	});

	const filter = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const searchResult = filterData({
			searchValue: value,
			data: users,
			findValues: ['company_name'],
		});
		setUserList(searchResult);
	};

	return (
		<>
			{type && (
				<AmountModal
					isOpen={!!type}
					onClose={() => setType(null)}
					userId={userId}
					adminId={userDetails?.id || ''}
					type={type}
				/>
			)}
			<div className="bg-white p-8 rounded-t-md shadow-md">
				<div className="flex items-center gap-2 justify-end">
					<span className="text-sm font-normal">Filter:</span>
					<Input
						className="w-40 p-2 border"
						id="user-search"
						onChange={filter}
					/>
				</div>
				<Table tableHead={tableHead} tableBody={tableBody} />
			</div>
		</>
	);
};

export default AgentTable;
