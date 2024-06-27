export const debounce = (func: (...args: any[]) => void, delay: number) => {
	let timerId: NodeJS.Timeout;

	return (...args: any[]) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};
