/**
 * Check if cookie with specific name (e.g. 'testmode') exists and get value of the cookie. 
 * If a match is found the value of the cookie is returned. 
 * @param {Array<String>} wantedCookie: Array of strings. Each cookie will be searched for its name.
 */
 export default function getCookie(wantedCookie){
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
  return arrayCookieJar[indexCookie][1];
}

