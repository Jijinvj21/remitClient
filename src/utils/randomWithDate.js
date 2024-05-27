export function generateRandom6Digit(date) {
    // Extract date components
    const year = date.getFullYear() % 100; // Last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Concatenate date-time string and convert it to a number
    const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const dateTimeNumber = parseInt(dateTimeString);
    
    // Use the date-time number to seed the random number generator
    const seed = dateTimeNumber % 1000000;
    const randomNumber = Math.floor(Math.random() * seed);
    
    // Ensure the random number is 6 digits
    const paddedRandomNumber = String(randomNumber).padStart(6, '0');
    
    return paddedRandomNumber;
  }