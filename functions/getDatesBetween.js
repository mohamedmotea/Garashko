import { DateTime } from 'luxon'

const getDatesBetween = () =>{
  const dates = [];
  const start =    DateTime.now().minus({ days: 6 }).startOf('day');

  const end =   DateTime.now();

  let currentDate = start;
  while (currentDate <= end) {
    dates.push(currentDate.toISO());
    currentDate = currentDate.plus({ days: 1 });
  }
  return dates;
}
export default getDatesBetween