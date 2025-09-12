
export const DEFAULT_COLORS = {
    primary:'#FF0000',
    // secondary: '#141617',
    secondary:'#1f2021',
    info:'#E0E0EF',
    light_green: '#28DD4F'
}


export function getGreeting() {
    const now = new Date();
    const hour = now.getHours(); // Get the current hour (0-23)
  
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
}
export function getFormattedDay() {
    const now = new Date();
  
    // Array of day names
    const days = ["January","February","March", "April","May","June","July","August","September","October","November","December"];
  
    // Get the day of the week and the date
    const dayName = days[now.getMonth()];
    const year = now.getFullYear()
    const date = now.getDate();
  
    // Determine the ordinal suffix (st, nd, rd, th)
    const suffix = (date: number) => {
        if (date > 3 && date < 21) return "th"; // 4th to 20th always use "th"
        switch (date % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };
  
    // Format and return the result
    return ` ${date}${suffix(date)}, ${dayName} ${year} `;
}
