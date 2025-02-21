function getFormatedDateParts(date){
            // Input date in dd-mm-yyyy format
          var dateString = date;

          // Parse the date string
          var parts = dateString.split("-");
          var year = parseInt(parts[0], 10);
          var month = parseInt(parts[1], 10);
          var day = parseInt(parts[2], 10);

          //console.log(dateString,parts,year,month,day);

          // Create a new Date object
          var date = new Date(year, month - 1, day); // month - 1 because months are zero-indexed in JavaScript

          // Get the name of the day of the week
          var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          var dayOfWeekName = daysOfWeek[date.getDay()];

          // Get the name of the month
          var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var monthName = months[date.getMonth()];

          // Get numeric day of the month
          var numericDayOfMonth = date.getDate();
          if (numericDayOfMonth < 10) numericDayOfMonth = " "+numericDayOfMonth;

          return {day:dayOfWeekName, month:monthName, date:numericDayOfMonth}
}

function dateString(s){
    const x = getFormatedDateParts(s);
    return(x.day+" "+x.month+" "+x.date);
}

module.exports = {getFormatedDateParts,dateString}