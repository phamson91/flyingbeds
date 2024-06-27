import { format } from 'date-fns';

const dateUtils = {
	getDateByTimezone: function (timeZone: string = 'Australia/Sydney'): Date {
		const date = new Date().toLocaleString('en-US', {
			timeZone,
		});

		return new Date(date);
	},
	// Formats a date or string to a string with the format "dd LLL yyyy"
	formatDate: function (date: Date | string): string {
		if (typeof date === 'string') {
			const dateInUTC = new Date(date);
			return format(dateInUTC, 'dd LLL yyyy');
		}
		return format(date, 'dd LLL yyyy');
	},
	// Formats a date or string to a string with the format "HH:mm:ss - dd LLL yyyy".
	formatDateTime: function (date: Date | string): string {
		if (typeof date === 'string') {
			const dateInUTC = new Date(date);
			return format(dateInUTC, 'HH:mm:ss - dd LLL yyyy');
		}
		return format(date, 'HH:mm:ss - dd LLL yyyy');
	},

	// format the date or string from 'ddLLyy' to 'LL-dd-yyyy'.
	convertDate: function (date: Date | string): string {
		if (typeof date === 'string') {
			const day = date.substring(0, 2);
			const month = date.substring(2, 4);
			const year = '20' + date.substring(4, 6);
			return `${month}-${day}-${year}`;
		}
		return format(date, 'LL-dd-yyyy');
	},
};

export default dateUtils;
