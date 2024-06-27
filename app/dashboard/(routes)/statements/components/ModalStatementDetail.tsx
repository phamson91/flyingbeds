import Table from '@/components/Table/Table';
import ViewModal from '@/components/modals/ViewModal';
import formatNumber from '@/lib/formatNumber';
import { IStatement, UserDetails } from '@/types/types';
import { FC, useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface IModalStatementDetailProps {
	isOpen: boolean;
	onClose: () => void;
	statement: IStatement;
	user: UserDetails;
	transactions: (string | number)[][];
}

const tableHead = ['Description', 'Amount (AUD)', 'Balance (AUD)', 'Date'];
const ModalStatementDetail: FC<IModalStatementDetailProps> = ({
	isOpen,
	onClose,
	statement,
	user,
	transactions,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	/**
	 * This function is used to export the statement to PDF
	 */
	const handleExport = () => {
		setIsLoading(true);
		const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});
		// Source HTMLElement or a string containing HTML.
		var elementHTML = document.querySelector('#export-content');

		if (elementHTML instanceof HTMLElement) {
			const elementWidth = elementHTML.offsetWidth;
			const elementHeight = elementHTML.offsetHeight;

			// Calculate the ratio of the element and the PDF frame
			const scale: number = Math.min(
				doc.internal.pageSize.getWidth() / elementWidth,
				doc.internal.pageSize.getHeight() / elementHeight
			);

			doc.html(elementHTML, {
				callback: function (doc) {
					// Save the PDF
					doc.save(
						`Statement_${statement.start_date
							.toString()
							.slice(0, 10)}_${statement.end_date.toString().slice(0, 10)}.pdf`
					);
				},
				x: 15,
				y: 15,
				width: elementWidth * parseFloat(scale.toFixed(1)), //target width in the PDF document
				windowWidth: elementWidth, //window width in CSS pixels
			});
		} else {
			toast.error('No content to export');
		}
		setIsLoading(false);
	};

	return (
		<ViewModal
			isOpen={isOpen}
			isLoading={isLoading}
			onClose={onClose}
			onConfirm={handleExport}
			textConfirm="Export PDF"
			className="max-w-4xl max-h-[90vh] overflow-y-auto"
		>
			<section id="export-content" className="px-5">
				<p className="text-lg font-normal pt-4">Statement #</p>
				<div className="my-12 flex justify-between border-y border-slate-400 h-full">
					<div className="py-8 w-1/2 border-r border-slate-400 flex flex-col justify-center gap-2">
						<div>
							<p className="text-xs">Bill to:</p>
							<p>{user.company_name}</p>
						</div>
						<div>
							<p className="text-xs">Current Balance:</p>
							<p>{`${formatNumber(user.balance, {
								minimumFractionDigits: 2,
							})} (AUD)`}</p>
						</div>
					</div>
					<div className="w-1/2 flex flex-col justify-between">
						<div className="flex-1 flex flex-col justify-center px-6">
							<p className="text-xs">Start date:</p>
							<p>{format(new Date(statement.start_date), 'dd LLL yyyy')}</p>
						</div>
						<div className="h-1px border-t border-slate-400" />
						<div className="flex-1 flex flex-col justify-center px-6">
							<p className="text-xs">End date:</p>
							<p>
								{format(
									new Date(statement.end_date.toString().slice(0, 10)),
									'dd LLL yyyy'
								)}
							</p>
						</div>
					</div>
				</div>
				<div>
					<p className="flex justify-end font-semibold">{`Max Credit: ${formatNumber(
						user.max_credit,
						{
							minimumFractionDigits: 2,
						}
					)} (AUD)`}</p>
					<Table tableHead={tableHead} tableBody={transactions} />
					<p className="flex justify-end font-semibold">{`End Balance: ${formatNumber(
						statement.ending_balance,
						{
							minimumFractionDigits: 2,
						}
					)} (AUD)`}</p>
				</div>
			</section>
		</ViewModal>
	);
};

export default ModalStatementDetail;
