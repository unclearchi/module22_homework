const btn=document.getElementsByTagName('button')[0];
const output = document.querySelector('#output');

btn.addEventListener('click', () => {
output.innerHTML='';
let firstLi = document.createElement('li');
output.appendChild(firstLi);
let secondLi = document.createElement('li');

  const fetchRequest = (url) => {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => { return json; })
    .catch(() => { console.log('error') });
}
const error = () => {
  firstLi.textContent = 'Информация о местоположении недоступна';
}

const success = async (position) => {                                    // upon successful geolocation request
  //console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  //firstLi.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
  let url='https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat='+latitude+'&long='+longitude;

  const requestResult = await fetchRequest(url);
  
  if (requestResult.length != 0) {
  firstLi.innerText = `временная зона, в которой находится пользователь: ${requestResult.timezone}`;
  secondLi.innerText = `местные дата и время: ${requestResult.date_time_txt}`;
  output.appendChild(secondLi);
  }
}


if (!navigator.geolocation) {
    firstLi.innerText='Информация о местоположении недоступна';
  } else {
    firstLi.textContent = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
}

});