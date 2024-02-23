export const unixTimeStamp = (timestamp: any): any => {
  // public async unixTimeStamp(timestamp: any): Promise<any> {
  try {
    // const timestamp = 1458601200000; // Unix timestamp in milliseconds
    const selectedDate = new Date(timestamp);
    // const currentDate = new Date();

    // selectedDate.setHours(currentDate.getHours());
    // selectedDate.setMinutes(currentDate.getMinutes());
    // selectedDate.setSeconds(currentDate.getSeconds());

    // const dateWithTimeStamp: any = moment(selectedDate);
    // const date = new Date(dateWithTimeStamp);

    // Get the components of the date (year, month, day, etc.)
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // Months are zero-based, so add 1
    const day = selectedDate.getDate();
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const seconds = selectedDate.getSeconds();

    // Create a formatted date string
    const formattedDate = `${year}-${pad(month)}-${pad(
      day
    )} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return formattedDate;
  } catch (error) {
    console.log(error);
  }
}

// Function to pad single-digit numbers with a leading zero
const pad = (num: number): string => {
  return (num < 10 ? "0" : "") + num;
}
