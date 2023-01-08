// import {getCookie} from '/style.js';

window.onload = function () {
  // setTestmodeCookie('testCheck');
  prepSite();
  getData();
};

function reloadSite(){
  location.reload();
}

function setTestmodeCookie(element){
  if (document.getElementById(element).checked) {
    document.cookie = 'testmode=on';
    location.reload();
  }else{
    document.cookie = 'testmode=off';
    document.getElementById(element).checked = false;
    location.reload();
  } 
}

function prepSite() {
  console.log('Vizualizing current weather conditions');
  if (cityid.length > 0) {
    var i = 0;
    while (i < cityid.length) {
      var divContainer = document.createElement('div');
      var divRow = document.createElement('div');
      var divForecastRow = document.createElement('div');
      var divInfo = document.createElement('div');
      var divCurrent = document.createElement('div');
      var divCurrentData = document.createElement('div');
      var divForecast = document.createElement('div');

      divContainer.setAttribute('class', ' location');
      divContainer.setAttribute('id', cityid[i]);
      divContainer.style.height = 'auto';

      divRow.setAttribute('class', 'row flex-row flex-nowrap');

      divCurrent.setAttribute('class', 'container divCurrent');
      divCurrent.setAttribute('id', 'divCurrent_' + i);

      divInfo.setAttribute('class', 'locationData p-1');
      
      divCurrentData.setAttribute('class', 'currentData');

      divForecastRow.setAttribute('class', 'row flex-row flex-nowrap');
      divForecast.setAttribute('class', ' divForecast');
      divForecast.setAttribute('id', 'divForecast_' + i);

      document.getElementById('data').appendChild(divContainer);
      document.getElementById(cityid[i]).appendChild(divRow);
      document.getElementById(cityid[i]).getElementsByClassName('row')[0].appendChild(divCurrent);
      document.getElementById(cityid[i]).getElementsByClassName('row')[0].getElementsByClassName('divCurrent')[0].appendChild(divInfo);
      document.getElementById(cityid[i]).getElementsByClassName('row')[0].getElementsByClassName('divCurrent')[0].appendChild(divCurrentData);
      document.getElementById(cityid[i]).getElementsByClassName('row')[0].appendChild(divForecast);
      document.getElementById(cityid[i]).getElementsByClassName('divForecast')[0].appendChild(divForecastRow);
      
      i++;
    }
  }
  return;
}


/**
 * Check if cookie with specific name (e.g. 'testmode') exists and get value of the cookie. 
 * If a match is found the value of the cookie is returned. Otherwise "undefined" will be returned.
 * @param {Array<String>} wantedCookie: Array of strings. Each cookie will be searched for its name.
 */
function getCookie(wantedCookie){
  var indexCookie;
  var arrayOfCookies = document.cookie.split(';');
  var arrayCookieJar = [];
//   console.log(arrayCookieJar);
  wantedCookie.forEach(searchElement => {
    var i = 0;
    arrayOfCookies.forEach(element => {
        arrayCookieJar[i] = [];
        arrayCookieJar[i][0] = element.split('=')[0].trim();
        arrayCookieJar[i][1] = element.split('=')[1];
        i++;
    });

    var cnt = 0;
    arrayCookieJar.forEach(element => {
      if(element[0].includes(searchElement)){
          indexCookie = cnt;
      }
      cnt++;
    });
  });
  if(indexCookie !== undefined){
        return arrayCookieJar[indexCookie][1];
    }else{
        return undefined;
    }
}

function getData() {
  var urlCurrent = '/data?url=' + urlBaseCurrent + 'group?id=' + cityid + '&units=' + units + '&appid=' + appid;
  // console.log(urlCurrent);
  serverReq(urlCurrent, visualizeCurrent);
  console.log('request of current waether data done');

  var urlForecast;
  
  cookieValue = getCookie(['testmode']);
  // console.log('Value of the Cookie: ' + cookieValue);
  var testmodeStatus = document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('testCheck').checked = true;
  }); 
  cityid.forEach(element => {
    if (cookieValue == 'on' || testmodeStatus) {
      urlForecast = '/data?url=' + urlBaseForecast;
      document.getElementById('testCheck').checked = true;
    } else {
      urlForecast = '/data?url=' + urlBaseForecast + 'forecast?id=' + element + '&units=' + units + '&appid=' + appid;
      document.getElementById('testCheck').checked = false;
    }
    serverReq(urlForecast, vizualizeForecast);
    enableScroll();
  });

  console.log('request of forecast weather data done');
}

var cookieValue = getCookie(['testmode']);
var testmodeStatus = document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('testCheck').checked = true;
  }); 
console.log(testmodeStatus);

if (cookieValue == 'on' || testmodeStatus) {
  console.log('Testmode active!');

  var urlBaseCurrent = "http://samples.openweathermap.org/data/2.5/";
  var urlBaseForecast = 'https://samples.openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22';
  var appid = 'b6907d289e10d714a6e88b30761fae22';
  var units = "metric"; //units={metric, imperial}
  var lang = "en"; //lang={Arabic - ar, Bulgarian - bg, Catalan - ca, Czech - cz, German - de, Greek - el, English - en, Persian (Farsi) - fa, Finnish - fi, French - fr, Galician - gl, Croatian - hr, Hungarian - hu, Italian - it, Japanese - ja, Korean - kr, Latvian - la, Lithuanian - lt, Macedonian - mk, Dutch - nl, Polish - pl, Portuguese - pt, Romanian - ro, Russian - ru, Swedish - se, Slovak - sk, Slovenian - sl, Spanish - es, Turkish - tr, Ukrainian - ua, Vietnamese - vi, Chinese Simplified - zh_cn, Chinese Traditional - zh_tw}  
  var cityid = [524901, 703448, 2643743];
  var cnt_test = 0;
} else {
  console.log('Testmode inactive!');

  var urlBaseCurrent = "http://api.openweathermap.org/data/2.5/";
  var urlBaseForecast = 'https://api.openweathermap.org/data/2.5/';
  var appid = '282bcc843c3e9d56d0279087b3f8a550';
  var units = "metric"; //units={metric, imperial}
  var lang = "en"; //lang={Arabic - ar, Bulgarian - bg, Catalan - ca, Czech - cz, German - de, Greek - el, English - en, Persian (Farsi) - fa, Finnish - fi, French - fr, Galician - gl, Croatian - hr, Hungarian - hu, Italian - it, Japanese - ja, Korean - kr, Latvian - la, Lithuanian - lt, Macedonian - mk, Dutch - nl, Polish - pl, Portuguese - pt, Romanian - ro, Russian - ru, Swedish - se, Slovak - sk, Slovenian - sl, Spanish - es, Turkish - tr, Ukrainian - ua, Vietnamese - vi, Chinese Simplified - zh_cn, Chinese Traditional - zh_tw}  
  var cityid = [2775541, 6949518, 2772592];
  // console.log(cityid);
}

var unitTemp;
var unitPressure = 'hPa';
var unitHumidity = '%';
var unitSpeed;
var unitDirection = '°';
var unitPrecipitation = 'mm';
if(units == 'metric'){
  unitTemp = '°C';
  unitDirection = '°';
  unitSpeed = 'm/s';
}else if(units == 'imerial'){
  unit = '°F';
  unitSpeed = 'mi/s';
}else{
  unit = 'K';
  unitSpeed = 'm/s';
}
var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var urlBaseIcon = 'http://openweathermap.org/img/wn/';
var format = ""; //mode={xml, html}
var imgCnt = 0;

function serverReq(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.callback = callback;

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.response);
    }
  };
  xhr.onerror = function () {
    alert("Request failed");
  };
  // 2. Configure it: GET-request for the URL /data
  xhr.open('GET', url, 'true');
  // 3. Send the request over the network
  xhr.send();

  if (url.includes('forecast') || url.includes('group')) {
    xhr.onloadend = function () {
      updateIcon(false);
    };
  }
}

function visualizeCurrent(input) {
  console.log('Vizualizing current weather conditions');
  var obj = JSON.parse(input);
  // console.log(obj);

  if (cityid.length > 0) {
    var i = 0;
    var dtCurrent = new Date(obj.list[i].dt * 1000);
    var dtSR = new Date(obj.list[0].sys.sunrise * 1000); //add hour
    dtSR.setHours(dtSR.getHours() - 1);
    var dtSS = new Date(obj.list[0].sys.sunset * 1000);
    dtSS.setHours(dtSS.getHours() + 1);

    // console.log(dtCurrent);
    // console.log('Sunrise: ' + dtSR);
    // console.log('Sunset: ' + dtSS);

    while (i < obj.cnt) {
      var divDate = document.createElement('div');
      // var divIcon = document.createElement('div');
      var pDate = document.createElement('p');
      var dt = new Date(obj.list[i].dt * 1000);
      var hours = dt.getHours();
      var minutes = dt.getMinutes();
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      var wd = weekday[dt.getDay()];

      dtCurrent = wd + ' ' + dt.getDate() + '.' + dt.getMonth() + 1 + '.' + ' ' + hours + ':' + minutes;

      divDate.setAttribute('class','currentDate');
      pDate.innerHTML = dtCurrent;

      document.getElementById(obj.list[i].id).getElementsByClassName('locationData')[0].innerHTML = '<div class = "currentCity">' + obj.list[i].name + '</div>';
      document.getElementById(obj.list[i].id).getElementsByClassName('locationData')[0].appendChild(divDate);
      document.getElementById(obj.list[i].id).getElementsByClassName('locationData')[0].getElementsByClassName('currentDate')[0].appendChild(pDate);
    
      var firstTemp = true;
      var firstTempMinMax = true;
      var x = 0; 
      var y = 0;
      var j = 0;
      
      var keyNames = [['temp','T'], ['temp_min','Tmin'], ['temp_max','Tmax'], ['pressure','P'], ['humidity','rh'], ['sea_level','P(sL)'], ['grnd_level','P(grdL)'], ['speed','ff'], ['deg','dd']];
      var divIcon;
      var imgIcon;
      var divCurrentData;
      var divCurrentName;
      var divCurrentValue;
      for (var key in obj.list[i].main) {
        if (obj.list[i].main.hasOwnProperty(key)) {
          divCurrentData = document.createElement('div');
          divCurrentName = document.createElement('div');
          divCurrentValue = document.createElement('div');
          divIcon = document.createElement('div');
          imgIcon = document.createElement('img');

          divIcon.setAttribute('class', 'currentIcon');
          imgIcon.setAttribute('class', obj.list[i].weather[0].main + ' ' + obj.list[i].weather[0].id + ' icon' + ' weathericon' + ' ' + obj.list[i].weather[0].icon);
          imgIcon.setAttribute('id', 'iconid_' + imgCnt);
          imgIcon.setAttribute('preserveAspectRatio', 'xMinYMin');
          imgIcon.setAttribute('height', '100px');

          divCurrentData.setAttribute('class','container data');
          divCurrentName.setAttribute('class', ' name ' + key);       
          divCurrentName.setAttribute('id', 'current_' + key + '_' + i);
          divCurrentName.innerHTML = key + ':';

          if(key =='temp' || key.includes('temp_m')){ 
            if(obj.list[i].main[key] > 0){
              divCurrentValue.setAttribute('class', ' posNumberTemp value ' + key);
            }else if (obj.list[i].main[key] < 0){
              divCurrentValue.setAttribute('class', 'negNumberTemp value ' + key);
            }
            divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1) + ' ' + unitTemp;
          }else if(key.includes('pressure')){
            divCurrentValue.setAttribute('class', ' value ' + key);
            divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1) + ' ' + unitPressure;
          }else if(key.includes('humidity')){
            divCurrentValue.setAttribute('class', ' value ' + key);
            divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1) + ' ' + unitHumidity;
          }else if(key.includes('sea_level')){
            divCurrentValue.setAttribute('class', ' value ' + key);
            divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1) + ' ' + unitPressure;
          }else if(key.includes('grnd_level')){
            divCurrentValue.setAttribute('class', ' value ' + key);
            divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1) + ' ' + unitPressure;
          }else{
            if(key != 'temp_kf'){
              divCurrentValue.setAttribute('class', ' value ' + key);
              divCurrentValue.innerHTML = obj.list[i].main[key].toFixed(1);
            }
          }

          var divWrapper = document.createElement('div');
          if(key =='temp' || key.includes('temp_m')){ 
            divWrapper.setAttribute('class', 'container tempWrapper');
            divCurrentData.setAttribute('class','container data');            
            if(firstTemp == true){
              document.getElementsByClassName('currentData')[i].appendChild(divWrapper);
              if(key == 'temp_min' || key == 'temp_max'){
                divWrapper.setAttribute('class', 'container tempWrapperMinMax');
                if(firstTempMinMax == true){
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].appendChild(divWrapper);
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divCurrentData);
                  firstTempMinMax = false;
                }else{
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divCurrentData);
                }
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divCurrentName);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divCurrentValue);
                y++;
              }else{
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].appendChild(divCurrentData);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divCurrentName);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divCurrentValue);
                firstTemp = false;
                x++;
              }
            }else{
              if(key == 'temp_min' || key == 'temp_max'){
                divWrapper.setAttribute('class', 'container tempWrapperMinMax');
                if(firstTempMinMax == true){
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].appendChild(divWrapper);
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divCurrentData);
                  firstTempMinMax = false;
                }else{
                  document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divCurrentData);
                }
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divCurrentName);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divCurrentValue);
                y++;
              }else{
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].appendChild(divCurrentData);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divCurrentName);
                document.getElementsByClassName('currentData')[i].getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divCurrentValue);
            
                firstTemp = false;
                x++;
              }
            }
          }else{
            if(key != 'temp_kf'){
              document.getElementsByClassName('currentData')[i].appendChild(divCurrentData);
              document.getElementsByClassName('currentData')[i].getElementsByClassName('data')[j].appendChild(divCurrentName);
              document.getElementsByClassName('currentData')[i].getElementsByClassName('data')[j].appendChild(divCurrentValue);
            }
          }
          // var tdData = key + '=' + obj.list[i].main[key];
          j++;
        }
      }
      document.getElementById(obj.list[i].id).getElementsByClassName('currentData')[0].prepend(divIcon);
      document.getElementById(obj.list[i].id).getElementsByClassName('currentData')[0].getElementsByClassName('currentIcon')[0].appendChild(imgIcon);

      i++;
      imgCnt++;
    }
  }
  return;
}

function vizualizeForecast(input) {
  console.log('Vizualizing future weather conditions');
  var obj = JSON.parse(input);
  // console.log(obj);

  if (cityid.length > 0) {
    var i = 0;
    var n = 0;
    var selection;
    while (n < obj.cnt) {
      var divForcastDT = document.createElement('div');
      var divDate = document.createElement('div');
      var pDate = document.createElement('p');
      var divIcon = document.createElement('div');
      var imgIcon = document.createElement('img');
     
     //add dateTime Entry
      divForcastDT.setAttribute('class', 'dtEntry');
      divForcastDT.setAttribute('id', 'dtEntry_' + imgCnt);
      if (document.getElementById('testCheck').checked) {
        selection = document.getElementById(cityid[cnt_test]).getElementsByClassName('divForecast')[i];
      } else {
        selection = document.getElementById(obj.city.id).getElementsByClassName('divForecast')[i];
      }
      selection.getElementsByClassName('row')[0].appendChild(divForcastDT);

      // add date element
      var dt = new Date(obj.list[n].dt * 1000);
      var hours = dt.getHours();
      if (hours < 10) {
        hours = '0' + hours;
      }
      var wd = weekday[dt.getDay()];
      divDate.setAttribute('class', 'forecastDate');
      pDate.innerHTML = wd + ' ' + dt.getDate() + '.' + dt.getMonth() + 1 + '. </br>' + ' ' + hours + ':00';
      divDate.appendChild(pDate);
      document.getElementById('dtEntry_' + imgCnt).appendChild(divDate);

      //add icon element
      divIcon.setAttribute('class', 'forecastIcon');
      imgIcon.setAttribute('class', obj.list[n].weather[0].main + ' ' + obj.list[n].weather[0].id + ' icon' + ' weathericon' + ' ' + obj.list[n].weather[0].icon);
      imgIcon.setAttribute('id', 'iconid_' + imgCnt);
      imgIcon.setAttribute('preserveAspectRatio', 'xMinYMin');
      imgIcon.setAttribute('height', '70px');

      document.getElementById('dtEntry_' + imgCnt).appendChild(divIcon);
      document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastIcon')[0].appendChild(imgIcon);

      var divForecastData = document.createElement('div');
      //add data element
      divForecastData.setAttribute('class','forecastData');
      divForecastData.setAttribute('id', obj.list[n].dt);
      document.getElementById('dtEntry_' + imgCnt).appendChild(divForecastData);

      var firstTemp = true;
      var firstTempMinMax = true;
      var divForecastName;
      var divForecastValue;
      var divWrapper;
      var divDataWrapper;
      var x = 0; 
      var y = 0;
      var j = 0;
      for (var keyMain in obj.list[n].main) {
        divForecastName = document.createElement('div');
        divForecastValue = document.createElement('div');

        if (obj.list[n].main.hasOwnProperty(keyMain)) {
          divForecastName.setAttribute('class', ' name ' + keyMain);
          divForecastName.setAttribute('id', 'forecast_' + keyMain + '_' + i);
          divForecastValue.setAttribute('class', ' value ' + keyMain);
          divForecastName.innerHTML = keyMain + ':';

          if(keyMain =='temp' || keyMain.includes('temp_m')){ 
            if(obj.list[n].main[keyMain] > 0){
              divForecastValue.setAttribute('class', ' posNumberTemp value ' + keyMain);
            }else if (obj.list[n].main[keyMain] < 0){
              divForecastValue.setAttribute('class', ' negNumberTemp value ' + keyMain);
            }
            divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1) + ' ' + unitTemp;
          }else if(keyMain.includes('pressure')){
            divForecastValue.setAttribute('class', ' value ' + keyMain);
            divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1) + ' ' + unitPressure;
          }else if(keyMain.includes('humidity')){
            divForecastValue.setAttribute('class', ' value ' + keyMain);
            divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1) + ' ' + unitHumidity;
          }else if(keyMain.includes('sea_level')){
            divForecastValue.setAttribute('class', ' value ' + keyMain);
            divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1) + ' ' + unitPressure;
          }else if(keyMain.includes('grnd_level')){
            divForecastValue.setAttribute('class', ' value ' + keyMain);
            divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1) + ' ' + unitPressure;
          }else{
            if(keyMain != 'temp_kf'){
              divForecastValue.setAttribute('class', 'value ' + keyMain);
              divForecastValue.innerHTML = obj.list[n].main[keyMain].toFixed(1);
            }
          }

          // divForecastValue.innerHTML = obj.list[n].main[key].toFixed(1) + ' ' + unit;
          divWrapper = document.createElement('div');
          divDataWrapper = document.createElement('div');
          divDataWrapper.setAttribute('class','container data');            

          if(keyMain =='temp' || keyMain.includes('temp_m')){ 
            divWrapper.setAttribute('class', 'container tempWrapper');
            if(firstTemp == true){
              document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].appendChild(divWrapper);
              if(keyMain == 'temp_min' || keyMain == 'temp_max'){
                divWrapper.setAttribute('class', 'container tempWrapperMinMax');
                if(firstTempMinMax == true){
                  document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('tempWrapper')[0].appendChild(divWrapper);
                  // document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divForecastData);
                  firstTempMinMax = false;
                }else{
                  document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapperMinMax')[0].appendChild(divDataWrapper);
                }
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divForecastName);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divForecastValue);
                y++;
              }else{
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].appendChild(divDataWrapper);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divForecastName);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('data')[x].appendChild(divForecastValue);
                firstTemp = false;
                x++;
              }
            }else{
              if(keyMain == 'temp_min' || keyMain == 'temp_max'){
                divWrapper.setAttribute('class', 'container tempWrapperMinMax');
                if(firstTempMinMax == true){
                  document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].appendChild(divWrapper);
                  document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divDataWrapper);
                  firstTempMinMax = false;
                }else{
                  document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('tempWrapperMinMax')[0].appendChild(divDataWrapper);
                }
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divForecastName);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('tempWrapper')[0].getElementsByClassName('tempWrapperMinMax')[0].getElementsByClassName('data')[y].appendChild(divForecastValue);
                y++;
              }else{
                document.getElementById('dtEntry_' + imgCnt).appendChild(divDataWrapper);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('data')[x].appendChild(divForecastName);
                document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('data')[x].appendChild(divForecastValue);
            
                firstTemp = false;
                x++;
              }
            }
          }else{
            if(keyMain != 'temp_kf'){
              document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].appendChild(divDataWrapper);
              document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('data')[j].appendChild(divForecastName);
              document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('data')[j].appendChild(divForecastValue);
            } 
          }
          j++;
        }
      }

      var k = j-1;
      for (var key in obj.list[n].wind) {
        divForecastName = document.createElement('div');
        divForecastValue = document.createElement('div');
        if (obj.list[n].wind.hasOwnProperty(key)) {
          divForecastName.setAttribute('class', ' name ' + key);
          divForecastName.setAttribute('id', 'forecast_' + key + '_' + i);
          divForecastValue.setAttribute('class', ' value ' + key);
          divForecastName.innerHTML = key + ':';

          if(key.includes('speed')){
            divForecastValue.setAttribute('class', ' value ' + key);
            divForecastValue.innerHTML = obj.list[n].wind[key].toFixed(1) + ' ' + unitSpeed;
          }else if(key.includes('deg')){
            divForecastValue.setAttribute('class', ' value ' + key);
            divForecastValue.innerHTML = obj.list[n].wind[key].toFixed(1) + ' ' + unitDirection;
          }

          divDataWrapper = document.createElement('div');
          divDataWrapper.setAttribute('class','container data');            

          document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].appendChild(divDataWrapper);
          document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('data')[k].appendChild(divForecastName);
          document.getElementById('dtEntry_' + imgCnt).getElementsByClassName('forecastData')[0].getElementsByClassName('data')[k].appendChild(divForecastValue);
          k++;
        }
      }
      n++;
      imgCnt++;
    }
    i++;
    cnt_test++;
  }
  return;
}

function updateIcon(inputObj) {
  var urlIcon = '/conditions';
  if(inputObj){
    setDropdownItemActive(inputObj);
  }

  serverReq(urlIcon, setIcon);

  function setIcon(input) {
    var iconSelect = document.getElementsByClassName("dropdown-item active")[0];
    var iconSet = iconSelect.getAttribute('id');

    console.log('Vizualizing icons for future weather conditions');
    var ico = JSON.parse(input);
    var imgcnt = document.getElementsByClassName('weathericon').length;
    var imgclasses = document.getElementsByClassName('weathericon');
    var k = 0;
    while (k < imgcnt) {
      var imgclassnames = imgclasses[k].className.split(' ');
      var condname = imgclassnames[0];
      var condid = imgclassnames[1];
      var dayNight = imgclassnames[3];
      var iconName;
      for (var l = 0; l < Object.keys(ico.conditions[condname]).length; l++) {
        if (ico.conditions[condname][l].id == condid) {
          if (iconSet == 'drop_0') {
            if (dayNight.charAt(dayNight.length - 1) == 'n') {
              iconName = ico.conditions[condname][l].alticon_n;
            } else {
              iconName = ico.conditions[condname][l].alticon;
            }

          } else if (iconSet == 'drop_1') {
            if (dayNight.charAt(dayNight.length - 1) == 'n') {
              iconName = ico.conditions[condname][l].cuteicon_n;
            } else {
              iconName = ico.conditions[condname][l].cuteicon;
            }
          }
          document.getElementById(imgclasses[k].id).setAttribute('src', '/icon?' + 'urn=' + iconName);
          break;
        }
      }
      k++;
    }
  }
  return;
}



