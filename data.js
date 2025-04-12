// Data js used to see and test API data
// Fetch data from Tech for Palestine's Gaza casualties API
fetch('https://data.techforpalestine.org/api/v2/killed-in-gaza.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Get today's date in the same format as the API (YYYY-MM-DD)
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    // Find today's data (or most recent if today's isn't available)
    let latestData = data[data.length - 1];
    
    // Check if there's data for today specifically
    const todayData = data.find(entry => entry.date === todayFormatted);
    if (todayData) {
      latestData = todayData;
    }
    
    // Extract the information we want
    const result = {
      date: latestData.date,
      total_killed: latestData.killed.total,
      total_injured: latestData.injured.total,
      children_killed: latestData.killed.children,
      women_killed: latestData.killed.women,
      journalists_killed: latestData.killed.medical,
      children_injured: latestData.injured.children,
      women_injured: latestData.injured.women,
      // Additional information available in the API
      medical_killed: latestData.killed.medical,
      elderly_killed: latestData.killed.elderly,
      // Source information
      source: latestData.source,
      last_updated: latestData.last_updated
    };
    
    console.log("Latest Gaza Casualty Report (" + result.date + "):");
    console.log("----------------------------------");
    console.log("Total Killed:", result.total_killed);
    console.log("Total Injured:", result.total_injured);
    console.log("\nBreakdown of Killed:");
    console.log("Children:", result.children_killed);
    console.log("Women:", result.women_killed);
    console.log("Journalists:", result.journalists_killed);
    console.log("Medical Personnel:", result.medical_killed);
    console.log("Elderly:", result.elderly_killed);
    console.log("\nBreakdown of Injured:");
    console.log("Children:", result.children_injured);
    console.log("Women:", result.women_injured);
    console.log("\nSource:", result.source);
    console.log("Last Updated:", result.last_updated);
    
    // You can use this data in your application as needed
    // For example, display it on a webpage or process it further
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });