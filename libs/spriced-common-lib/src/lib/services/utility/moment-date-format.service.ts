import * as moment from "moment";

export const unixTimeStamp = (timestamp: any): any => {
  // public async unixTimeStamp(timestamp: any): Promise<any> {
  try {
    // const timestamp = 1458601200000; // Unix timestamp in milliseconds
    const selectedDate = new Date(timestamp);
    const currentDate = new Date();

    selectedDate.setHours(currentDate.getHours());
    selectedDate.setMinutes(currentDate.getMinutes());
    selectedDate.setSeconds(currentDate.getSeconds());

    const dateWithTimeStamp: any = moment(selectedDate);
    const date = new Date(dateWithTimeStamp);

    // Create a formatted date string
    // const formattedDate = `${year}-${pad(month)}-${pad(
    //   day
    // )} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const formattedDate = date.toISOString();
    return formattedDate;
  } catch (error) {
    console.log(error);
  }
}

// Function to pad single-digit numbers with a leading zero
const pad = (num: number): string => {
  return (num < 10 ? "0" : "") + num;
}
