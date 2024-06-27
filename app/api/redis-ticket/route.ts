import redis from '@/lib/redis';
import { REDIS_BOOKING_STORAGE_PREFIX } from '@/utils/constant';
import { NextRequest, NextResponse } from 'next/server';

interface ISavePNRParams {
	id: string;
	rloc: string;
	paymentDate: Date;
	expireDate: Date;
}

export async function POST(req: NextRequest) {
	const { id, rloc, paymentDate, expireDate }: ISavePNRParams =
		await req.json();

	if (!id || !rloc || !paymentDate) {
		return new NextResponse(JSON.stringify({ message: 'Params invalid' }), {
			status: 400,
			statusText: 'Params invalid',
		});
	}

	try {
		const pnrData = JSON.stringify({ rloc, paymentDate, expireDate });

		// Generate key
		const pnrKey = `${REDIS_BOOKING_STORAGE_PREFIX}:${id}:${rloc}`;

		// Save to Redis
		const resultPnr = await redis.setex(pnrKey, 60 * 60 * 24, pnrData);

		if (!resultPnr) {
			return new NextResponse(JSON.stringify({ message: 'Failed' }), {
				status: 400,
				statusText: 'Failed',
			});
		}

		return new NextResponse(JSON.stringify({ message: 'Success' }), {
			status: 200,
		});
	} catch (error: any) {
		console.log('error:', error);
		return new NextResponse(JSON.stringify({ message: error.message }), {
			status: 400,
			statusText: error.message,
		});
	}
}
