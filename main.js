// I am not using main.js for no optmize way to share data one file to another :Window object can help but it dely
// No full controll over timing data loads etc
// This file only using $(select) function that select element by id or class name

// function Query(){
//     fetch('https://data.techforpalestine.org/api/v2/killed-in-gaza.json')
//         .then(res => res.json())
//         .then(data => console.log(data));
// }

// window.addEventListener('load', function(){
//     Query()
// });

// Quick select element
function $(select){
    return document.querySelector(select);
}


// (async ()=>{
//     let x = await Query('https://data.techforpalestine.org/api/v2/killed-in-gaza.json');
//     for(let i = 0; i < x.data.length; i++){
//         console.log(x.data[i].name);
//     }
// })()

// let categorizedData = {};

// (async () => {
//     let result = await Query('https://data.techforpalestine.org/api/v2/killed-in-gaza.json');
//     if (result.error) {
//         console.error('Error fetching data:', result.error);
//         return;
//     }

//     const data = result.data;

//     const females = data.filter(person => person.gender === 'female');
//     const currentYear = new Date().getFullYear();
//     const currentYearData = data.filter(person => new Date(person.date).getFullYear() === currentYear);
//     const children = data.filter(person => person.age && person.age <= 18);
//     const today = new Date().toISOString().split('T')[0];
//     const todayData = data.filter(person => person.date && !isNaN(new Date(person.date)) && new Date(person.date).toISOString().split('T')[0] === today);

//     categorizedData = {
//         females,
//         currentYearData,
//         children,
//         todayData
//     };

//     console.log(categorizedData);
// })();