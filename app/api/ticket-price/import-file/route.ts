import { getLocations } from '@/actions/locations/server';
import { IAttachmentsFile } from '@/types/booking';
import { ILocation } from '@/types/types';
import { FILE_PATH_TEMPLATE } from '@/utils/constant';
import fs, { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as XLSX from 'xlsx';

const checkFileExist = async (filePath: string) => {
	try {
		await fs.readdir(filePath);
	} catch (error) {
		await fs.mkdir(filePath);
	}
};

/**
 * Saves an array of files to the filesystem and returns an array of file paths and names.
 */
const saveFile = async (rloc: string, files: File[]) => {
	const filePaths: IAttachmentsFile[] = [];

	// Loop through each file
	for (const file of files) {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		//Get the file extension
		const fileExt = path.extname(file.name);
		//Get the file name
		const fileName = path.basename(file.name, fileExt);
		const newName = `${rloc}_${fileName}-${Date.now()}${fileExt}`;

		// With the file data in the buffer, you can do whatever you want with it.
		// For this, we'll just write it to the filesystem in a new location
		const filePath = path.join(FILE_PATH_TEMPLATE, newName);

		// Write the file to the filesystem
		await writeFile(filePath, buffer);
		filePaths.push({ path: filePath, filename: file.name });
	}

	return filePaths;
};

export async function POST(request: NextRequest) {
	try {
		const data = await request.formData();
		const file: File = data.get('file') as File;
		const bytes = await file.arrayBuffer();
		const workbook = XLSX.read(bytes);

		const locations = await getLocations();
		const resultData: any = {};

		for (const sheetName of workbook.SheetNames) {
			if (!isSheetNameInDb(sheetName, locations)) {
				throw Error(
					'Invalid sheet name or locations not found in the database.'
				);
			}

			const worksheet = workbook.Sheets[sheetName];
			const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
			// Check class of service exists
			if (checkClassServiceExists(rawData)) {
				throw Error('Class of service duplication found in the file.');
			}
			// Format data flight
			const formatData = formatRawData(rawData);
			// Check formatData length > 0
			if (formatData.length === 0) {
				throw Error('No data found or unexpected formatting result.');
			}

			resultData[sheetName] = formatData;
		}
		// const buffer = Buffer.from(bytes);

		// Save file to folder and return filePaths
		const attachmentsFile = '';

		return NextResponse.json({ success: true, data: resultData });
	} catch (error: any) {
		return NextResponse.json({ success: false, error: error.message });
	}
}

const isSheetNameInDb = (sheetName: any, locations: ILocation[]): boolean => {
	// const sheetValue = sheetName.split('_');
	const sheetValue = sheetName.split(/[-\/_]/);

	const departureExists = locations.some(
		(location) => location.code === sheetValue[0]
	);
	const arrivalExists = locations.some(
		(location) => location.code === sheetValue[1]
	);

	return departureExists && arrivalExists;
};

const formatRawData = (rawData: any[]): any[] => {
	const headers = rawData[0];

	const formattedData = [];

	for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
		const row = rawData[rowIndex];
		const formattedRow: any = {};

		for (let headerIndex = 0; headerIndex < row.length; headerIndex++) {
			const header = headers[headerIndex];
			if (header !== 'Departure Point' && header !== 'Arrival Point') {
				formattedRow[header] = row[headerIndex];
			}
		}

		formattedData.push(formattedRow);
	}

	const keyMapping: any = {
		Type: 'type',
		'Class of Service': 'class',
		'Price OW (AUD)': 'priceOW',
		'Price RT (AUD)': 'priceRT',
		Condition: 'condition',
	};
	const updatedFormatData = formattedData.map((item) => {
		const updatedItem: any = {};
		for (const key in item) {
			if (Object.prototype.hasOwnProperty.call(item, key)) {
				updatedItem[keyMapping[key]] = item[key];
			}
		}
		return updatedItem;
	});

	return updatedFormatData;
};

// Check class of service duplication
const checkClassServiceExists = (rawData: any) => {
	const seenValues: any = {};

	rawData.forEach((row: any) => {
		const classOfService = row[3]; // Position Class of Service in Excel
		if (seenValues[classOfService]) {
			seenValues[classOfService]++;
		} else {
			seenValues[classOfService] = 1;
		}
	});

	// Find values duplicates
	const duplicates = Object.entries(seenValues).filter(
		([value, count]: any) => count > 1
	);

	if (duplicates.length > 0) return true;
	return false;
};
