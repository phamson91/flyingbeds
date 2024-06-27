'use client';

import Input from '@/components/Input/Input';
import Table from '@/components/Table/Table';
import formatNumber from '@/lib/formatNumber';
import { IFee } from '@/types/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaPen, FaPlusCircle, FaTimes } from 'react-icons/fa';
import FeeEditModal from './FeeEditModal';
import AlertModal from '@/components/modals/AlertModal';
import { useRouter } from 'next/navigation';
import { filterData } from '@/lib/handleData';
import { useUser } from '@/hooks/useUser';
import { handleDelete } from '@/lib/utils';

interface AirlineFeesProps {
	fees: IFee[];
	airlineId: string;
}

const tableHeadTitle = ['Category', 'Description', 'Service Fee (AUD)'];

const AirlineFees: React.FC<AirlineFeesProps> = ({ fees, airlineId }) => {
	const router = useRouter();
	const [editorOpen, setEditorOpen] = useState<boolean>(false);
	const [editData, setEditData] = useState<IFee | undefined>(undefined);
	const [deleteId, setDeleteId] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [searchResultList, setSearchResultList] = useState<IFee[]>(fees);
	const { user } = useUser();
	const isAdmin = user?.role === 'service_role';

	const tableHead = isAdmin ? [...tableHeadTitle, 'Action'] : tableHeadTitle;

	useEffect(() => {
		setSearchResultList(fees);
	}, [fees]);

	const handleEdit = (item: IFee) => {
		setEditData(item);
		setEditorOpen(true);
	};

	const feeHandleDelete = (id: string) =>
		handleDelete({
			id,
			setIsDeleting,
			routerRefresh: () => router.refresh(),
			setDeleteId: () => setDeleteId(''),
			table: 'fees',
		});

	const filter = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const searchResult = filterData({
			searchValue: value,
			data: fees,
			findValues: ['description'],
		});

		setSearchResultList(searchResult);
	};

	const tableTitle = [
		<div key={0} className="flex items-center gap-2">
			<p>General Administration Fees</p>
			{isAdmin && (
				<FaPlusCircle
					data-testid="btnAddFee"
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

	const tableBody = searchResultList?.map((item) => {
		const action = (
			<div className="flex justify-around items-center">
				<FaPen
					data-testid="btnEditFee"
					className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
					onClick={() => handleEdit(item)}
				/>
				<FaTimes
					data-testid="btnDeleteFee"
					className="hover:fill-red-400 fill-red-600 hover:cursor-pointer w-4 h-4"
					onClick={() => setDeleteId(item.id)}
				/>
			</div>
		);
		return isAdmin
			? [
					item.category,
					item.description,
					formatNumber(item.service_fee, { minimumFractionDigits: 2 }),
					action,
			  ]
			: [
					item.category,
					item.description,
					formatNumber(item.service_fee, { minimumFractionDigits: 2 }),
			  ];
	});

	return (
		<>
			{isAdmin && (
				<FeeEditModal
					title={editData ? 'Edit fee' : 'Add new fee'}
					isOpen={editorOpen}
					onClose={() => setEditorOpen(false)}
					airline_id={airlineId}
					editData={editData}
					setEditData={setEditData}
				/>
			)}
			{isAdmin && (
				<AlertModal
					title="Delete Fee Record"
					isOpen={!!deleteId}
					onClose={() => setDeleteId('')}
					description="This action cannot be undone."
					onConfirm={async () => await feeHandleDelete(deleteId)}
					loading={isDeleting}
				/>
			)}
			<Table title={tableTitle} tableHead={tableHead} tableBody={tableBody} />
		</>
	);
};

export default AirlineFees;
