let goodInput;
let badInput;

async function getCalibration(){
  const response = await fetch( "/api/calibration" );
  const json = await response.json();

  return json;
}

function setCalibration( good, bad ){
  if( good !== null ){
    goodInput.value = good;
  }
  
  if( bad !== null ){
    badInput.value = bad;
  }
}

async function saveCalibration(){
  let good = Number( goodInput.value );
  let bad = Number( badInput.value );

  const response = await fetch( "/api/calibration", {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify( { good, bad } )
  } );

  ( { good, bad } = await response.json() );

  setCalibration( good, bad );

  alert( "Данные сохранены" );
}

async function index(){
  const saveCalibrationButton = document.getElementById( "saveCalibrationButton" );

  goodInput = document.getElementById( "goodInput" );
  badInput = document.getElementById( "badInput" );

  saveCalibrationButton.addEventListener( "click", saveCalibration );

  const { good, bad } = await getCalibration();

  setCalibration( good, bad );
}

window.addEventListener( "load", index );