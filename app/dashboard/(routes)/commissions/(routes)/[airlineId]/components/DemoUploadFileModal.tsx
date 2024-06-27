import Modal from '@/components/Modal';
import Table from '@/components/Table/Table';
import EditModal from '@/components/modals/EditModal';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ITicketPrice } from '@/types/airline';
import { FC } from 'react';

interface Props {
	isSubmitData: boolean;
	fileData: any;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

const tableHeadTitle = [
	'Class of Service',
	'Type',
	'Price OW (AUD)',
	'Price RT (AUD)',
	'Condition',
];
const DemoUploadFileModal: FC<Props> = ({
	isSubmitData,
	isOpen,
	onClose,
	onSubmit,
	fileData,
}) => {
	const generateTableBody = (fileData: ITicketPrice[]) => {
		return fileData?.map((item: any) => {
			return [
				item.class,
				item.type,
				item.priceOW,
				item.priceRT,
				item.condition,
			];
		});
	};

	const renderAccordionItems = () => {
		if (!fileData) {
			return null;
		}

		return Object.keys(fileData).map((key: any, index: number) => {
			// const itemValue = key.split('_');
			const itemValue = key.split(/[-\/_]/);

			const tableBody = generateTableBody(fileData[key]);
			return (
				<AccordionItem value={key} key={index}>
					<div className="w-full flex [&_h3]:w-full">
						<AccordionTrigger className="pr-2 py-2 text-sm hover:no-underline gap-2 w-full">
							<p className="w-1/2 text-start">{itemValue[0]}</p>
							<p className="w-1/2 text-start">{itemValue[1]}</p>
						</AccordionTrigger>
					</div>
					<AccordionContent className="px-6">
						<Table tableHead={tableHeadTitle} tableBody={tableBody} />
					</AccordionContent>
				</AccordionItem>
			);
		});
	};

	return (
		<Modal
			title="Upload File"
			isLoading={isSubmitData}
			open={isOpen}
			onClose={onClose}
			onSubmit={onSubmit}
		>
			<Accordion type="single" collapsible className="w-full">
				{renderAccordionItems()}
			</Accordion>
		</Modal>
	);
};

export default DemoUploadFileModal;
