import { ITicketInfo } from '@/types/booking';

interface IFilterData<T> {
	searchValue: string;
	data: T[] | null;
	findValues: string[];
}

export const filterData = <T extends Record<string, any>>({
	searchValue,
	data,
	findValues,
}: IFilterData<T>): T[] | [] => {
	const result =
		(data &&
			data.length > 0 &&
			data.filter((item) => {
				const searchedData = findValues.map((value: string) =>
					item[value].toLowerCase().includes(searchValue.toLowerCase())
				);
				return searchedData.includes(true);
			})) ||
		[];

	return result;
};

/**
 * Use for table bookings
 * Checks if all tickets in the given array have the specified status.
 */
export const checkAllSttTicketMatch = (
	ticketsInfo: ITicketInfo[],
	sttArr: string[]
): boolean => {
	const result = ticketsInfo.some(
		(item) => item.status && sttArr.includes(item.status)
	);
	return result;
};
