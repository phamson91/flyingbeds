'use client';
import { createContext, useContext, useState } from 'react';
import { PATHS } from '@/lib/paths';
import { toast } from 'react-hot-toast';
import { Pnr, SectorInfo } from '@/types/types';

interface VoidTicketContextType {
	ticketInfo: Pnr | null;
	sectorInfos: SectorInfo[] | null;
	getPnrData: (rloc: string) => Promise<PnrRes>;
	ticketSession: ISessionInfo | null;
}

interface PnrRes {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
	airlineCode: string;
}

const PnrContext = createContext<VoidTicketContextType | undefined>(undefined);

interface Props {
	[propName: string]: any;
}

interface ISessionInfo {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
}

export const VoidTicketContextProvider = (props: Props) => {
	const [isPnrLoading, setIsPnrLoading] = useState(false);
	const [ticketSession, setTicketSession] = useState<ISessionInfo | null>(null);
	const [ticketInfo, setTicketInfo] = useState<Pnr | null>(null);
	const [sectorInfos, setSectorInfos] = useState<SectorInfo[] | null>(null);

	const getPnrData = async (rloc: string): Promise<PnrRes> => {
		setIsPnrLoading(true);

		const res = await fetch(`${PATHS.API_PNR_RETRIEVE}/${rloc}`);

		if (!res.ok) {
			const { error } = await res.json();
			toast.error(error);
			setIsPnrLoading(false);
			console.log('error void', error);
			return {
				sessionId: '',
				sequenceNumber: '',
				securityToken: '',
				airlineCode: '',
			};
		}
		const result = await res.json();

		const { newSessionId, newSequenceNumber, newSecurityToken } = result;

		if (!newSessionId || !newSequenceNumber || !newSecurityToken) {
			toast.error('Invalid response from API');
			setIsPnrLoading(false);
			return {
				sessionId: '',
				sequenceNumber: '',
				securityToken: '',
				airlineCode: '',
			};
		}

		setTicketSession({
			sessionId: newSessionId,
			sequenceNumber: newSequenceNumber,
			securityToken: newSecurityToken,
		});
		// save sector info to show on confirm screen
		setSectorInfos(result.sectorInfos);
		setTicketInfo({ ...result });

		setIsPnrLoading(false);
		return {
			sessionId: newSessionId,
			sequenceNumber: newSequenceNumber,
			securityToken: newSecurityToken,
			airlineCode: result.sectorInfos[0].airline,
		}
	};

	const value = {
		ticketInfo,
		sectorInfos,
		getPnrData,
		ticketSession,
	};

	return <PnrContext.Provider value={value} {...props} />;
};

export const useVoidTicket = () => {
	const context = useContext(PnrContext);
	if (context === undefined) {
		throw new Error('VoidTicket must be used within a PnrContext');
	}
	return context;
};
