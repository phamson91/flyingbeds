// interface FormatMonthProps {
const monthWord: { [key: string]: string } = {
	'01': 'JAN',
	'02': 'FEB',
	'03': 'MAR',
	'04': 'APR',
	'05': 'MAY',
	'06': 'JUN',
	'07': 'JUL',
	'08': 'AUG',
	'09': 'SEP',
	'10': 'OCT',
	'11': 'NOV',
	'12': 'DEC',
};

// change month from number xx to word xxx
export const formatMonth = (monthNumber: string) => {
	return monthWord[monthNumber];
};
