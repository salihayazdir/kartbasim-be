import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default function utcOffset(dateString: string): string | undefined {
	dayjs.extend(utc);

	const offsettedDate = dayjs(dateString).utcOffset(0, false).utcOffset(3, true).format();

	if (dayjs(dateString).isValid()) return offsettedDate;
	return undefined;
}
