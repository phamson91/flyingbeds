'use client';
import {
	createAirlineFlight,
	deleteAirlineById
} from '@/actions/airline_flight/client';
import Input from '@/components/Input/Input';
import AlertModal from '@/components/modals/AlertModal';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PATHS } from '@/lib/paths';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { ArrowDownToLine, FolderDown, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEllipsisV } from 'react-icons/fa';
import DemoUploadFileModal from './DemoUploadFileModal';

interface Props {
	airlineId: string;
}

const FileAction: FC<Props> = ({ airlineId }) => {
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const fileRef = useRef(null);
	const [uploadSuccessModalOpen, setUploadSuccessModalOpen] = useState(false);
	const [fileData, setFileData] = useState<any>({});
	const { supabaseClient: supabase } = useSessionContext();
	const [isSubmitRawData, setIsSubmitRawData] = useState(false);
	const router = useRouter();

	const handleDownloadTemplate = () => {
		const a = document.createElement('a');
		a.href = '/template_files/Template_Management_Price.xlsx';
		a.click();
	};

	// Upload file
	const handleUploadFile = async (event: any) => {
		try {
			const inputElement = event.target;
			if (inputElement.files && inputElement.files[0]) {
				const file = inputElement.files[0];
				const formData = new FormData();
				formData.append('file', file);

				const loadingTime = toast.loading('Processing...');

				const res = await fetch(PATHS.API_TICKET_PRICE_IMPORT_FILE, {
					method: 'POST',
					body: formData,
				});

				if (!res.ok) {
					const { error } = await res.json();
					toast.error(error);
					return;
				}

				const data = await res.json();
				setFileData(data);

				setTimeout(() => {
					toast.dismiss(loadingTime);
					setUploadSuccessModalOpen(true);
				}, 1000);
			}
			inputElement.value = '';
		} catch (error) {
			console.log('error', error);
			toast.error('Process failed!');
		}
	};

	// When user click Download data current ticket price
	const handleExportFile = async () => {
		try {
			const res = await fetch(PATHS.API_TICKET_PRICE_EXPORT_FILE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ airlineId }),
			});

			if (!res.ok) {
				const { error } = await res.json();
				toast.error(error);
				return;
			}

			const { filePath } = await res.json();
			if (filePath) {
				// Download file
				const a = document.createElement('a');
				a.href = '/template_files/TicketPrice.xlsx';
				a.click();
				// Delete file
				await fetch(PATHS.API_TICKET_PRICE_EXPORT_FILE, {
					method: 'DELETE',
				});
			}
		} catch (error) {
			console.log('error', error);
			toast.error('Process failed!');
		}
	};

	//When user click Upload Template
	const handleUploadBtn = () => {
		setOpenDropdown(false);
		setShowConfirmationDialog(true);
	};

	//When user click Upload Template
	const handleSubmitModal = () => {
		setShowConfirmationDialog(false);
		if (fileRef.current) {
			(fileRef.current as HTMLInputElement).click();
		}
	};

	const handleSubmitRawData = async () => {
		setIsSubmitRawData(true);
		try {
			// Delete all existing airline flight and ticket prices
			await deleteAirlineById(airlineId);

			const rawData = fileData.data;

			for (const key in rawData) {
				const locationSegment = key.split('_');

				const res = await createAirlineFlight(
					airlineId,
					locationSegment[0],
					locationSegment[1]
				);

				const flightId = res.id;

				const ticketPricesToInsert = rawData[key].map((item: any) => ({
					flight_id: flightId,
					class: item.class,
					type: item.type,
					priceOW: item.priceOW,
					priceRT: item.priceRT,
					condition: item.condition,
				}));

				const { error: insertTicketPriceError } = await supabase
					.from('ticket_prices')
					.insert(ticketPricesToInsert);

				if (insertTicketPriceError) {
					throw insertTicketPriceError;
				}
			}
			setIsSubmitRawData(false);
			setUploadSuccessModalOpen(false);
			toast.success('Upload successfully!');
			router.refresh();
		} catch (error) {
			console.error('Error uploading ticket prices:', error);
			toast.error('Process failed!');
		}
	};

	return (
		<div>
			<DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
				<DropdownMenuTrigger className="flex justify-end items-center gap border rounded-md py-1 px-4">
					<span>File</span>
					<FaEllipsisV className="text-sm" />
					{/* <FileCog className="hover:text-sky-500 text-sky-600 hover:cursor-pointer text-[30px]" /> */}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white">
					<DropdownMenuItem
						onClick={handleDownloadTemplate}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<ArrowDownToLine className="text-sm w-4 h-4" />
						<span>Download Template</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleUploadBtn}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<Upload className="text-sm w-4 h-4" />
						<span>Upload Template</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleExportFile}
						className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					>
						<FolderDown className="text-sm w-4 h-4" />
						<span>Download Data</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Input
				className="hidden"
				id="file"
				type="file"
				ref={fileRef}
				onChange={handleUploadFile}
			/>
			<div>
				<AlertModal
					loading={false}
					title={'Are you sure you want to upload the file?'}
					description={
						'All ticket price data will be deleted. Do you want to continue uploading files?'
					}
					isOpen={showConfirmationDialog}
					onConfirm={handleSubmitModal}
					onClose={() => setShowConfirmationDialog(false)}
				/>
			</div>
			<DemoUploadFileModal
				isSubmitData={isSubmitRawData}
				fileData={fileData.data}
				isOpen={uploadSuccessModalOpen}
				onClose={() => {
					setUploadSuccessModalOpen(false);
				}}
				onSubmit={handleSubmitRawData}
			/>
		</div>
	);
};

export default FileAction;
