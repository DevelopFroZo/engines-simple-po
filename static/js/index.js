let count = 1;
let results;
let socketStatusSpan;

function getCurrentDate(){
  const now = new Date();
  const year = `${now.getFullYear()}`;
  let month = `${now.getMonth() + 1}`;
  let date = `${now.getDate()}`;
  let hours = `${now.getHours()}`;
  let minutes = `${now.getMinutes()}`;
  let seconds = `${now.getSeconds()}`;

  if( month.length === 1 ) month = `0${month}`;
  if( date.length === 1 ) date = `0${date}`;
  if( hours.length === 1 ) hours = `0${hours}`;
  if( minutes.length === 1 ) minutes = `0${minutes}`;
  if( seconds.length === 1 ) seconds = `0${seconds}`;

  return `${hours}:${minutes}:${seconds} ${date}.${month}.${year}`;
}

function clearButtonOnClick(){
  const confirmed = confirm( "Вы действительно хотите очистить данные?" );

  if( !confirmed ) return;

  results.innerHTML = "";
  count = 1;
}

function onConnect(){
  socketStatusSpan.innerHTML = "подключены";
  socketStatusSpan.className = "text-success";
}

function onDisconnect(){
  socketStatusSpan.innerHTML = "не подключены";
  socketStatusSpan.className = "text-danger";
}

function onAlgo( [ edgesCount, percent ] ){
  if( percent !== null ){
    percent = `${Math.floor( percent * 10000 ) / 100}%`;
  } else {
    percent = "N/A";
  }

  results.innerHTML += 
    `<tr>
      <td>${count++}</td>
      <td>${getCurrentDate()}</td>
      <td>${edgesCount}</td>
      <td>${percent}</td>
    </tr>`;
}

function index(){
  const clearButton = document.getElementById( "clearButton" );

  results = document.getElementById( "results" );
  socketStatusSpan = document.getElementById( "socketStatusSpan" );
  clearButton.addEventListener( "click", clearButtonOnClick );

  const socket = io();

  socket.on( "connect_error", err => {
    console.log( err );
  } );

  socket.on( "connect", onConnect );
  socket.on( "disconnect", onDisconnect );
  socket.on( "algo", onAlgo );
}

window.addEventListener( "load", index );