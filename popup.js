let cargando = document.getElementById('cargando');
let infoDiv = document.getElementById('infoDiv');
let barrio = document.getElementById('barrio');
let climaImg = document.getElementById('climaImg');
let temperatura = document.getElementById('temperatura');
let stermica = document.getElementById('stermica');
let minTemp = document.getElementById('minTemp');
let maxTemp = document.getElementById('maxTemp');
let humedad = document.getElementById('humedad');
let presion = document.getElementById('presion');
let viento = document.getElementById('viento');
let amanecer = document.getElementById('amanecer');
let atardecer = document.getElementById('atardecer');

document.addEventListener('DOMContentLoaded', () => {
        chrome.tabs.getSelected(null, ()=> {
            navigator.geolocation.getCurrentPosition(onSucccess, onError, config );
        })
}, false)

function onSucccess(position) {
    weatherBalloon(position.coords.latitude, position.coords.longitude);
}

function onError() {
    console.log("ocurrio un error o no hay permisos para ver la ubicación");
}

var config = {
    enableHighAccuracy: true, 
    maximumAge        : 30000, 
    timeout           : 27000
};

function weatherBalloon( lat, lng ) {
    var key = '629d7217e711db1e750d30ddb1c789ba';
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon=' + lng + '&appid='+key;
    fetch(url)  
    .then(function(resp) { return resp.json() })
    .then(function(data) {
        cargando.style.display = "none"
        infoDiv.style.display = "block"
        barrio.append(data.name)
        climaImg.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0]["icon"]}.svg`
        temperatura.append('T: ' + tempCelsius(data.main.temp))
        stermica.append('(ST ' + tempCelsius(data.main.feels_like) + ')')
        maxTemp.append('- max ' + tempCelsius(data.main.temp_max) + ')')
        minTemp.append('(min ' + tempCelsius(data.main.temp_min))
        presion.append(data.main.pressure + 'hpa')
        humedad.append(data.main.humidity + '%')
        viento.append(data.wind.speed + 'km/h')
        amanecer.append( intToTime(data.sys.sunrise))
        atardecer.append( intToTime(data.sys.sunset))

    })
    .catch(function() {
        // catch any errors
    });
}

function intToTime(int){
    var d = new Date(int);
    var n = d.toTimeString();
    return n.substring(0,8);
}

function tempCelsius(temp){
    return (temp - 273).toFixed(1) + '°C'
}