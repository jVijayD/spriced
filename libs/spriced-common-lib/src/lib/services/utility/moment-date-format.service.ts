
export const unixTimeStamp = (timestamp: any): any => {
  // public async unixTimeStamp(timestamp: any): Promise<any> {
  try {
    // const timestamp = 1458601200000; // Unix timestamp in milliseconds
    const date = new Date(timestamp);

    // Get the components of the date (year, month, day, etc.)
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Create a formatted date string
    const formattedDate = `${year}-${pad(month)}-${pad(
      day
    )} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    console.log(formattedDate, ">>");
    return formattedDate;
  } catch (error) {
    console.log(error);
  }
}

// Function to pad single-digit numbers with a leading zero
export const pad = (num: number): string => {
  return (num < 10 ? "0" : "") + num;
}
