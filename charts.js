function LineChart(
  givenId,
  givenData,
  title = "Killed",
  chartType = "line",
  visualType = "continuous",
  modCompare = false,
) {
  // Data
  const data = givenData;
  const chartStyle = chartType;
  const vType = visualType;

  const dateList = data.map(function (item) {
    return item[0];
  });

  const valueList = data.map(function (item) {
    return item[1];
  });

  option = {
    tooltip: {
      trigger: "axis",
      backgorundColor: "red",
      formatter: function (params) {
        let item = params[0];
        return `
                ${item.axisValue}<br/>
                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:red;"></span>
                ${title}: ${item.data}
                `;
      },
    },

    visualMap: {
      show: false,
      type: vType,
      seriesIndex: 0,
      min: 0,
      max: 400,
    },

    xAxis: {
      show: false,
      data: dateList,
    },

    yAxis: {
      show: false,
      ...(modCompare
        ? {
            min: valueList[0],
            max: valueList[valueList.length - 1],
          }
        : {}),
    },

    series: [
      {
        type: chartStyle,
        showSymbol: false,
        data: valueList,
        smooth: true,
        emphasis: {
          itemStyle: {
            color: "#188df0",
            shadowColor: "#0059ff",
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderColor: "#188df0",
            borderWidth: 2,
            z: 10,
            zlevel: 1,
          },
        },
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#188df0" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
          shadowColor: "rgb(0, 89, 255, .4)", // Shadow color
          shadowBlur: 8, // Shadow blur radius
          shadowOffsetX: 0, // Horizontal shadow offset
          shadowOffsetY: 4, // Vertical shadow offset
        },
        label: { show: false },
      },
    ],
  };

  var myChart = echarts.init(document.getElementById(givenId));
  window.addEventListener('resize', function(){
    myChart.resize()
  })
  myChart.setOption(option);
}

let currentYers = new Date().toISOString().split("T")[0].split("-")[0];
let thisYers = new Date().toISOString().split("T")[0].split("-")[0];
let today = new Date().toISOString().split("T")[0];
let thisWeak = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0];
let thisMonth = new Date().toISOString().slice(0, 7) + "-00";

async function Query(url, method = "GET", body = null) {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: {},
    };

    // If it's a POST/PUT/etc., include headers and body
    if (options.method !== "GET" && body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function createTexturedPieChart(chartId, data, days = 'Faild to Load') {
  const piePatternSrc = './assets/icons/pattern10.jpg';
  const bgPatternSrc ='./assets/icons/bg2.png';
  const piePatternImg = new Image();
  piePatternImg.src = piePatternSrc;
  const bgPatternImg = new Image();
  bgPatternImg.src = bgPatternSrc;

  const option = {
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    title: {
      text: 'Killed by terrorists in Gaza over '+days+" days",
      textStyle: {
        color: 'black'
      }
    },
    tooltip: {},
    series: [
      {
        name: 'Killed by terrorist',
        type: 'pie',
        selectedMode: 'single',
        selectedOffset: 30,
        clockwise: true,
        label: {
          fontSize: 18,
          color: 'red'
        },
        labelLine: {
          lineStyle: {
            color: 'red'
          }
        },
        data: data, // Use the provided data
        itemStyle: {
          opacity: 1,
          color: {
            image: piePatternImg,
            repeat: 'repeat'
          },
          borderWidth: 3,
          borderColor: 'white'
        }
      }
    ]
  };

  const chartDom = document.getElementById(chartId);
  const myChart = echarts.init(chartDom);
  window.addEventListener('resize', function(){
    myChart.resize()
  })
  myChart.setOption(option);
}


function createToggleChart(containerId, geoJsonUrl, chartData, mapName, options = {}, min = 0, max = 1) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
      console.error(`Container with ID ${containerId} not found`);
      return;
  }
  
  const myChart = echarts.init(chartContainer);
  window.addEventListener('resize', function(){
    myChart.resize()
  })
  myChart.showLoading();
  
  // Set default options
  const defaultOptions = {
      toggleInterval: 3000,  // Toggle interval in milliseconds
      mapMinValue: min ,
      mapMaxValue: max,
      enableToggle: true,
      mapTitle: `${mapName} Killed Map`,
      barTitle: `${mapName} Killed by Region`
  };
  
  // Merge default options with user options
  const chartOptions = {...defaultOptions, ...options};
  
  // Use fetch API instead of jQuery
  fetch(geoJsonUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(geoJson => {
          myChart.hideLoading();
          
          // Register the map with optional layout adjustments
          echarts.registerMap(mapName, geoJson, options.mapLayoutAdjustments || {});
          
          // Sort data from low to high value for bar chart
          const sortedData = [...chartData].sort(function(a, b) {
              return a.value - b.value;
          });
          
          // Map option configuration
          const mapOption = {
              title: {
                  text: chartOptions.mapTitle,
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c}'
              },
              visualMap: {
                  left: 'right',
                  min: chartOptions.mapMinValue,
                  max: chartOptions.mapMaxValue,
                  inRange: {
                      color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
                  },
                  text: ['High', 'Low'],
                  calculable: true
              },
              series: [
                  {
                      id: 'kills',
                      type: 'map',
                      roam: true,
                      map: mapName,
                      animationDurationUpdate: 1000,
                      universalTransition: true,
                      data: chartData,
                      emphasis: {
                          label: {
                              show: true
                          }
                      }
                  }
              ]
          };
          
          // Bar option configuration
          const barOption = {
              title: {
                  text: chartOptions.barTitle,
                  left: 'center'
              },
              tooltip: {
                  trigger: 'axis',
                  formatter: '{b}: {c}'
              },
              xAxis: {
                  type: 'value',
                  name: 'kills'
              },
              yAxis: {
                  type: 'category',
                  data: sortedData.map(function(item) {
                      return item.name;
                  })
              },
              animationDurationUpdate: 1000,
              series: {
                  type: 'bar',
                  id: 'kills',
                  data: sortedData.map(function(item) {
                      return item.value;
                  }),
                  universalTransition: true
              }
          };
          
          // Set initial option to map view
          let currentOption = mapOption;
          myChart.setOption(mapOption);
          
          // Create toggle if enabled
          if (chartOptions.enableToggle) {
              setInterval(function() {
                  currentOption = currentOption === mapOption ? barOption : mapOption;
                  myChart.setOption(currentOption, true);
              }, chartOptions.toggleInterval);
          }
          
          // Return the chart instance for further customization
          return myChart;
      })
      .catch(error => {
          console.error(`Error loading the GeoJSON file for ${mapName}:`, error);
          myChart.hideLoading();
      });
}


function renderCandlestickChart(id, data) {
  var chartDom = document.getElementById(id);
  var myChart = echarts.init(chartDom);

  // Process the data to format it for bar chart
  const processedData = data.map(item => {
    const killed = Math.max(0, item.details?.killed || 0);
    const injured = Math.max(0, item.details?.injured || 0);
    const killed_children = Math.max(0, item.details?.killed_children || 0);
    const killed_women = Math.max(0, item.details?.killed_women || 0);
    const med_killed = Math.max(0, item.details?.med_killed || 0);
    const press_killed = Math.max(0, item.details?.press_killed || 0);
    
    return {
      date: item.date,
      killed: killed,
      injured: injured,
      killed_children: killed_children,
      killed_women: killed_women,
      med_killed: med_killed,
      press_killed: press_killed,
      details: {
        killed: killed,
        injured: injured,
        killed_children: killed_children,
        killed_women: killed_women,
        med_killed: med_killed,
        press_killed: press_killed
      }
    };
  });

  const dates = processedData.map(item => item.date);

  var option = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const date = params[0].name;
        let html = `<div><div style="font-size:14px;color:#666;font-weight:400;">${date}</div>`;
        
        params.forEach(param => {
          html += `
            <div>
              <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
              <span style="font-size:14px;color:#666;font-weight:900;margin-left:2px">${param.seriesName}:</span>
              <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${param.value}</span>
              <div style="clear:both"></div>
            </div>
          `;
        });
        
        html += '</div>';
        return html;
      }
    },
    legend: {
      data: ['Killed', 'Injured', 'Children', 'Women', 'Medical', 'Press']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        interval: 'auto',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: 'Killed',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.killed)
      },
      {
        name: 'Injured',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.injured)
      },
      {
        name: 'Children',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.killed_children)
      },
      {
        name: 'Women',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.killed_women)
      },
      {
        name: 'Medical',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.med_killed)
      },
      {
        name: 'Press',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: processedData.map(item => item.press_killed)
      }
    ]
  };

  window.addEventListener('resize', function(){
    myChart.resize();
  });
  
  myChart.setOption(option);
  return myChart;
}


/**
 * Process raw API data into optimized format for visualization
 * @param {Array} apiData - Array of daily report objects from API
 * @returns {Object} - Processed data organized by dates with extracted values
 */

function processReportData(apiData) {
  // Sort data by date to ensure proper calculation of daily changes
  const sortedData = [...apiData].sort((a, b) => 
    new Date(a.report_date) - new Date(b.report_date)
  );
  
  // Initialize tracking of previous values to calculate daily changes
  let prevValues = {};
  
  // Process each report
  return sortedData.map((report, index) => {
    // Calculate daily values (not cumulative) by comparing with previous day
    const killed = index === 0 ? report.killed : report.killed_cum - prevValues.killed_cum || report.killed;
    const injured = index === 0 ? 
      (report.ext_injured || 0) : 
      (report.ext_injured_cum - prevValues.ext_injured_cum || report.ext_injured || 0);
    
    const killed_children = index === 0 ? 
      (report.killed_children_cum || 0) : 
      ((report.killed_children_cum || 0) - (prevValues.killed_children_cum || 0));
    
    const killed_women = index === 0 ? 
      (report.killed_women_cum || 0) : 
      ((report.killed_women_cum || 0) - (prevValues.killed_women_cum || 0));
    
    const med_killed = index === 0 ? 
      (report.med_killed_cum || 0) : 
      ((report.ext_med_killed_cum || 0) - (prevValues.ext_med_killed_cum || 0));
    
    const press_killed = index === 0 ? 
      (report.press_killed_cum || 0) : 
      ((report.press_killed_cum || 0) - (prevValues.press_killed_cum || 0));
    
    // Save current values for next iteration
    prevValues = {...report};
    
    // Extract year from date for grouping
    const year = report.report_date.split('-')[0];
    
    // Format data for visualization
    return {
      date: report.report_date,
      year: year,
      source: report.report_source,
      // Array of key metrics for chart visualization
      values: [
        killed, 
        injured,
        killed_children,
        killed_women,
        med_killed,
        press_killed
      ],
      // Keep detailed values for reference if needed
      details: {
        killed: killed,
        injured: injured,
        killed_children: killed_children,
        killed_women: killed_women,
        med_killed: med_killed,
        press_killed: press_killed,
        total_cum: report.killed_cum
      }
    };
  });
}

/**
 * Group processed data by year for efficient access
 * @param {Array} processedData - Data processed by processReportData
 * @returns {Object} - Data grouped by year
 */
function groupByYear(processedData) {
  const groupedData = {};
  
  processedData.forEach(item => {
    if (!groupedData[item.year]) {
      groupedData[item.year] = [];
    }
    groupedData[item.year].push(item);
  });
  
  return groupedData;
}

/**
 * Get data for candlestick chart for specific year
 * @param {Object} groupedData - Data grouped by year
 * @param {string} year - Year to extract data for
 * @returns {Array} - Formatted data for candlestick chart
 */
function getChartDataForYear(groupedData, year) {
  if (!groupedData[year]) return [];
  
  return groupedData[year].map(item => ({
    date: item.date,
    values: item.values
  }));
}

// Tracking object on change it will call fucntion
function watch(obj, callback) {
  let changes = {};
  return new Proxy(obj, {
    set(target, key, value) {
      target[key] = value;
      changes[key] = value;
      if (Object.keys(changes).length >= 2) {
        callback(changes);
        changes = {};
      }
      return true;
    }
  });
}

let globalData = {
  killed: 0,
  totalDay: 0,
  chartData: false,
  thisYersData: false,
};

function getDaysDifference(targetDate, offsetDays = 0) {
  // 1. Get current date and subtract offset
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - offsetDays);

  // 2. Parse target date
  const target = new Date(targetDate);

  // 3. Calculate difference in milliseconds, then convert to days
  const diffMs = target - currentDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

(async ()=> {
  let result = await Query("https://data.techforpalestine.org/api/v2/casualties_daily.min.json");
  if (result.error) {console.error("Error fetching data:", result.error);return;}
  const data = result.data;

  const thisWeakData = data.filter((data) => data.report_date >= thisWeak && data.report_date <= today);
  const thisMonthData = data.filter((data) => data.report_date >= thisMonth);
  const thisYersData = data.filter((person) => person.report_date.split("-")[0] === thisYers);
  const thisMonthKill = thisMonthData.map((item) => [item.report_date, item.killed]);
  const thisMonthInjured = thisMonthData.map((item) => [item.report_date, item.injured]);
  const thisMKC = data.map((item) => [ item.report_date, item.killed_cum]);
  const thisMonthHome = thisMonthData.map((item) => [item.report_date, item.home]);
  const thisWeakKill = thisWeakData.map((item) => [item.report_date, item.killed,]);
  const thisWeakInjured = thisWeakData.map((item) => item.injured);

  LineChart("kill-chart", thisMonthKill);
  LineChart("injured-chart", thisMonthInjured, "Injured");
  LineChart("cumulative", thisMKC, "Kill Cumulative", "line", null, true);

  document.addEventListener("DOMContentLoaded", () => {});

  const lastDayData = thisWeakData[thisWeakData.length - 1];
  globalData.killed = lastDayData.killed;
  globalData.totalDay = data.length;
  globalData.thisYersData = data;

  
  $("#today-kill-count").innerHTML = "Killed "+lastDayData.killed;
  $("#today-injuries-count").innerHTML = "Injured "+lastDayData.injured;
  $("#data-days-count").innerHTML = data.length;
  $("#cumul-count").innerHTML = data[data.length -1].killed_cum+"+ Kill's";
  
  renderCandlestickChart('candlestickChart', processReportData(data));
  $("#candlestickChartTitle").innerHTML = `${data[0].report_date} to ${data[data.length - 1].report_date} All Record Data`;


})();

// Infrastructure
async function infrastructure() {
  const result = await Query("https://data.techforpalestine.org/api/v3/infrastructure-damaged.json",);
  if (result.error) {
    console.error("Error fetching data:", result.error);
    return;
  }
  const data = result.data;

  const thisYersData = data.filter((item) =>
    item.report_date.startsWith(currentYers),
  );
  const thisWeakShortData = thisYersData.slice(-7);
  const thisWeakData = thisWeakShortData.map((item) => [
    item.report_date,
    item.places_of_worship,
  ]);

  const thisMonthData = data.slice(-30);

  function getDailyDestructionIncrease(data) {
    // Get the last 8 entries (to calculate 7 days of differences)
    const last8Days = data.slice(-100);
    
    // Process to get daily increases
    const result = [];
    
    for (let i = 1; i < last8Days.length; i++) {
        const prevDay = last8Days[i - 1];
        const currentDay = last8Days[i];
        
        // Get residential destroyed (fall back to ext_destroyed)
        const prevDestroyed = prevDay.residential.destroyed ?? prevDay.residential.ext_destroyed;
        const currentDestroyed = currentDay.residential.destroyed ?? currentDay.residential.ext_destroyed;
        
        // Calculate daily increase
        const increase = currentDestroyed - prevDestroyed;
        
        // Add to result in [date, value] format
        result.push([currentDay.report_date, increase]);
    }
    
    return result;
}

function orgData(data) {
  return data.map(day => {
      // Use `destroyed` if available, otherwise fall back to `ext_destroyed`
      const destructionValue = day.residential.destroyed ?? day.residential.ext_destroyed;
      return [day.report_date, destructionValue];
  });
}

// Example usage:
const rawDestructionData = orgData(data);
const checkIncreasing = getDailyDestructionIncrease(data)

  console.log("Every day distryed: ", checkIncreasing);
  console.log("This weak INF data: ", thisWeakData);
  console.log("Inf", thisYersData);
  console.log(thisWeak);
}


// Gaza kill data
async function GazaData() {
  const result = await Query("https://data.techforpalestine.org/api/v2/killed-in-gaza.json");
  if (result.error) {console.error("Error fetching data:", result.error);return;}
  const data = await result.data;

  const thisWeakData = data.filter((item) => item.report_date === true);
  const thisMonthData = data.filter((data) => data.report_date >= thisMonth);
  const thisMonthKill = thisMonthData.map((item) => [item.report_date, item.killed]);
  const thisMonthInjured = thisMonthData.map((item) => [item.report_date, item.injured]);
  const thisMonthHome = thisMonthData.map((item) => [item.report_date, item.home]);
  const thisWeakKill = thisWeakData.map((item) => [item.report_date, item.killed]);
  const thisWeakInjured = thisWeakData.map((item) => item.injured);

  const sliced = await data.slice(-globalData.killed)    

  const kids = sliced.filter(data => data.age <= 18).map(data => {
    return [data.sex === "m" ? "Male" : "Female", data.age];
  });

  const femail = sliced
  .filter(data => data.sex === "f")
  .map(data => ["Femail", data.age]);

  LineChart("kids", kids, 'age')
  LineChart("women", femail, 'age')
  $("#kids-kill-count").innerHTML = "killed "+kids.length;
  $("#women-kill-count").innerHTML = "killed "+femail.length;
}

GazaData()

async function summery() {
  const result = await Query("https://data.techforpalestine.org/api/v3/summary.json");
  if (result.error) {
    console.error("Error fetching data:", result.error);
    return;
  }
  const data = result.data;

  const chartData = [
    {value: data.gaza.killed.children, name: 'Childern'},
    {value: data.gaza.killed.women, name: 'Women'},
    {value: data.gaza.massacres, name: 'Massacres'}
  ]


  const palestineData = [
    { name: 'Gaza Strip', value: data.gaza.killed.total },
    { name: 'West Bank', value: data.west_bank.killed.total }
  ];


createTexturedPieChart("pie-chart", chartData, data.gaza.reports)
createToggleChart(
  'map-chart', 
  './assets/GeoJson/2.json', 
  palestineData, 
  'Palestine',
  {
      mapMaxValue: Math.max(palestineData[0].value, palestineData[1].value),
      toggleInterval: 4000,
      mapLayoutAdjustments: {
        'Gaza Strip': {
          left: -100,
          top: 0,
          width: 50  
      },
          'West Bank': {
              left: 5,
              top: 50,
              width: 50  
          }
      }
  },
  Math.min(palestineData[0].value, palestineData[1].value),
  Math.max(palestineData[0].value, palestineData[1].value)
);

}

summery()


// separating AI return anaylices text data
function separateReport(reportText) {
  // Initialize variables to hold different parts of the report
  let summary = [];
  let keyInsights = [];
  let visualizations = [];
  let currentSection = null;

  // Split the report into lines
  const lines = reportText.split('\n');

  // Process each line
  for (const line of lines) {
      if (line.startsWith('Based on the provided data')) {
          currentSection = 'summary';
      } else if (line.startsWith('Key insights:')) {
          currentSection = 'keyInsights';
          continue;
      } else if (line.startsWith('Visualizations that may help')) {
          currentSection = 'visualizations';
          continue;
      }

      // Skip empty lines
      if (line.trim() === '') continue;

      // Add content to appropriate section
      if (currentSection === 'summary') {
          summary.push(line.trim());
      } else if (currentSection === 'keyInsights' && line.startsWith('-')) {
          keyInsights.push(line.trim().substring(2));
      } else if (currentSection === 'visualizations' && line.startsWith('-')) {
          visualizations.push(line.trim().substring(2));
      }
  }

  // Join summary lines into a single string
  const summaryText = summary.join('\n');

  return {
      summary: summaryText,
      keyInsights: keyInsights,
      visualizations: visualizations
  };
}

// Separating json
function parseAIdata(data) {
  const long_text = data;

  // Extract the JSON content inside triple backticks
  const jsonMatch = long_text.match(/```json\s*([\s\S]*?)\s*```/);

  if (!jsonMatch) {
    throw new Error("JSON block not found in the text.");
  }

  try {
    const jsonString = jsonMatch[1].trim();
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    // Handle the error or rethrow
    throw error;
  }
  
}

// Simplified storage functions
function saveData(data, name) {
  const storageData = {
      data: data,
      date: new Date().toISOString().split('T')[0]
  };
  localStorage.setItem(name, JSON.stringify(storageData));
}

function getData(name) {
  const stored = localStorage.getItem(name);
  if (!stored) return false;
  
  const parsed = JSON.parse(stored);
  const today = new Date().toISOString().split('T')[0];
  
  return parsed.date === today ? parsed.data : false;
}


// AI anaylices data using AI` model
// SECRET API Key
const NEW_KEY = false;

// Your existing AI function
async function analyzeWithAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${NEW_KEY}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt }
          ]
      })
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.error.message);
      $("#analysis-containe").innerHTML = "AI Burn Out...";
      return;
  }

  const result = await response.json();
  const data = parseAIdata(result.choices[0].message.reasoning);
  saveData(data, 'conflict-data');
  inject(data, "analysis-container");
}


const prompt_one =
`
Transform this dataset into a concise, text-based 'dashboard' with these sections:

🔥 Hot Numbers

Daily vs. Cumulative Deaths/Injuries: Compare to averages (e.g., '49 daily deaths = 64% below 24-month avg').

Most Alarming Stat: [Highlight, e.g., '17,818 child deaths = 2x global conflict avg']

🎯 Targeted Groups Analysis

Medics/Civil Defense/Press: Total = 1,364 killed. Add context: '3% of all deaths – suggests systematic silencing.'

Women & Children: Combine stats → '30,105 total = 65% of all casualties.'

❓ Data Gaps & Next Steps

Anomalies: Flag matching fields (killed_cum vs. ext_killed_cum).

Urgent Actions: 3 bullet points (e.g., 'Audit source "mohtel" for bias verification').

Use spacing, dividers (---), and symbols (⚠️, 📊, 💡) for readability. Prioritize brevity with bolded headers.

`

const prompt_two = `
  Analyze this dataset and return a structured, text-only report with no technical terms or code. Prioritize:

Hidden patterns (e.g., ratios, outlier stats)

Contextual significance (vs. global conflict norms)

Ethical urgency (e.g., targeting of vulnerable groups)

Structure the analysis as:

🔥 Critical Metrics (TL;DR)

Use arrows (↑↓→), bold, and symbols (⚠️🚑) to highlight:

Most extreme stat: (e.g., "Children = 39% of deaths ⚠️→ 2x global avg")

Underreported anomaly: (e.g., "Identical killed_cum & ext_killed_cum → possible data bias")

📊 What Numbers Hide

Compare key ratios to real-world benchmarks:

"Injury-to-Death = 2.4:1 → Lower than modern conflicts (3:1) → Suggests lethal weapons or poor healthcare 🏥"

"1,364 medics/press killed → 3% of total vs. <1% typical → Systematically targeted ✋"

🌍 Humanitarian Narrative

Craft 3 short statements using cumulative data:

"Every 2 hours for 24 months: 1 massacre, 2 children killed, 3 women injured."

"Press deaths (202) = 4x annual global journalist killings (2023 avg: 50)."

🔍 Blind Spots to Investigate

List 2-3 data limitations JS can’t detect:

"No timestamp for massacres → Are clusters linked to political events?"

"Source ‘mohtel’ unverified → Risk of undercounting casualties."

Format with clean spacing, bold headers, and symbols for visual flow. No markdown.
Return analysis as JSON with this strict structure:
{
  "sections": [
    {
      "title": "Critical Metrics",
      "icon": "🔥",
      "items": [
        {"text": "Lowest mortality rate: 1.56 deaths/massacre", "icon": "⚠️"},
        {"text": "75% kidnapping motive → outlier pattern", "icon": "🔍"}
      ]
    },
    {
      "title": "Humanitarian Narrative",
      "icon": "🌍",
      "items": [
        {"text": "2 children killed every 2 hours", "explanation": "Exceeds UN conflict averages"}
      ]
    }
  ]
}
NO MARKDOWN. Use ONLY plain text/emojis in values.
`

const prompt_three = `
Analyze this conflict dataset and return findings in JSON format matching this exact schema:  
{  
  "report_meta": {  
    "title": "string",  
    "source": "string",  
    "period": "string",  
    "last_updated": "YYYY-MM-DD"  
  },  
  "sections": [  
    {  
      "title": "string with emoji",  
      "icon": "emoji",  
      "type": "warning|analysis|narrative",  
      "categories": [{  
        "label": "string",  
        "items": [{  
          "text": "short stat",  
          "icon": "emoji",  
          "severity": 1-10,  
          "comparison": {  
            "benchmark": "global/regional average",  
            "difference": "+/-%",  
          },  
          "implication": "1-sentence strategic impact"  
        }]  
      }],  
      "visual_blocks": [{  
        "type": "comparison|timeline",  
        "label": "string",  
        "current": "value",  
        "benchmark": "reference value",  
        "variance": "+/-%"  
      }],  
      "progress_bars": [{  
        "label": "data quality metric",  
        "score": 1-10,  
        "status": "text label"  
      }]  
    }  
  ],  
  "highlights": {  
    "most_shocking": "text",  
    "most_urgent": "text",  
    "data_quality": "score/10"  
  }  
}  

Requirements:  
1. Prioritize stats with >10% deviation from conflict norms  
2. Add severity scores (1-10) based on humanitarian impact  
3. Include 3 types of visual elements: comparison blocks, progress bars, narratives  
4. All emojis must be single Unicode characters  
5. Never use markdown - only plain text in values  

Example structure for guidance:  
"visual_blocks": [{  
  "type": "comparison",  
  "label": "Child Death Rate",  
  "current": "39%",  
  "benchmark": "UN Average: 18%",  
  "variance": "+117%"  
}]  
`

// watch implementation
let hasProcessed = false;
globalData = watch(globalData, (data) => {
  if (hasProcessed) return;
  
  const dataName = 'conflict-data';
  const cachedData = getData(dataName);

  if (!cachedData && data.thisYersData) {
      alert("Executed")
      analyzeWithAI(prompt_three + " Data: " + data.thisYersData);
      hasProcessed = true;
  } else if (cachedData) {
      inject(cachedData, 'analysis-container');
      hasProcessed = true;
  }
});
