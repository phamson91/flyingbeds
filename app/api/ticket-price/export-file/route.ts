import { getAirlineFlightById } from '@/actions/airlines/server';
import { FILE_NAME_TICKET_PRICE, FILE_PATH_TEMPLATE } from '@/utils/constant';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as XLSX from 'xlsx';
// import

const checkFileExist = async (filePath: string) => {
	try {
		await fs.readdir(filePath);
	} catch (error) {
		await fs.mkdir(filePath);
	}
};

export async function POST(request: NextRequest) {
	try {
		const { airlineId } = await request.json();

		// Get all flight information from airline
		const { airline_flights_info: airlineFlights }: any =
			await getAirlineFlightById(airlineId);

		if (airlineFlights.length === 0) {
			throw Error('Airline flight not found!');
		}

		const filePath = path.join(FILE_PATH_TEMPLATE, FILE_NAME_TICKET_PRICE);

		// Create a new Workbook
		const workbook = XLSX.utils.book_new();

		// Loop through airlineFlights
		for (const flight of airlineFlights) {
			const { arrival, departure, ticket_prices } = flight;
			const sheetName = `${departure}_${arrival}`;

			// If Ticket price isn't exists, Ignore the current value and next
			if (ticket_prices.length === 0) {
				continue;
			}
			//Format data export
			const dataExport = ticket_prices.map((ticket: any) => ({
				departure,
				arrival,
				type: ticket.type,
				classOfService: ticket.class,
				priceOW: ticket.priceOW,
				priceRT: ticket.priceRT,
				condition: ticket.condition,
			}));
			const worksheet = XLSX.utils.json_to_sheet(dataExport);
			XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
			/* fix headers */
			XLSX.utils.sheet_add_aoa(
				worksheet,
				[
					[
						'Departure Point',
						'Arrival Point',
						'Type',
						'Class of Service',
						'Price OW (AUD)',
						'Price RT (AUD)',
						'Condition',
					],
				],
				{ origin: 'A1' }
			);
		}

		//Check folder exist
		await checkFileExist(FILE_PATH_TEMPLATE);
		// XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
		XLSX.writeFile(workbook, filePath, { compression: true });

		return NextResponse.json({ success: true, filePath });
	} catch (error: any) {
		console.log('error', error);
		return NextResponse.json({ success: false, error: error.message });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const filePath = path.join(FILE_PATH_TEMPLATE, FILE_NAME_TICKET_PRICE);
		// Check if file exists
		await fs.stat(filePath);
		// Remove file
		await fs.unlink(filePath);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ success: false, error: error.message });
	}
}
