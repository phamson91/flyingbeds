'use client';

import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import { Button } from '@/components/ui/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import LocationEditModal from './LocationEditModal';
import { ILocation } from '@/types/types';
import { FaPen, FaTimes } from 'react-icons/fa';
import AlertModal from '@/components/modals/AlertModal';
import { handleDelete } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { filterData } from '@/lib/handleData';

interface ManageLocationsClientProps {
	tableHead: string[];
	locations: ILocation[];
}

const ManageLocationsClient: React.FC<ManageLocationsClientProps> = ({
	tableHead,
	locations,
}) => {
	const router = useRouter();
	const [editorOpen, setEditorOpen] = useState(false);
	const [editData, setEditData] = useState<ILocation | undefined>(undefined);
	const [deleteId, setDeleteId] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [locationList, setLocationList] = useState<ILocation[]>(locations);

	useEffect(() => {
		setLocationList(locations);
	}, [locations]);

	const handleEdit = (item: ILocation) => {
		setEditData(item);
		setEditorOpen(true);
	};

	const airlineHandleDelete = (id: string) =>
		handleDelete({
			id,
			setIsDeleting,
			routerRefresh: () => router.refresh(),
			setDeleteId: () => setDeleteId(''),
			table: 'locations',
		});

	const tableBody = locationList.map((location) => {
		const action = (
			<div className="flex justify-start gap-8 items-center">
				<FaPen
					data-testid="editAirline"
					className="hover:text-sky-500 text-sky-600 hover:cursor-pointer w-4 h-4"
					onClick={() => handleEdit(location)}
				/>
				<FaTimes
					data-testid="deleteAirline"
					className="hover:fill-red-400 fill-red-600 hover:cursor-pointer w-4 h-4"
					onClick={() => setDeleteId(location.id)}
				/>
			</div>
		);

		return [
			location.code,
			location.name,
			location.region,
			action,
		];
	});

	const filter = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const searchResult = filterData({
			searchValue: value,
			data: locations,
			findValues: ['code', 'name', 'region'],
		});

		setLocationList(searchResult);
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title="Manage locations" />
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
			<LocationEditModal
				isOpen={editorOpen}
				onClose={() => setEditorOpen(false)}
				editData={editData}
				setEditData={setEditData}
			/>
			<AlertModal
				title="Delete Location Record"
				isOpen={!!deleteId}
				onClose={() => setDeleteId('')}
				description="This action cannot be undone."
				onConfirm={async () => await airlineHandleDelete(deleteId)}
				loading={isDeleting}
			/>
		</>
	);
};

export default ManageLocationsClient;