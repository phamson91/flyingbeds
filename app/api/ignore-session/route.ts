import { NextResponse } from 'next/server';
import ignoreMultiAvailability from '@/lib/api/ignoreMultiAvailability';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		console.log("body", body)
		const {
			resultBody: { PNR_Reply },
		} = await ignoreMultiAvailability(body);

		return NextResponse.json({
			data: PNR_Reply[0],
		});
	} catch (error: any) {
		console.log("ee", error.message)
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
