/* Global Variables */
const form = document.querySelector('.app__form');
const icons = document.querySelectorAll('.entry__icon');

// Base URL and API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=d697f88dfe413c37f153b23d1272c40e';

//Get the date
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
  e.preventDefault();
  // get user input values
  const newZip = document.getElementById('zip').value;
  const content = document.getElementById('feelings').value;

  getWeather(baseURL, newZip, apiKey).then(function(userData) {

    let date = new Date(userData.dt * 1000)
    let date_str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    // add data to POST request
    postData('/add', {
      date: date_str,
      temp: Math.round((userData.main.temp - 273.15) * 100) / 100,
      content: content,
      humidity: userData.main.humidity,
      city: userData.name,
    })
  }).then(function(newData) {
    // call updateUI to update browser content
    updateUI()
  })
  // reset form
  form.reset();
}

/* Function to GET Web API Data */
const getWeather = async (baseURL, newZip, apiKey) => {
  // res equals to the result of fetch function
  const res = await fetch(baseURL + newZip + apiKey);
  try {
    // userData equals to the result of fetch function
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(data)
  })

  try {
    const newData = await req.json();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json()
    // show icons on the page
    icons.forEach(icon => icon.style.opacity = '1');
    // update new entry values
    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('temp').innerHTML = allData.temp;
    document.getElementById('content').innerHTML = allData.content;
    document.getElementById('humidity').innerHTML = allData.humidity;
    document.getElementById('city').innerHTML = allData.city;
  } catch (error) {
    console.log("error", error);
  }
};
