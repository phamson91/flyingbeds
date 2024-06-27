import Heading from '@/components/Heading';
import Table from '@/components/Table/Table';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/hooks/useBooking';
import formatNumber from '@/lib/formatNumber';
import PriceChoice from './PriceChoice';
import { useEffect, useState } from 'react';
import { ITotalFare } from '@/types/booking';

const PriceSummary = () => {
	const {
		priceSummary,
		bookingInfo,
		issueTicket,
		ticketIssued,
		isTicketIssuing,
		sectorInfos,
	} = useBooking();

	const [priceChoice, setPriceChoice] = useState<ITotalFare | null>(
		priceSummary?.totalFare[0] ?? null
	);
	const [tableParams, setTableParams] = useState<{
		tableBody: (string | number | JSX.Element)[][];
		tableFoot: string[];
	}>({
		tableBody: [],
		tableFoot: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const buttonState = ticketIssued || isTicketIssuing ? true : false;

	const tableHead = [
		'Pax Name',
		'Base Fare (AUD)',
		'Taxes (AUD)',
		'Total Gross * (AUD)',
		'Agent Comm (AUD)',
		'Agent Net * (AUD)',
	];

	useEffect(() => {
		if (priceSummary && bookingInfo && priceChoice) {
			const priceKey = priceChoice.fareBasicCode;
			const tableBody = bookingInfo.travellerInfos.map((travellerInfo) => {
				// check paxType  and discTktDesignator
				// return fare data
				const fareInfo = priceSummary.faresInfo[priceKey].faresDetail.find(
					(fareInfo) =>
						travellerInfo.paxType.includes(fareInfo.discTktDesignator)
				);
				const { grossFare, taxes, agentComm, agentNet, totalGross } = fareInfo!;
				return [
					travellerInfo.paxName,
					formatNumber(grossFare),
					formatNumber(taxes),
					formatNumber(totalGross),
					formatNumber(agentComm),
					formatNumber(agentNet),
				];
			});

			const tableFoot = [
				'Total',
				formatNumber(priceChoice.totalGrossFare),
				formatNumber(priceChoice.totalTaxes),
				formatNumber(priceChoice.totalTotalGross),
				formatNumber(priceChoice.totalAgentComm),
				formatNumber(priceChoice.totalAgentNet),
			];
			setTableParams({ tableBody, tableFoot });
			return setIsLoading(false);
		}
	}, [priceChoice, priceSummary, bookingInfo]);

	return priceSummary && bookingInfo ? (
		<div className="bg-white p-8 !pt-2 rounded-b-md">
			<div className="text-xl">
				<Heading title="Price Summary" />
			</div>
			<PriceChoice
				data={priceSummary.totalFare}
				priceChoice={priceChoice}
				setPriceChoice={setPriceChoice}
			/>
			<Table
				tableHead={tableHead}
				tableBody={tableParams.tableBody}
				tableFoot={tableParams.tableFoot}
				isLoading={isLoading}
			/>
			<div className="text-xs text-right font-light">* Including Taxes</div>
			<div className="text-sm font-light">
				Plated on {sectorInfos![0].airline}
				<br />
				Note: Your commission rate on fare is {priceSummary.commRate}
				<br />
				If this commission rate is incorrect, please contact your ticketing
				office before issuing this ticket.
			</div>
			<div className="flex justify-end">
				<Button
					type="button"
					onClick={() => issueTicket(priceChoice?.fareBasicCode ?? '')}
					disabled={buttonState}
				>
					Issue Ticket
				</Button>
			</div>
		</div>
	) : (
		<div className="bg-white p-8 pt-2 rounded-b-md">
			Not found price summary
		</div>
	);
};

export default PriceSummary;
