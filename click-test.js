let total_count = 0;
let count = 0;
const button = document.getElementById('clickButton');
const countDisplay = document.getElementById('count');
const total_countDisplay = document.getElementById('total_count');
const tableBody = document.getElementById('table-body');

// retrieve click count from local storage (if it exists)
if (localStorage.getItem('clickCount')) {
  total_count = parseInt(localStorage.getItem('clickCount'));
  total_countDisplay.textContent = total_count;
}

// retrieve clicks by location from local storage (if it exists)
if (localStorage.getItem('clicksByLocation')) {
  const clicksByLocation = JSON.parse(localStorage.getItem('clicksByLocation'));
  for (const location in clicksByLocation) {
    const clickCount = clicksByLocation[location];
    const latLong = JSON.parse(location);
    addRowToTable(latLong.latitude, latLong.longitude, clickCount);
  }
}

// add event listener to button
button.addEventListener('click', function() {
  // get user's location
  navigator.geolocation.getCurrentPosition(function(position) {
    const location = {
      latitude: Number(position.coords.latitude),
      longitude: Number(position.coords.longitude)
    };

    // increment click count and store in local storage with location
    const clicksByLocation = JSON.parse(localStorage.getItem('clicksByLocation')) || {};
    clicksByLocation[JSON.stringify(location)] = (clicksByLocation[JSON.stringify(location)] || 0) + 1;
    localStorage.setItem('clicksByLocation', JSON.stringify(clicksByLocation));

    // update display
    count++;
    total_count++;
    countDisplay.textContent = count;
    total_countDisplay.textContent = total_count;

    // update table
    updateTable(location, clicksByLocation[JSON.stringify(location)]);

    // store total click count in local storage
    localStorage.setItem('clickCount', total_count);
  });
});

function addRowToTable(latitude, longitude, clickCount) {
  const newRow = tableBody.insertRow();
  newRow.setAttribute("id", `${latitude},${longitude}`);
  newRow.insertCell().textContent = latitude;
  newRow.insertCell().textContent = longitude;
  newRow.insertCell().textContent = clickCount
}

function updateTable(location, clickCount) {
  const existingRow = document.getElementById(`${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`);
  if (existingRow) {
    existingRow.cells[2].textContent = clickCount;
  } else {
    addRowToTable(location.latitude, location.longitude, clickCount);
  }
}
