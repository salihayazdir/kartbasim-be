import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

export default function utcOffset(dateString: string): Dayjs {
	dayjs.extend(utc);

	// const offsettedDate = dayjs.utc(dateString).utcOffset(0, false).utcOffset(3, true);
	const offsettedDate = dayjs(dateString).subtract(3, 'hour');

	return offsettedDate;
}
