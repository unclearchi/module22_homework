const btn=document.getElementsByTagName('button')[0];
const output = document.querySelector('#output');

btn.addEventListener('click', () => {
const error = () => {
  secondLi.textContent = 'Информация о местоположении недоступна';
}

const success = (position) => {  // при успешном получении геолокации
  //console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  secondLi.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
}
output.innerHTML='';
let firstLi = document.createElement('li');
let secondLi = document.createElement('li');
firstLi.innerText=`Размеры экрана пользователя ширина: ${window.screen.width} x высота: ${window.screen.height}`;
output.appendChild(firstLi);
output.appendChild(secondLi);

if (!navigator.geolocation) {
    secondLi.innerText='Информация о местоположении недоступна';
  } else {
    secondLi.textContent = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
}

});