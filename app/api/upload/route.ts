import { FILE_PATH_TEMPLATE } from '@/utils/constant';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { IAttachmentsFile } from '@/types/booking';

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
	const data = await request.formData();
	const rloc = data.get('rloc') as string;
	const files: File[] | null = data.getAll('files') as unknown as File[];

	// Check if there are files not exists or empty files
	if (!files || files.length === 0) {
		return NextResponse.json({ success: false });
	}
	//Check folder exist
	await checkFileExist(FILE_PATH_TEMPLATE);

	//Save file to folder and return filePaths
	const attachmentsFile = await saveFile(rloc, files);

	return NextResponse.json({ success: true, data: attachmentsFile });
}
