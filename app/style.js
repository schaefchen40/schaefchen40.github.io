


function enableScroll(){
    console.log('Function enableScroll()');

    var div1 = $('#divForecast_0');
    var div2 = $('#divForecast_1');
    var div3 = $('#divForecast_2');

    div1.scroll(function() {
            div2.scrollLeft($(this).scrollLeft());
            div3.scrollLeft($(this).scrollLeft());
    });

    div2.scroll(function() {
        div1.scrollLeft($(this).scrollLeft());
        div3.scrollLeft($(this).scrollLeft());
    });

    div3.scroll(function() {
        div1.scrollLeft($(this).scrollLeft());
        div2.scrollLeft($(this).scrollLeft());
    });

    console.log(div1.scroll);
}


setDarkMode();

function openNav() {
  document.getElementById("customSidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("customSidenav").style.width = "0";
}

function setDarkMode(){
    var iconNameDark = 'darkicon.ico';
    var iconNameLight = 'lighticon.ico';
    var iconNameAuto = 'autoicon.ico';

    var darkModeStatus = getCookie(['darkModeStatus']);
    var nextDarkModeStatus = getCookie(['nextDarkMode']);
    var forcedDarkModeStatus = getCookie(['forceDarkMode']);

    var currentHour = new Date().getHours();
    var arrayOfCookies = document.cookie.split(';');
    var arrayCookieJar = [];
    var i = 0;
    arrayOfCookies.forEach(element => {
        arrayCookieJar[i] = [];
        arrayCookieJar[i][0] = element.split('=')[0].trim();
        arrayCookieJar[i][1] = element.split('=')[1];
        i++;
    });

    var indexCookieSunRise;
    var indexCookieSunSet;
    var indexDarkModeForced;
    var cnt = 0;
    arrayCookieJar.forEach(element => {
        if(element[0].includes('darkBeforeSunrise')){
            indexCookieSunRise = cnt;
        }else if(element[0].includes('darkAfterSunset')){
            indexCookieSunSet = cnt;
        }else if(element[0].includes('forceDarkMode')){
            indexDarkModeForced = cnt;
        }
        cnt++;
    });

    if(Number.isInteger(indexDarkModeForced) && arrayCookieJar[indexDarkModeForced][1] !== 'auto'){
        console.log('Darkemode forced to: ' + arrayCookieJar[indexDarkModeForced][1]);
        if(arrayCookieJar[indexDarkModeForced][1] == 'dark'){
            applyDarkMode(iconNameDark);
        }else if(arrayCookieJar[indexDarkModeForced][1] == 'light'){
            applyLightMode(iconNameLight);
        }
    }else{
        var timeRise;
        var timeSet;
        document.getElementById('darkmodeicon').setAttribute('src', iconNameAuto);
        /**
        * Default mode if no forced dark mode is set and sunrise/sunset have been calculated. 
        */
        document.cookie = 'nextDarkMode=forced';
        document.cookie = 'forceDarkMode=auto';

        if(Number.isInteger(indexCookieSunRise) && Number.isInteger(indexCookieSunSet)){
            // console.log('cookie found');
            timeRise = decodeURIComponent(arrayCookieJar[indexCookieSunRise][1]);
            timeSet = decodeURIComponent(arrayCookieJar[indexCookieSunSet][1]);
            console.log('sunrise/sunset exist');
            /**
            * Tow hours before sunrise and two hours after sunset the darkmode will be applied.
            */
            if(currentHour >= (parseInt(timeSet.split(':')[0]) + 2) || currentHour <= (parseInt(timeRise.split(':')[0]) - 2)){
                applyDarkMode(iconNameAuto);
            }else{
                applyLightMode(iconNameAuto);
            }
        /**
        * Default fallback mode if no forced dark mode is set and sunrise/sunset is not calculated jet. 
        */
        }else if((20 <= currentHour && currentHour < 24 || (0 <= currentHour && currentHour < 7))) {
            applyDarkMode(iconNameAuto);

        }else{
            applyLightMode(iconNameAuto);
        } 
    }
    console.log('darkmode is ' + darkModeStatus + ' and forced is ' + forcedDarkModeStatus + ', next: ' + nextDarkModeStatus);

}
    
/**
 * Set a stylesheet in the header of the html site. The stylesheet is then called to
 * change the look an feel of the site. The dark mode icon needs to be set seperately.
 * @param {String} icon: Depending on the dark mode status a differen icon should be used.
 */
function applyDarkMode(icon){
    if(!document.getElementsByClassName('darkModeStyle')[0]){
        var head = document.head;
        var link = document.createElement("link");
        document.cookie = 'darkModeStatus=on';

        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = './css/dark-mode.css';
        link.setAttribute('class', 'darkModeStyle');

        head.appendChild(link);
    }
    document.getElementById('darkmodeicon').setAttribute('src', icon);
}

 /**
  * Set a stylesheet in the header of the html site. The stylesheet is then called to
  * change the look an feel of the site. The dark mode icon needs to be set seperately.
  * @param {String} icon: Depending on the dark mode status a differen icon should be used.
  */
function applyLightMode(icon){
    var styleElement = document.getElementsByClassName('darkModeStyle')[0];
    if(styleElement){
        styleElement.remove(); 
    }

    document.getElementById('darkmodeicon').setAttribute('src', icon);
    document.cookie = 'darkModeStatus=off'; 
}

/**
 * The user can set a favourite dark mode style. A cookie with the favourite style gets set 
 * and is valid through the whole session (close browser). 
 * The dark mode icon needs to be set seperately.
 */
function forceDarkMode(){
    var darkModeStatus = getCookie(['darkModeStatus']);
    var nextDarkModeStatus = getCookie(['nextDarkMode']);
    var forcedDarkModeStatus = getCookie(['forceDarkMode']);
    console.log('darkmode was ' + darkModeStatus + ' and forced was ' + forcedDarkModeStatus + ', next: ' + nextDarkModeStatus);
    var iconName;
    if(darkModeStatus === 'on'){
        if(nextDarkModeStatus === 'auto'){
            document.cookie = 'forceDarkMode=auto';
            document.cookie = 'nextDarkMode=forced';
            setDarkMode();
        }if(nextDarkModeStatus === 'forced' && (forcedDarkModeStatus === 'dark' || forcedDarkModeStatus === 'light')){
            document.cookie = 'forceDarkMode=light';
            document.cookie = 'nextDarkMode=auto';
            iconName = 'lighticon.ico';
            applyLightMode(iconName);
        }else if(nextDarkModeStatus === 'forced' && forcedDarkModeStatus === 'auto'){
            document.cookie = 'forceDarkMode=light';
            document.cookie = 'nextDarkMode=forced';
            iconName = 'lighticon.ico';
            applyLightMode(iconName);
        }

    }else if(darkModeStatus === 'off'){
        if(nextDarkModeStatus === 'auto'){
            document.cookie = 'forceDarkMode=auto';
            document.cookie = 'nextDarkMode=forced';
            setDarkMode();
        }else if(nextDarkModeStatus === 'forced' && (forcedDarkModeStatus === 'dark' || forcedDarkModeStatus === 'light')){
            document.cookie = 'forceDarkMode=dark';
            document.cookie = 'nextDarkMode=auto';
            iconName = 'darkicon.ico';
            applyDarkMode(iconName);
        }else if(nextDarkModeStatus === 'forced' && forcedDarkModeStatus === 'auto'){
            document.cookie = 'forceDarkMode=dark';
            document.cookie = 'nextDarkMode=forced';
            iconName = 'darkicon.ico';
            applyDarkMode(iconName);
        }
    }
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


 /**
  * This function sets the "active" attribute for the selected item and removes the "active"
  * attribute from all the other items.
  * @param {*} inputObj: The object of the clicked item.
  */
function setDropdownItemActive(inputObj) {
    /** Because there could more than one dropdown-menu on the website the parent of the 
    * selected item needs to be identified. Only those items will be considered relevant that are
    * children of this parent element. The "active" 
    * class will then be set at the user-selected item and deleted on all other items.*/
    var dropdownElement = inputObj.parentNode;
    var dropdownItems = dropdownElement.getElementsByClassName('dropdown-item');
    var dropdownItemsCnt = dropdownItems.length;
    var dropdownItemId;
    var inputItemId = inputObj.id;
    for (var i = 0; i < dropdownItemsCnt; i++) {
        dropdownItemId = dropdownItems[i].id;
        if (inputItemId == dropdownItemId) {
            dropdownItems[i].setAttribute('class', 'dropdown-item active');
        } else {
            dropdownItems[i].setAttribute('class', 'dropdown-item');
        }
    }
}
