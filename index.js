const axios = require('axios');
const {mySecret, headers } = require('uuseCommons');
const {updateMenu, getAxiosTemplate, fetchAllRecords} = require('uuseCommons')
const {getFormatedDateParts,dateString} = require('./util.js')
const aMonthFromNow = new Date();
aMonthFromNow.setDate(aMonthFromNow.getDate() + 35);
//
// this looks for happenings and puts them in a printable form
//
utilityScrape();
async function utilityScrape(){
  var i = 1;
  const events = [];
  const services= [];
  const eventCount = {};
  const filteredEvents = [];
  const duplicateEvents = [];

  const allEvents = await fetchEvents()  // events
  allEvents.dataItems.sort((a, b) => a.data.date.localeCompare(b.data.date));

  allEvents.dataItems.forEach((post) => {
    let postDate = post.data.date;
    if ((new Date(postDate)) > aMonthFromNow) return;

    const title = post.data.title.trim().replace(/[.,!?;:-]+$/, "").trim();
    const desc = post.data.longdescription;
    // console.log(post.data)
    // process.exit(0)

    if (post.data.isService)
      services.push({postDate, title,desc});
    else{
      events.push({postDate, title, desc });
      eventCount[title] = (eventCount[title] || 0) + 1;
    }
  })

  events.forEach(event => {
    const title = event.title;
    
    if (eventCount[title] >= 4) {
      if (!duplicateEvents.some(e => e.title === title)) {
        duplicateEvents.push(event);  // Add one to duplicates if not already added
      }
    } else {
      filteredEvents.push(event);
    }
  });

// Output

  filteredEvents.sort(function(a, b) {
    //console.log(a);
      return a.postDate.localeCompare(b.postDate);
  });

  filteredEvents.forEach(x=>{
      console.log(dateString(x.postDate),x.title);
  })

const lookup = {"Mon":"Mondays",
  "Tue":"Tuesdays",
  "Wed":"Wednesdays",
  "Thu":"Thursdays",
  "Fri":"Fridays",
  "Sat":"Saturdays",
  "Sun":"Sundays"};
console.log("\n--- Repeating");
  duplicateEvents.forEach(x=>{
      console.log(lookup[getFormatedDateParts(x.postDate).day],x.title);
  })

console.log("\n--- Services");
  services.forEach(x=>{
      console.log(dateString(x.postDate),x.title,x.desc.slice(x.desc.indexOf("Coordin"),x.desc.indexOf("\n#")));
  })

console.log("\n--- Services Full Text");
  services.forEach(x=>{

      console.log(dateString(x.postDate),x.title+" -",x.desc.substring(x.desc.indexOf(":") + x.title.length +4),"\n\n");
  })
}

async function fetchEvents() {
  const options = getAxiosTemplate("Happenings");
  options.data = {...options.data,     
    query: {
      filter: {
        isExpired: {$ne: true},
        title: {
          "$exists": true
        }
      }, sort: [
      {
        fieldName: "date", //this doesn't work for some reason
        order: "desc"
      }]}}
    return axios(options).then(response => response.data);
}