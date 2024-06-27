'use client';

import Table from '@/components/Table/Table';
import formatNumber from '@/lib/formatNumber';
import { Commission } from '@/types/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaPen, FaPlusCircle, FaTimes } from 'react-icons/fa';
import ComEditModal from '@/app/dashboard/(routes)/commissions/(routes)/[airlineId]/components/ComEditModal';
import AlertModal from '@/components/modals/AlertModal';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { filterData } from '@/lib/handleData';
import { useUser } from '@/hooks/useUser';
import { handleDelete } from '@/lib/utils';

interface AirlineCommissionsProps {
	shortName: string;
	commissions: Commission[];
	airlineId: string;
}

const tableHeadTitle = [
	'Airline',
	'Description',
	'Class',
	'Fare Basis Code',
	'User Commission',
	'Service Fee (AUD)',
];

const tableHeadTitleAdmin = [
	'Airline',
	'Description',
	'Class',
	'Fare Basis Code',
	'User Commission',
	'Airline Commission',
	'Service Fee (AUD)',
	'Action',
];

const AirlineCommissions: React.FC<AirlineCommissionsProps> = ({
	shortName,
	commissions,
	airlineId,
}) => {
	const router = useRouter();
	const [editorOpen, setEditorOpen] = useState<boolean>(false);
	const [editData, setEditData] = useState<Commission | undefined>(undefined);
	const [deleteComId, setDeleteComId] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [commissionList, setCommissionList] =
		useState<Commission[]>(commissions);
	const { user } = useUser();
	const isAdmin = user?.role === 'service_role';

	const tableHead = isAdmin ? tableHeadTitleAdmin : tableHeadTitle;

	useEffect(() => {
		setCommissionList(commissions);
	}, [commissions]);

	const handleEdit = (item: Commission) => {
		setEditData(item);
		setEditorOpen(true);
	};

	const comHandleDelete = (id: string) =>
		handleDelete({
			id,
			setIsDeleting,
			routerRefresh: () => router.refresh(),
			setDeleteId: () => setDeleteComId(''),
			table: 'commissions',
		});

	const filter = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const searchResult = filterData({
			searchValue: value,
			data: commissions,
			findValues: ['description'],
		});

		setCommissionList(searchResult);
	};

	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>Commissions</p>
			{isAdmin && (
				<FaPlusCircle
					data-testid="btnAddCommission"
					className="hover:text-sky-500 hover:cursor-pointer w-4 h-4 text-sky-600"
					onClick={() => setEditorOpen(true)}
				/>
			)}
		</div>,
		<div key={1} className="flex items-center gap-2">
			<span className="text-sm font-normal">Filter:</span>
			<Input
				className="w-40 p-2 border"
				id="commission-search"
				onChange={filter}
			/>
		</div>,
	];

	const tableBody = commissionList?.map((item) => {
		const action = (
			<div className="flex justify-around items-center">
				<FaPen
					data-testid="btnEditCommission"
					className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
					onClick={() => handleEdit(item)}
				/>
				<FaTimes
					data-testid="btnDeleteCommission"
					className="hover:fill-red-400 fill-red-600 hover:cursor-pointer w-4 h-4"
					onClick={() => setDeleteComId(item.id)}
				/>
			</div>
		);
		return isAdmin
			? [
					shortName,
					item.description,
					item.class,
					item.fare_basic,
					`${formatNumber(item.user_commission * 100, {
						minimumFractionDigits: 2,
					})}%`,
					`${formatNumber(item.airline_commission * 100, {
						minimumFractionDigits: 2,
					})}%`,
					formatNumber(item.service_fee, { minimumFractionDigits: 2 }),
					action,
			  ]
			: [
					shortName,
					item.description,
					item.class,
					item.fare_basic,
					`${formatNumber(item.user_commission * 100, {
						minimumFractionDigits: 2,
					})}%`,
					formatNumber(item.service_fee, { minimumFractionDigits: 2 }),
			  ];
	});

	return (
		<>
			{isAdmin && (
				<ComEditModal
					title={editData ? 'Edit commission' : 'Add new commission'}
					isOpen={editorOpen}
					onClose={() => setEditorOpen(false)}
					airline_id={airlineId}
					editData={editData}
					setEditData={setEditData}
				/>
			)}
			{isAdmin && (
				<AlertModal
					title="Delete Commission Record"
					isOpen={!!deleteComId}
					onClose={() => setDeleteComId('')}
					description="This action cannot be undone."
					onConfirm={async () => await comHandleDelete(deleteComId)}
					loading={isDeleting}
				/>
			)}
			<Table title={tableTitle} tableHead={tableHead} tableBody={tableBody} />
		</>
	);
};

export default AirlineCommissions;
