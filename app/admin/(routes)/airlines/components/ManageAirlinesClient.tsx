'use client';

import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import { Button } from '@/components/ui/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import AirlinesEditModal from './AirlinesEditModal';
import { Airline } from '@/types/types';
import { FaPen, FaTimes } from 'react-icons/fa';
import AlertModal from '@/components/modals/AlertModal';
import { handleDelete } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { filterData } from '@/lib/handleData';

interface ManageAirlinesClientProps {
	tableHead: string[];
	airlines: Airline[];
}

const ManageAirlinesClient: React.FC<ManageAirlinesClientProps> = ({
	tableHead,
	airlines,
}) => {
	const router = useRouter();
	const [editorOpen, setEditorOpen] = useState(false);
	const [editData, setEditData] = useState<Airline | undefined>(undefined);
	const [deleteId, setDeleteId] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [airlineList, setAirlineList] = useState<Airline[]>(airlines);

	useEffect(() => {
		setAirlineList(airlines);
	}, [airlines]);

	const handleEdit = (item: Airline) => {
		setEditData(item);
		setEditorOpen(true);
	};

	const airlineHandleDelete = (id: string) =>
		handleDelete({
			id,
			setIsDeleting,
			routerRefresh: () => router.refresh(),
			setDeleteId: () => setDeleteId(''),
			table: 'airlines',
		});

	const tableBody = airlineList.map((airline) => {
		const action = (
			<div className="flex justify-around items-center">
				<FaPen
					data-testid="editAirline"
					className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
					onClick={() => handleEdit(airline)}
				/>
				<FaTimes
					data-testid="deleteAirline"
					className="hover:fill-red-400 fill-red-600 hover:cursor-pointer w-4 h-4"
					onClick={() => setDeleteId(airline.id)}
				/>
			</div>
		);

		return [
			airline.short_name,
			airline.name,
			airline.notes ? airline.notes : '',
			action,
		];
	});

	const filter = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const searchResult = filterData({
			searchValue: value,
			data: airlines,
			findValues: ['name', 'short_name'],
		});

		setAirlineList(searchResult);
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title="Manage Airlines" />
				<Button
					onClick={() => setEditorOpen(true)}
					type="button"
					data-testid="btnAddAirline"
				>
					<AiOutlinePlus />
				</Button>
			</div>
			<div className="bg-white p-8 rounded-t-md shadow-md">
				<div key={1} className="flex items-center gap-2 justify-end">
					<span className="text-sm font-normal">Filter:</span>
					<Input
						className="w-40 border"
						id="airline-search"
						onChange={filter}
					/>
				</div>
				<Table tableHead={tableHead} tableBody={tableBody} />
			</div>
			<AirlinesEditModal
				isOpen={editorOpen}
				onClose={() => setEditorOpen(false)}
				editData={editData}
				setEditData={setEditData}
			/>
			<AlertModal
				title="Delete Airline Record"
				isOpen={!!deleteId}
				onClose={() => setDeleteId('')}
				description="This action cannot be undone."
				onConfirm={async () => await airlineHandleDelete(deleteId)}
				loading={isDeleting}
			/>
		</>
	);
};

export default ManageAirlinesClient;
