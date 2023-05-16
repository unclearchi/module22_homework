// const wsUri = "wss://echo.websocket.org/";
const newWsUri = "wss://ws.ifelse.io/";

const userInput = document.getElementById("userMessage");
const output = document.getElementById("output");
const re = /^Request served by [\da-f]{8}$/;  // hiding default server response on connection
const btnClose = document.querySelector('.j-btn-close');
const btnSend = document.querySelector('.j-btn-send');
const btnGeoloc = document.querySelector('.j-btn-geoloc');
const theForm = document.querySelector('form');
let websocket=doConnect(newWsUri);
let preventNextMessageShowUp=0;

function getGeoData(){
  const error = () => {
    showMessage('Невозможно получить ваше местоположение','error');
}

let success = async (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

    showMessage(`<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" title="Широта: ${latitude} °, Долгота: ${longitude} °" alt="Широта: ${latitude} °, Долгота: ${longitude} °" target="_blank" >Гео-локация</a>`,'geolocation');
    
  websocket.send(`${latitude}/${longitude}`);
}
  
  if (!navigator.geolocation) {
    showMessage('Geolocation не поддерживается вашим браузером','error');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
function doConnect(wsUri){
  let websocket = new WebSocket(wsUri); 
  websocket.onopen = function(evt) {
    showMessage('connected', 'system');
    btnClose.style.display='none';
  };
  websocket.onclose = function(evt) {
    showMessage('disconnected. Reconnection is to follow, hopefully. :)', 'system');
  };
  websocket.onmessage = function(evt) {
    showMessage(evt.data, 'responder');
  };
  websocket.onerror = function(evt) {
    showMessage(evt.data, error);
  };
  return websocket;
}
function isOpen(ws) { return ws.readyState === ws.OPEN }
function showMessage(message, sender='responder') {
  if(re.exec(message) !== null){
    sender='system';
    preventNextMessageShowUp=1;
  }
  if(message.length === 0){
    sender='error';
    message='Поле отправляемого сообщения не должно быть пустым'
  }

  if((preventNextMessageShowUp === 0) || (preventNextMessageShowUp === 2)){
    let pre = document.createElement("div");

    switch(sender) {
      case 'responder':
        pre.classList.add('responderMessage');
      break;
      case 'user':
        pre.classList.add('userMessage');
      break;
      case 'geolocation':
        pre.classList.add('userMessage');
        preventNextMessageShowUp=2;
      break;
      case 'system':
        pre.classList.add('systemMessage');
      message='System: ' + message;
      break;
      case 'error':
        pre.classList.add('errorMessage');
        message='System error: ' + message;
      break;
      default:
        pre.classList.add('unknownSourceMessage');
      }
    pre.innerHTML = '<p>' + message + '</p>';
    output.appendChild(pre);
  }
    preventNextMessageShowUp = (preventNextMessageShowUp > 0)? preventNextMessageShowUp - 1 : preventNextMessageShowUp;
}

btnSend.addEventListener('click', async (e) => {
  e.preventDefault();
                                                                         // to be on the safe side
  if (typeof websocket === 'undefined' ) {
    if ( !isOpen(websocket)) websocket = doConnect(newWsUri);
  }
  if (( websocket.readyState === 3 ) || ( websocket.readyState === 2 )) {
        websocket.close();
        websocket = doConnect(newWsUri);

        while (websocket.readyState !== 1) {                             // wait until new connection is open
          await new Promise(r => setTimeout(r, 250));
        }
   }

  let message = userInput.value;
  if(message.length !== 0) websocket.send(message);
  showMessage(message, 'user');
  userInput.value='';
  userInput.focus();
});

btnGeoloc.addEventListener('click', async (e) => {
  e.preventDefault();
  if (typeof websocket === 'undefined' ) {
    if ( !isOpen(websocket)) websocket = doConnect(newWsUri);
  }
  if (( websocket.readyState === 3 ) || ( websocket.readyState === 2 )) {
        websocket.close();
        websocket = doConnect(newWsUri);
        while (websocket.readyState !== 1) {
          await new Promise(r => setTimeout(r, 250));
        }
   }

  getGeoData();
});

btnClose.addEventListener('click', () => {
  websocket.close();
// websocket = null;
});


/* for [Enter] key support */
userInput.addEventListener('submit', () => {
  btnSend.click();
});
 theForm.addEventListener('submit', (e) => {
  e.preventDefault();
  btnSend.click();
});