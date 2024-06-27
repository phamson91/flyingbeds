import { NextResponse } from 'next/server';
import pnrAddMultiElements from '@/lib/api/pnrAddMultiElements';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const {
			resultBody: { PNR_Reply },
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		} = await pnrAddMultiElements(body);

		const errorApi = PNR_Reply[0]?.generalErrorInfo ?? null;
		// if (!errorApi) {
		// 	console.log("error", errorApi)
		// 	throw new Error("Error Api");
		// }
		const pnrData = PNR_Reply[0].pnrHeader[0].reservationInfo[0].reservation[0];

		return NextResponse.json({
			pnr: PNR_Reply[0].pnrHeader[0].reservationInfo[0].reservation[0],
			data: PNR_Reply[0],
			newSessionId,
			newSequenceNumber,
			newSecurityToken,
		});
	} catch (error: any) {
		console.log('ee', error.message);
		return new NextResponse(
			JSON.stringify({
				error: error.message,
			}),
			{
				status: 500,
			}
		);
	}
}
