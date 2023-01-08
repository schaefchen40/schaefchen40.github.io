
var chartJson = {};     //prepare json for chart
var today = new Date();
// ++++++++ zum Testen Anfang +++++++++
// today = new Date(2020, 0, 1);
// ++++++++ zum Testen Ende ++++++++++++
var long;   //Longitude
var lat;    //Latitude
var geodHight; //geodetic Height
var cityname; //name of the chosen location

var year, month, day, hours, minutes, second, time;
var dayOfYear;  //day of the year from 0 to 366 
var toRad = Math.PI / 180;
var toGrad = 180 / Math.PI;

var pathNow = [];   //Sunpath for current date
var pathPre = [];   //Sunpath of the day before the current date
var pathSSW = [];   //Sunpath for the summer solstice
var pathWSW = [];   //Sunpath for the winter solstice
var pathHeader = ['Azimut','Höhe'];     //calculation will result in azimut and height

var solRadNow = [];     //Solar radiation value for the current date for each degree of azimut
var solRadPre = [];     //Solar radiation value for the day before the current date for each degree of azimut
var solRadSSW = [];     //Solar radiation value for the summer solstice for each degree of azimut
var solRadWSW = [];     //Solar radiation value for the winter solstice for each degree of azimut
var solRadHeader = ['Azimut','Globalstrahlung'];      //calculation will result in azimut and global radiation

var timeNow = [];   //Timestamp value for the current date for each degree of azimut
var timePre = [];   //Timestamp value for the day before the current date for each degree of azimut
var timeSSW = [];   //Timestamp value for the summer solstice for each degree of azimut
var timeWSW = [];   //Timestamp value for the winter solstice for each degree of azimut
var timeHeader = ['Azimut','Uhrzeit'];  //calculation will result in azimut and timestamp

var timeSeriesFullYear = [];    //Sunpath, solar radiation and timestamp, for each day of the year, for each azimut - similar to the current date
var fullYearHeader = ['Tag des Jahres','Datum','Uhrzeit','Azimut','Hoehe','Globalstrahlun Horizontal','Globalstrahlung Geneigt']; //calculation will result in various data entries

var dataArrays =    ['Sonnenpfad Heute', 'Sonnenpfad SSW', 'Sonnenpfad WSW',
                    'Globalstrahlung Heute', 'Globalstrahlung SSW', 'Globalstrahlung WSW',
                    'Zeitstempel Heute', 'Zeitstempel SSW', 'Zeitstempel WSW', 
                    'Jahresberechnung'];    //user friendly names/identifiers for the download of the data
var dataArraysData = [pathNow, pathSSW, pathWSW,
                    solRadNow, solRadSSW, solRadWSW,
                    timeNow, timeSSW, timeWSW, 
                    timeSeriesFullYear];    //collection of all calculated dataseries (actual values that can be downloaded)
var dataArraysHeader = [pathHeader,
                    solRadHeader,
                    timeHeader, 
                    fullYearHeader];    //collection of all headers for the calculated timeseries (actual header in the downloaded file)
var sunDurationNow = [];    //holds the timestamp of sunrise and sunset of the current date
var sunDurationSSW = [];    //holds the timestamp of sunrise and sunset of the summer solstice
var sunDurationWSW = [];    //holds the timestamp of sunrise and sunset of the winter solstice

window.onload = function () {

    if ((today.getMonth() + 1) < 10) {            //Create 2 digit month, day, hour, minute. Attention: js Month starts at 0
        month = "0" + (today.getMonth() + 1);
    } else month = today.getMonth();
    if (today.getDate() < 10) {
        day = "0" + today.getDate();
    } else day = today.getDate();
    if (today.getHours() < 10) {
        hours = "0" + today.getHours();
    } else hours = today.getHours();
    if (today.getMinutes() < 10) {
        minutes = "0" + today.getHours();
    } else minutes = today.getMinutes();

    /**
    * The data for the horizon an the surface hight are from the free geodata portal of Austria in cooperation with rechenraum/voibos.
    * The next <10 lines of code make it possible to enbed the rechenraum/voibos web-app in an iframe.
    * Put together the url for the Open Government request in the iFrame id="govPvChart"
    * Uncomment this an the coresponding pv.html tag use chart of the austrian government/rechenraum/voibos.
    */
    // var govDT = month + "-" + day + "-" + hours + ":" + minutes;
    // var govUrl = "http://voibos.rechenraum.com/voibos/voibos";
    // var govReq = "sonnengang";
    // var govKoordX = "-185435";      //Coordinates from Tiris (Link) using EPSG 31255 (MGI / Austria GK Central).
    // var govKoordY = "254742";       //Change coord. for different place!
    // var govHeight = 7;
    // var govPara = ["Horizont", "Sonnenzeit"];

    // var govSrc = govUrl + "?Datum=" + govDT + "%&H=" + govHeight + "&name=" + govReq + "&Koordinate=" + govKoordX + "%2C" + govKoordY + "&CRS=31255&Output=" + govPara[0] + "%2C";
    // document.getElementById('govPvChart').src = govSrc;

    prepareLocationData(false);
};

function prepareLocationData(inputObj){
    var cookieValue = getCookie(['pvSelectedLocation']);
    var dropdownElement;
    var dropdownItem;
    var dropdownItemText;

    if(inputObj){
        setDropdownItemActive(inputObj);

        dropdownElement = document.getElementsByClassName('dropdown-menu location')[0];
        dropdownItem = dropdownElement.getElementsByClassName('dropdown-item active')[0];
        // console.log('Case 1 - User selection: ' + dropdownItem.id);
        document.cookie = 'pvSelectedLocation=' + dropdownItem.id;
    }else{
        if(cookieValue != undefined){
            // console.log('Case 2 - Cookie is set. Cookie value: ' + cookieValue);
            dropdownItem = document.getElementById(cookieValue);
            setDropdownItemActive(dropdownItem);
        }else {
            dropdownElement = document.getElementsByClassName('dropdown-menu location')[0];
            dropdownItem = dropdownElement.getElementsByClassName('dropdown-item active')[0];

            // console.log('Case 3 - No Cookie. Active Item: ' + dropdownItem.id);
            document.cookie = 'pvSelectedLocation=' + dropdownItem.id;
        }
    }  
    dropdownItemText = dropdownItem.title;

    if(dropdownItemText == 'Hopfgarten'){
        console.log('Hopfgarten');
        long = 12.156437;
        lat = 47.448534;
        geodHight = 700; 
        cityname = 'Hopfgarten';
    }else if(dropdownItemText == 'Lermoos'){
        console.log('Lermoos');
        long = 10.8807000;
        lat = 47.4035800;
        geodHight = 1000; 
        cityname = 'Lermoos';
    }
    getHorizon(cityname);
}

prepareOptionsBox();

function printChart(chartData){
    Highcharts.chart('pvchart', {
        chart: {
            backgroundColor: null,
            height: 700,
            // height: (9 / 16 * 100) + '%' // 16:9 ratio
        },
        title: {
            text: 'Horizont',
            style: {
                color: "#00000"
            }
        },
        subtitle: {
            text: chartJson.subtitle.text,
            style: {
                color: "#00000"
            }
        },
        yAxis: [{
            title: {
                text: 'Height',
                style: {
                    color: '#00000'
                }
            },
            labels: {
                style: {
                    color: '#00000',
                    fontSize: '120%'
                }
            },
            gridLineColor: '#242424',
            gridLineWidth: 0.5,
            min: 0,
            max: 70
        },
        {
            title: {
                // text: 'Solar Radiation',
                text: null,
                style: {
                    color: '#00000'
                }
            },
            labels: {
                style: {
                    color: '#00000'
                }
            },
            gridLineColor: '#242424',
        }],
        xAxis: [{
            title: {
                text: 'Azimuth',
                style: {
                    color: '#00000',
                    fontSize: '120%'
                }
            },
            labels: {
                style: {
                    color: '#00000',
                    fontSize: '120%'
                }
            },
            min: 0,
            max: 360
        },
        {
            type: 'datetime',
            title: {
                text: 'Time (UTC)',
                style: {
                    color: '#00000',
                    fontSize: '120%'

                }
            },
            labels: {
                style: {
                    color: '#00000',
                    fontSize: '120%'

                }
            },
            dateTimeLabelFormats: {
                day: '%H:%M'
            },
            min: Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), -today.getTimezoneOffset() / 60),
            max: Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1, -today.getTimezoneOffset() / 60),
            showEmpty: true,
        }],
        tooltip: {
            formatter: function () {
                var index = this.point.index;
                var tooltippTime = timeNow.find(element => element[0] == this.x);
                if (tooltippTime == undefined) tooltippTime = timeSSW.find(element => element[0] == this.x);
                if (tooltippTime == undefined) tooltippTime = timeWSW.find(element => element[0] == this.x);
                var formatedToolTippTime = (tooltippTime[1].split('.')[0].split(':')[1] < 10) ? tooltippTime[1].split('.')[0].split(':')[0] + ':0' + tooltippTime[1].split('.')[0].split(':')[1] : tooltippTime[1].split('.')[0];
                if (formatedToolTippTime.length == 4) formatedToolTippTime = "0" + formatedToolTippTime;
                var solRadValues = [];
                if(this.series.name == 'SSW'){
                    solRadValues = solRadSSW;
                }else if(this.series.name == 'WSW'){
                    solRadValues = solRadWSW;
                }else if(this.series.name == 'now'){
                    solRadValues = solRadNow;
                }
                return '<b>' + this.series.name + ' </b>' +
                    '<br/></b>Azimuth: <b>' + this.x.toFixed(2) +
                    '<br/></b>Height: <b>' + this.y.toFixed(2) + '\u00B0 </b>' +
                    '<br/></b>Time: <b>' + formatedToolTippTime + '</b>' +
                    '<br/></b>Solar Irradiance: <b>' + solRadValues[index][1].toFixed(2) + '</b>';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                marker: {
                    enabled: false
                }
            },
            area: {
                fillOpacity: 0.8,
                states: {
                    inactive: {
                        enabled: false
                    }
                }

            },
        },
        series: chartData,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500,
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

function prepareChart(input) {
    console.log('Function printChart');

    /**
     * Prepare the basics for the Highchart.
     */
    var title = { text: 'Sonnenstand und Solarpotential' };
    var subtitle = { text: cityname};
    chartJson.title = title;
    chartJson.subtitle = subtitle;
    $('#pvchart').highcharts(chartJson);	//print empty chart window on initial load of page	

    /**
     * The winter and summer solstice are roughly always at the same date (exactly between 20th and 22nd).
     * For this calculation it is assumed that the 21.05. and 21.11. are fixed.
     */
    var dateSSW = new Date(Date.UTC(today.getFullYear(), 5, 21));   //Month from 0 to 11
    var dateWSW = new Date(Date.UTC(today.getFullYear(), 11, 21));  //Month from 0 to 11
    var datePre = new Date(today);  //calculate the day before the current day
    datePre.setDate(datePre.getDate() - 1);
    // console.log('today: ' + today.toDateString() + ', minus 1: ' + datePre.toDateString()); 
    var calFullYear = true;

    calculateSunPath(0, pathNow, timeNow, solRadNow, false);    //sun path for the current date
    calculateSunPath(datePre, pathPre, timePre, solRadPre, false);  //sun path for the day before the current date
    calculateSunPath(dateSSW, pathSSW, timeSSW, solRadSSW, false);  //sun path for the summer solstice
    calculateSunPath(dateWSW, pathWSW, timeWSW, solRadWSW, false);  //sun path for the winter solstice
    calculateSunPath(0, timeSeriesFullYear, 0, 0, calFullYear);

    var array = [];
    var keys = Object.keys(input[0]);
    // console.log(keys);
    var j = 0;
    keys.forEach((keyelement, index) => {
        if (String(keyelement).localeCompare('Azimuth') == 0 ||
            String(keyelement).localeCompare('MEZ') == 0 ||
            String(keyelement).localeCompare('MESZ') == 0 ||
            String(keyelement).localeCompare('Sommersonnwende') == 0 ||
            String(keyelement).localeCompare('Wintersonnwende') == 0 ||
            String(keyelement).localeCompare('SolarRadiation') == 0 ||
            String(keyelement).localeCompare('current') == 0) return;
        array[j] = {};
        array[j].name = keyelement;
        // console.log(keyelement);
        if (String(keyelement).localeCompare('Oberflaeche') == 0) {
            array[j].type = 'area';
            array[j].color = 'rgba(132, 132, 132, 0.45)';
            array[j].lineColor = '#757575';
            array[j].lineWidth = 0.6;
            array[j].lineWidthPlus = 1.0;
            array[j].zIndex = 2;
            array[j].xAxis = 0;
            array[j].enableMouseTracking = false;
        }
        else if (String(keyelement).localeCompare('Gelaende') == 0) {
            array[j].type = 'area';
            array[j].color = 'rgba(230, 230, 230, 0.7)';
            array[j].lineColor = '#ffffff';
            array[j].lineWidth = 0.3;
            array[j].lineWidthPlus = 1.0;
            array[j].zIndex = 3;
            array[j].xAxis = 0;
            array[j].enableMouseTracking = false;
        }
        array[j].data = [];

        var i = 0;
        input.forEach(valueelement => {
            array[j].data[i] = [];
            array[j].data[i][0] = parseFloat(valueelement.Azimuth);
            array[j].data[i][1] = parseFloat(valueelement[keyelement]);
            i++;
        });
        j++;
    });

    //preparation for next step: Find the best match for the current timestamp in the time array and get index
    var k;
    var index;

    for (k = 1; k < timeNow.length - 1; k++) {
        var tempHour = timeNow[k][1].split(':')[0];
        var tempMinPrev = parseInt(timeNow[k - 1][1].split(':')[1]);
        var tempMinNext = parseInt(timeNow[k + 1][1].split(':')[1]);
                
        if(tempHour == today.getHours()) {
            // console.log('hello Hour: ' + tempHour + ' found at ' + k);      
            // console.log("TempMinNext: " + tempMinPrev);
            // console.log("TempMinNext: " + tempMinNext);    
            // console.log(today.getMinutes());
            if (today.getMinutes() >= tempMinPrev && today.getMinutes() < tempMinNext) {
                // console.log('hello Minute: ' + today.getMinutes()  + ' found at ' + k + ', k-1: ' + tempMinPrev + ', k+1: ' + tempMinNext);
                index = k;
                k = timeNow.length;
            }
        }else if(timeNow[k + 1][1].split(':')[0] > today.getHours() && timeNow[k + 1][1].split(':')[0] < 24){   //if the next hour-timestamp is already the new hour
            if(today.getMinutes() >= parseInt(timeNow[k][1].split(':')[1])){
                index = k;
                k = timeNow.length;
            }
        }
        else{   //catch all other errors - but in this case no marker for the current sun position will be shown
            index = 0;
        }
    }
    // console.log(timeNow);
    // console.log(pathNow);
    //next step: Add point at position of the sun for the current timestamp
    var sunIcon;
    if(today.getMonth() == 11){
        sunIcon = 'url(/img/star.png)';
    }else{
        sunIcon = 'url(/img/wi-day-sunny_yellow.png)';
    }
    pathNow[index] = {
        x: pathNow[index][0],
        y: pathNow[index][1],
        marker: {
            enabled: true,
            symbol: sunIcon,
        }
    };

    //color timeseries for current date according to the date/month
    var seriesColor;
    // console.log('Month: ' + today.getMonth());
    if(today.getMonth() == 0){    //January
        seriesColor = '#6400de';
    }else if(today.getMonth() == 1){    //Febuary
        seriesColor = '#0090b8';
    }else if(today.getMonth() == 2){    //March
        seriesColor = '#02b582';
    }else if(today.getMonth() == 3){    //April
        seriesColor = '#00bd2f';
    }else if(today.getMonth() == 4){    //May
        seriesColor = '#78bd00';
    }else if(today.getMonth() == 5){    //June
        seriesColor = '#ffb700';
    }else if(today.getMonth() == 6){    //July
        seriesColor = '#e6760e'; 
    }else if(today.getMonth() == 7){    //August
        seriesColor = '#d62262';
    }else if(today.getMonth() == 8){    //September
        seriesColor = '#ba2b5e';
    }else if(today.getMonth() == 9){    //October
        seriesColor = '#b04a12';
    }else if(today.getMonth() == 10){    //November
        seriesColor = '#9e1b58';
    }else if(today.getMonth() == 11){    //December
        seriesColor = '#ba0000';
    }

    array[j] = {};
    array[j].name = 'now';
    array[j].data = pathNow;
    array[j].type = 'spline';
    // array[j].color = '#f20cfa';
    array[j].color = seriesColor; 
    array[j].lineWidth = 3.0;
    array[j].xAxis = 0;
    array[j].zIndex = 1;

    array[j + 1] = {};
    array[j + 1].name = 'SSW';
    array[j + 1].data = pathSSW;
    array[j + 1].color = '#ffb700';
    array[j + 1].lineWidth = 1.5;
    array[j + 1].xAxis = 0;

    array[j + 2] = {};
    array[j + 2].name = 'WSW';
    array[j + 2].data = pathWSW;
    array[j + 2].color = '#127fcc';
    array[j + 2].lineWidth = 1.5;
    array[j + 2].xAxis = 0;

    array[j + 3] = {};
    array[j + 3].name = 'SolarRadiation';
    array[j + 3].data = solRadNow;
    array[j + 3].visible = false;
    array[j + 3].showInLegend = false;
    array[j + 3].color = '#889ff5';
    array[j + 3].xAxis = 0;
    array[j + 3].yAxis = 1;

    array[j + 4] = {};
    array[j + 4].data = [{}];
    array[j + 4].showInLegend = false;
    array[j + 4].xAxis = 1;


    printChart(array);

    calcSunshineDuration(array, pathPre, timePre, timeNow, sunDurationNow);
    calcSunshineDuration(array, 0, timePre, timeSSW, sunDurationSSW);
    calcSunshineDuration(array, 0, timePre, timeWSW, sunDurationWSW);

    fillInfoBox();
}  

function setDarkModeTimeCookie(){
    document.cookie = 'darkBeforeSunrise=' + encodeURIComponent(sunDurationNow[0][0].split('.')[0]);
    document.cookie = 'darkAfterSunset=' + encodeURIComponent(sunDurationNow[1][0].split('.')[0]);

}

function fillInfoBox(){
    console.log('Function fillInfoBox: Build and print info box');

    //prepare array to calculate the max. solar radiation 
    var solRadNowMax = []; 
    for(i = 0; i < solRadNow.length; i++){
        solRadNowMax[i] = solRadNow[i][1];
    }

    //build info box
    var infoDivArray = [];
    var infoContentArray = [];

    //prepare variables
    var infoDivElement;
    var infoDivDT;
    var infoTitle;
    var infoValue;

    setDarkModeTimeCookie();

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    var info = document.getElementById("pvInfoBox");
    var minNowRise = sunDurationNow[0][0].split(':')[1];
    var minPreRise = sunDurationNow[0][1].split(':')[1];
    var minNowSet = sunDurationNow[1][0].split(':')[1];
    var minPreSet = sunDurationNow[1][1].split(':')[1];
    // console.log(sunDurationNow);
    // console.log('MinNowRise: ' + minNowRise + ', MinPreRise: ' + minPreRise); 
    // console.log('MinNowSet: ' + minNowSet + ', MinPreSet: ' + minPreSet); 

    var offsetRise = minNowRise - minPreRise;
    var offsetSet = minNowSet - minPreSet;
    if(offsetRise >= 30){
        offsetRise = (minNowRise - minPreRise) - 60;
    }else if(offsetRise <= -30){
        offsetRise = (minNowRise - minPreRise) + 60;
    }

    if(offsetSet >= 30){
        offsetSet = (minNowSet - minPreSet) - 60;
    }else if(offsetSet <= -30){
        offsetSet = (minNowSet - minPreSet) + 60;
    }
    /*The following variables (arrays) each contain the ID of the div, the title to be displayed and the value to be displayed
    The arrays need to be addapted on demand - meaning if a new line of information should be displayed a new entry in 
    infoDivTitleIds and infoDivTitle needs to be made.*/
    var infoDivTitleIds = ['pvInfoBoxTitleSolRad', 'pvInfoBoxTitleSunRiseNow', 'pvInfoBoxTitleSunSetNow']; //needs to be adapted on demand
    var infoDivTitle = ['Max. Sonneneinstrahlung: ', 'Sonnenaufgang: ', 'Sonnenuntergang: ']; //needs to be adapted on demand
    var classNumColRise;   //color span of sunrise if number is positive
    var classNumColSet;   //color span of sunset if number is positive
    
    /*Set class of span for sunset and sunrise if number is >0, <0, =0.
    On rendering the css will color the values according to the class (e.g. negative = red, positive = green).*/
    if(offsetRise > 0){
        classNumColRise = "posNumber";
    }else if(offsetRise < 0){
        classNumColRise = 'negNumber';
    }else classNumColRise = 'zeroNumber';

    if(offsetSet > 0){
        classNumColSet = 'posNumber';
    }else if(offsetSet < 0){
        classNumColSet = 'negNumber';
    }else classNumColSet = 'zeroNumber';

    var infoTimeRise = (sunDurationNow[0][0].split(':')[1]).split('.')[0];
    var infoTimeSet = (sunDurationNow[1][0].split(':')[1]).split('.')[0];
    if(infoTimeRise == 0 || Math.abs(infoTimeRise) < 10){
        infoTimeRise = sunDurationNow[0][0].split(':')[0] + ':0' + infoTimeRise;
    }else infoTimeRise = sunDurationNow[0][0].split(':')[0] + ':' + infoTimeRise;

    if(infoTimeSet == 0 || Math.abs(infoTimeSet) < 10){
        infoTimeSet = sunDurationNow[1][0].split(':')[0] + ':0' + infoTimeSet;
    }else infoTimeSet = sunDurationNow[1][0].split(':')[0] + ':' + infoTimeSet;

    // console.log(offsetRise);
    //prepare text with all necessary values
    var infoDivValue = [Math.max.apply(Math,solRadNowMax).toFixed(2) + ' W/m<sup>2</sup>', 
                    infoTimeRise + ' Uhr ' + '<span class="sunOffset ' + classNumColRise + '">' + (offsetRise<0?offsetRise:"+"+offsetRise) + '</span>', 
                    infoTimeSet + ' Uhr ' + '<span class="sunOffset ' + classNumColSet + '">' + (offsetSet<0?offsetSet:"+"+offsetSet) + '</span>']; //needs to be adapted on demand

    var infoBoxDTElementCnt = document.getElementsByClassName('divInfoBoxDT').length;
    var infoBoxTitleElementCnt = document.getElementsByClassName('divInfoBoxTitle').length;

    if(infoBoxDTElementCnt == 0){
        //prepare new div for date and time
        infoDivDT = document.createElement("div");
        infoDivDT.setAttribute('class','divInfoBoxDT');
        infoDivDT.setAttribute('id','pvInfoBoxDateTime');
        infoDivDT.innerHTML = today.toLocaleDateString('de-AT',options);
        info.appendChild(infoDivDT);
    }

    for(i = 0; i < infoDivTitleIds.length; i++){
        // prepare array for content
        infoContentArray[i] = {};
        infoContentArray[i].titleId = infoDivTitleIds[i];
        infoContentArray[i].titleText = infoDivTitle[i];
        infoContentArray[i].valueText = infoDivValue[i];

        /**
        * Check if the info box is alreade filled. If it is filled, only the immerHTML will be updated.
        */
        if(infoBoxTitleElementCnt > 0){
            infoTitle = document.getElementsByClassName('divInfoBoxTitle')[i];
            infoValue = document.getElementsByClassName('divInfoBoxValue')[i];

            console.log('infoboxelement schon vorhanden');
            infoTitle.innerHTML = infoContentArray[i].titleText;
            infoValue.innerHTML = infoContentArray[i].valueText;
        }else{
            //prepare new div to group title-value pair
            infoDivElement = document.createElement("div");
            infoDivElement.setAttribute('class','divInfoBoxElement');
            
            //prepare new title and new value div
            infoTitle = document.createElement("div");
            infoTitle.setAttribute('class','divInfoBoxTitle');
            infoTitle.setAttribute('id',infoContentArray[i].titleId);

            infoValue = document.createElement("div");
            infoValue.setAttribute('class','divInfoBoxValue');

            //fill in content for title and value
            infoTitle.innerHTML += infoContentArray[i].titleText;
            infoValue.innerHTML += infoContentArray[i].valueText;

            //append all div's to info element
            infoDivElement.appendChild(infoTitle);
            infoDivElement.appendChild(infoValue);
            
            //add each element to infoDivArray
            infoDivArray[i] = infoDivElement;  

        }            
    }
    //loop through each element of infoDivArray and add it to the DOM
    infoDivArray.forEach(e => info.appendChild(e));
}


function calcSunshineDuration(inputData, inputDataPre, inputTimePre, inputTime, outputDuration){
    console.log('Calculate Sun Duration');

    var firstSunRay = 0;
    var firstSunRayPre = 0;
    var time;
    var timePre; 
    var correctedIndex;
    // console.log(inputData);
    /*Evaulate the time when the sun height of today is equal or higher than the surface */
    if(inputDataPre.length > 0){
        for(i = 0; i < inputData[1].data.length - 0; i++){  
            correctedIndex = getCorrectedIndex(inputData, i);       
            if(inputData[2].data[correctedIndex][1] >= inputData[1].data[i][1]){  
                time = inputTime[correctedIndex][1];
                        
                if(firstSunRay == 0){
                    // console.log(inputData);
                    // console.log(inputTime);
                    // console.log('Gelände: ' + inputData[1].data[i][1]);
                    // console.log('Sonnenhöhe: ' + inputData[2].data[correctedIndex][1]);
                    // console.log('i: ' + correctedIndex + ', azimut: ' + inputTime[correctedIndex][0] + ', time: ' + inputTime[correctedIndex][1]);
                    outputDuration[firstSunRay] = [];
                    outputDuration[firstSunRay][0] = time;

                    firstSunRay++;
                }
            }
        }
        /*Evaulate the time when the sun height of the previous day is equal or higher than the surface */
        if(inputDataPre.length == inputData[1].data.length){
            for(i = 0; i < inputData[1].data.length - 0; i++){
                correctedIndex = getCorrectedIndex(inputData, i);       
                if(inputDataPre[correctedIndex][1] >= inputData[1].data[i][1]){
                    timePre = inputTimePre[correctedIndex][1];

                    if(firstSunRayPre == 0){
                        outputDuration[firstSunRayPre][1] = timePre;
                        firstSunRayPre++;
                    }
                }
            }
        }else alert('Fehler: Gestern und heute haben nicht die selbe Tageslänge! Bitte wenden Sie sich an Ihren Administrator.');
        outputDuration[firstSunRay] = [];
        outputDuration[firstSunRay][0] = time;
        outputDuration[firstSunRay][1] = timePre;          
    }else{
        for(i = 0; i < inputData[1].data.length - 0; i++){
            correctedIndex = getCorrectedIndex(inputData, i);               
            if(inputData[2].data[correctedIndex][1] >= inputData[1].data[i][1]){
                time = inputTime[correctedIndex][1];
                // timePre = inputTimePre[i][1];
                if(firstSunRay == 0){
                    outputDuration[firstSunRay] = [];
                    outputDuration[firstSunRay][0] = time;
                    // outputDuration[firstSunRay][1] = timePre;

                    firstSunRay++;
                }
            }
        }
        outputDuration[firstSunRay] = [];
        outputDuration[firstSunRay][0] = time;
        // outputDuration[firstSunRay][1] = timePre;
    }
}

function calculateSunPath(date, arrayPath, arrayTime, solRad, fullYear) {
    console.log('Calculate Path');
        // calculate sun hight today
    var jd; //Julian Day
    var jd0; //Julian Day at UTC Hour 0
    var n; //Zeitvariable basierend auf dem julianischen Tag
    var L; //annäherung: mittlere ekliptikale Länge {\displaystyle L}L der Sonne:
    var Lambda; //ekliptikale Länge {\displaystyle \Lambda }\Lambda 
    var g; //(fiktive) gleichförmig anwachsende mittlere Anomalie {\displaystyle g}g
    var Epsilon; //Schiefe der Eklyptik
    var Alpha; //entlang des Himmelsäquators gezählte Rektaszension {\displaystyle \alpha }\alpha  
    var Delta;
    var T0;
    var ThetaG0; //mittlere Sternenzeit
    var Theta; //auf der geografischen Länge {\displaystyle \lambda }\lambda  (nach Osten positiv gezählt) ist der Stundenwinkel des Frühlingspunkts
    var Tau; //Stundenwinkel {\displaystyle \tau }\tau  der Sonne für jenen Ort
    var a; //Azimuth (Himmelsrichtung)
    var h; //Höhenwinkel der Sonne
    var hr; //Refraktionskorrigierte Höhe
    var R; //Refraktionskorrektur

    var dtUTC0;
    var dtUTC;
    var dtOffsetOrtszeit;
    var dtOrtzszeit;
    var azi = 0;
    var calcHour;
    var calcMin;

    if(fullYear == true){
        var start = new Date("01/01/" + today.getFullYear());
        var end = new Date("12/31/" + today.getFullYear());
        calcday = new Date(start);
        var dayCnt = 0;
        var arrayTotalLength = 0;
        var aTemp = 0;
        var hrTemp = 0;
        var timeTemp = 0;
        var timeTempCnt = 0;
        var arrayCnt = 0;

        while(calcday <= end){
            for (azi = 0; azi < 360; azi++) {
                calcHour = Math.floor(azi * 24 / 360);
                calcMin = (azi * 24 / 360 - Math.floor(azi * 24 / 360)) * 60;

                // ++++++++ mit Millisekunden +++++++++
                // var calcHour = parseInt((azi * 24/360).toString().split('.')[0]);
                // var calcMin = parseFloat(((parseFloat('0.' + (azi * 24/360).toString().split('.')[1]))*60).toString().split('.')[0]);
                // var calcMilli = (parseFloat('0.' + (azi * 24/360).toString().split('.')[1])*60 - calcMin) * 10000;
                // console.log((parseFloat('0.' + (azi * 24/360).toString().split('.')[1]))*60);
                // ++++++++++++++ Ende +++++++++++++++++

                // console.log('min: ' + calcMin);
                // console.log('mil: ' + calcMilli);
                calcMin = calcMin.toFixed(3);
                // console.log('calcMin fixed: ' + calcMin);
                if (date == 0) {
                    dtUTC = new Date(Date.UTC(calcday.getFullYear(), calcday.getMonth(), calcday.getDate(), calcHour, calcMin, 0));
                    dtUTC0 = new Date(Date.UTC(calcday.getFullYear(), calcday.getMonth(), calcday.getDate(), 0, 0, 0));
                } else {
                    dtUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), calcHour, calcMin, 0));
                    dtUTC0 = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
                }

                dtOffsetOrtszeit = dtUTC.getTimezoneOffset() / 60;
                dtOrtzszeit = calcHour - dtOffsetOrtszeit;
                // console.log('--------> Uhrzeit (UTC): ' + dtUTC.toUTCString());
                jd = 2440587.5 + dtUTC / 86400000;
                if (azi == 0) {
                    jd0 = 2440587.5 + dtUTC0 / 86400000;
                    // console.log('Julianische Tageszahl h0: ' + jd0);
                }
                // console.log('Julianische Tageszahl: ' + jd);
                // Date.UTC() liefert die Zeit in ms seit 1. Januar 1970, 00:00 UTC (= JD 2440587,5).
                // Monate müssen im Wertebereich 0 .. 11 übergeben werden.

                n = jd - 2451545.0;
                // console.log('n: ' + n);

                L = 280.460 + 0.9856474 * n;
                while (L > 360) {
                    L = L - 360;
                }
                // console.log('mittlere ekliptikale Länge L: ' + L);

                g = 357.528 + 0.9856003 * n;
                while (g > 360) {
                    g = g - 360;
                }
                // console.log('mittlere Anomalie g: ' + g);

                Lambda = L + 1.915 * (Math.sin(g * toRad)) + (0.01997 * (Math.sin(2 * (g * toRad))));
                while (Lambda > 360) {
                    Lambda = Lambda - 180;
                }
                // console.log('Ekliptikale Länge der Sonne Lambda: ' + Lambda);

                Epsilon = 23.439 - 0.0000004 * n;
                // console.log('Ekliptik Epsilon: ' + Epsilon);

                if (Math.cos(Lambda * toRad) > 0) {
                    Alpha = toGrad * Math.atan(Math.cos(Epsilon * toRad) * Math.tan(Lambda * toRad));
                } else if (Math.cos(Lambda * toRad) < 0) {
                    Alpha = toGrad * (Math.atan(Math.cos(Epsilon * toRad) * Math.tan(Lambda * toRad)) + 4 * (Math.atan(1)));
                }
                // while(Alpha < 0){
                //     Alpha = Alpha + 180;
                // }
                // console.log('Rektaszension  Alpha: ' + Alpha);

                Delta = toGrad * Math.asin(Math.sin(Epsilon * toRad) * Math.sin(Lambda * toRad));
                // console.log('Deklination  Delta: ' + Delta);

                T0 = (jd0 - 2451545.0) / 36525;
                // console.log('T0: ' + T0);
                ThetaG0 = 6.697376 + 2400.05134 * T0 + 1.00273790935 * (calcHour + calcMin / 60);
                // console.log('Mittlere Sternzeit ThetaG UT [h]: ' + ThetaG0);
                while (ThetaG0 > 24) {
                    ThetaG0 = ThetaG0 - 24;
                }
                // console.log('Mittlere Sternzeit ThetaG0 UT [h]: ' + ThetaG0);
                // console.log('Mittlere Sternzeit ThetaG0 UT [Grad]: ' + ThetaG0*15);

                Theta = (ThetaG0 * 15) + long;
                // console.log('Stundenwinkel des Frühlingspunkts: ' + Theta);  
                while (Theta > 360) {
                    Theta = Theta - 360;
                }
                // console.log('Theta im Gradmaß: ' + Theta);  

                Tau = Theta - Alpha;
                if (Tau < 0) {
                    while (Tau < 0) {
                        Tau = Tau + 360;
                    }
                } else {
                    while (Tau > 360) {
                        Tau = Tau - 360;
                    }
                }
                // console.log('Stundenwinkel Tau: ' + Tau);

                if ((Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad)) < 0) {
                    // console.log('Nenner negativ');
                    a = toGrad * (Math.atan(Math.sin(Tau * toRad) / (Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad))));
                    a = a + 180;
                } else {
                    a = -toGrad * (Math.atan(Math.sin(Tau * toRad) / (Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad))));
                    a = a - 360;
                }
                a = a + 180;

                while (a > 360) {
                    a = a - 360;
                }
                if (a < 0) {
                    a = a * (-1);
                }
                // console.log('Azimuth a: ' + a);

                h = toGrad * (Math.asin(Math.cos(Delta * toRad) * Math.cos(Tau * toRad) * Math.cos(lat * toRad) + Math.sin(Delta * toRad) * Math.sin(lat * toRad)));
                // console.log('Höhe h: ' + h);

                R = 1.02 / (Math.tan((h + (10.3 / (h + 5.11))) * toRad));

                hr = h + R / 60;
                // console.log('Refraktionsbreinigte Höhe hr: ' + hr);
                if(dayCnt == 0){
                    arrayTotalLength = azi;
                }else{
                    arrayTotalLength = arrayTotalLength + 1;
                }
                
                if(timeTempCnt == 0 || timeTemp == dtOrtzszeit){
                    timeTemp = dtOrtzszeit; //in first loop timeTempCnt = 0
                    timeTempCnt++;
                    aTemp = aTemp + parseFloat(a.toFixed(3));
                    hrTemp = hrTemp + parseFloat(hr.toFixed(3));
                    // console.log('aTemp: ' + aTemp + ', hrTemp: ' + hrTemp);             
                }else if(timeTemp != dtOrtzszeit){
                    arrayPath[arrayCnt] = [];
                    arrayPath[arrayCnt][0] = dayCnt;
                    arrayPath[arrayCnt][1] = calcday.toDateString();
                    arrayPath[arrayCnt][2] = timeTemp.toString() + ':00';
                    arrayPath[arrayCnt][3] = aTemp/timeTempCnt;
                    arrayPath[arrayCnt][4] = hrTemp/timeTempCnt;
                    arrayPath[arrayCnt][5] = 0;

                    aTemp = parseFloat(a.toFixed(3));   //reset aTemp to first value of new hour
                    hrTemp = parseFloat(hr.toFixed(3)); //reset hrTemp to first value of new hour
                    timeTemp = dtOrtzszeit; //reset timeTemp to hour value of new hour
                    // console.log('aTemp: ' + aTemp + ', hrTemp: ' + hrTemp);             

                    timeTempCnt = 1;
                    arrayCnt++;
                } 
            }
            arrayTotalLength = arrayTotalLength;
            dayCnt++;

            var newDate = calcday.setDate(calcday.getDate() + 1);
            calcday = new Date(newDate);
        }
        calculateSolarRadiation(arrayPath, 0, fullYear);
    }else{
        for (azi = 0; azi < 360; azi++) {
            calcHour = Math.floor(azi * 24 / 360);
            calcMin = (azi * 24 / 360 - Math.floor(azi * 24 / 360)) * 60;

            // ++++++++ mit Millisekunden +++++++++
            // var calcHour = parseInt((azi * 24/360).toString().split('.')[0]);
            // var calcMin = parseFloat(((parseFloat('0.' + (azi * 24/360).toString().split('.')[1]))*60).toString().split('.')[0]);
            // var calcMilli = (parseFloat('0.' + (azi * 24/360).toString().split('.')[1])*60 - calcMin) * 10000;
            // console.log((parseFloat('0.' + (azi * 24/360).toString().split('.')[1]))*60);
            // ++++++++++++++ Ende +++++++++++++++++

            calcMin = calcMin.toFixed(3);
            // console.log('calcMin fixed: ' + calcMin);
            if (date == 0) {
                dtUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), calcHour, calcMin, 0));
                dtUTC0 = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
            } else {
                dtUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), calcHour, calcMin, 0));
                dtUTC0 = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
            }
            // ++++++++ zum Testen Anfang +++++++++
            // dtUTC = new Date(Date.UTC(2006, 7, 6, calcHour, calcMin, 0));
            // dtUTC0 = new Date(Date.UTC(2006, 7, 6,0 ,0 ,0));
            // ++++++++ zum Testen Ende ++++++++++++

            dtOffsetOrtszeit = dtUTC.getTimezoneOffset() / 60;
            dtOrtzszeit = calcHour - dtOffsetOrtszeit;
            // console.log('--------> Uhrzeit (UTC): ' + dtUTC.toUTCString());
            jd = 2440587.5 + dtUTC / 86400000;
            if (azi == 0) {
                jd0 = 2440587.5 + dtUTC0 / 86400000;
                // console.log('Julianische Tageszahl h0: ' + jd0);
            }
            // console.log('Julianische Tageszahl: ' + jd);
            // Date.UTC() liefert die Zeit in ms seit 1. Januar 1970, 00:00 UTC (= JD 2440587,5).
            // Monate müssen im Wertebereich 0 .. 11 übergeben werden.

            n = jd - 2451545.0;
            // console.log('n: ' + n);

            L = 280.460 + 0.9856474 * n;
            while (L > 360) {
                L = L - 360;
            }
            // console.log('mittlere ekliptikale Länge L: ' + L);

            g = 357.528 + 0.9856003 * n;
            while (g > 360) {
                g = g - 360;
            }
            // console.log('mittlere Anomalie g: ' + g);

            Lambda = L + 1.915 * (Math.sin(g * toRad)) + (0.01997 * (Math.sin(2 * (g * toRad))));
            while (Lambda > 360) {
                Lambda = Lambda - 180;
            }
            // console.log('Ekliptikale Länge der Sonne Lambda: ' + Lambda);

            Epsilon = 23.439 - 0.0000004 * n;
            // console.log('Ekliptik Epsilon: ' + Epsilon);

            if (Math.cos(Lambda * toRad) > 0) {
                Alpha = toGrad * Math.atan(Math.cos(Epsilon * toRad) * Math.tan(Lambda * toRad));
            } else if (Math.cos(Lambda * toRad) < 0) {
                Alpha = toGrad * (Math.atan(Math.cos(Epsilon * toRad) * Math.tan(Lambda * toRad)) + 4 * (Math.atan(1)));
            }
            // while(Alpha < 0){
            //     Alpha = Alpha + 180;
            // }
            // console.log('Rektaszension  Alpha: ' + Alpha);

            Delta = toGrad * Math.asin(Math.sin(Epsilon * toRad) * Math.sin(Lambda * toRad));
            // console.log('Deklination  Delta: ' + Delta);

            T0 = (jd0 - 2451545.0) / 36525;
            // console.log('T0: ' + T0);
            ThetaG0 = 6.697376 + 2400.05134 * T0 + 1.00273790935 * (calcHour + calcMin / 60);
            // console.log('Mittlere Sternzeit ThetaG UT [h]: ' + ThetaG0);
            while (ThetaG0 > 24) {
                ThetaG0 = ThetaG0 - 24;
            }
            // console.log('Mittlere Sternzeit ThetaG0 UT [h]: ' + ThetaG0);
            // console.log('Mittlere Sternzeit ThetaG0 UT [Grad]: ' + ThetaG0*15);

            Theta = (ThetaG0 * 15) + long;
            // console.log('Stundenwinkel des Frühlingspunkts: ' + Theta);  
            while (Theta > 360) {
                Theta = Theta - 360;
            }
            // console.log('Theta im Gradmaß: ' + Theta);  

            Tau = Theta - Alpha;
            if (Tau < 0) {
                while (Tau < 0) {
                    Tau = Tau + 360;
                }
            } else {
                while (Tau > 360) {
                    Tau = Tau - 360;
                }
            }
            // console.log('Stundenwinkel Tau: ' + Tau);

            if ((Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad)) < 0) {
                // console.log('Nenner negativ');
                a = toGrad * (Math.atan(Math.sin(Tau * toRad) / (Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad))));
                a = a + 180;
            } else {
                a = -toGrad * (Math.atan(Math.sin(Tau * toRad) / (Math.cos(Tau * toRad) * Math.sin(lat * toRad) - Math.tan(Delta * toRad) * Math.cos(lat * toRad))));
                a = a - 360;
            }
            a = a + 180;

            while (a > 360) {
                a = a - 360;
            }
            if (a < 0) {
                a = a * (-1);
            }
            // console.log('Azimuth a: ' + a);

            h = toGrad * (Math.asin(Math.cos(Delta * toRad) * Math.cos(Tau * toRad) * Math.cos(lat * toRad) + Math.sin(Delta * toRad) * Math.sin(lat * toRad)));
            // console.log('Höhe h: ' + h);

            R = 1.02 / (Math.tan((h + (10.3 / (h + 5.11))) * toRad));

            hr = h + R / 60;
            // console.log('Refraktionsbreinigte Höhe hr: ' + hr);

            arrayPath[azi] = [];
            arrayPath[azi][0] = parseFloat(a.toFixed(3));
            arrayPath[azi][1] = parseFloat(hr.toFixed(3));

            arrayTime[azi] = [];
            arrayTime[azi][0] = parseFloat(a.toFixed(3));
            arrayTime[azi][1] = (dtOrtzszeit.toString()) + ':' + calcMin.toString();
        }

        arrayPath.sort(function (a, b) {
            return a[0] - b[0];
        });
        arrayTime.sort(function (a, b) {
            return a[0] - b[0];
        });
        calculateSolarRadiation(arrayPath, solRad, fullYear);
    }
}


/**
 * Calculate the solar radiation of the sun for either the current date, the summer solstice, 
 * the winter solstice or the whole year.
 * @param {Array} inputArray: an array that contains the [0] azimuth angle and the [1] height angle of the sun
 * @param {Array} outputArray: an array that will hold the calculated results of this function
 * @param {boolean} fullYear: a boolean that will be used to differentiate between calculating the full year (true) or just one day (false)
 */
function calculateSolarRadiation(inputArray, outputArray, fullYear){
    console.log('Calculate Solar Radiation');
    
    const solConst =  1367; //Solar power outside of atmosphere
    var Q;  //density of air mass
    const T = 4.5; //opacityFactor
    var tempArray = [];
    var moduleAzi = -30;
    var moduleTilt = 17;
    var airMass = 0;
    var solConstKorr;
    if(fullYear == true){
        // console.log(inputArray);
        for(var i = 0; i < inputArray.length; i++){
            dayOfYear = inputArray[i][0] + 1;
            solConstKorr = (1 + 0.033 * Math.cos(2 * Math.PI * ((dayOfYear)/365.25))) * solConst; //Calculation of extraterrestrial solar power including orbital path fluctuance of earth arround the sun
            
            var temp = inputArray[i][3];
            tempArray[i] = [];
            if(inputArray[i][4] < 0){
                inputArray[i][5] = 0;
                tempArray[i][0] = 0;
                tempArray[i][1] = 0;
                tempArray[i][2] = 0;
                tempArray[i][3] = 0;
                tempArray[i][4] = 0;
            }else{         
                // tempArray[i][0] = solConstKorr * Math.sin(inputArray[i][4] * toRad); //extraterrestrial solar radiation on horizontal plane at top of atmosphere and selected latitude 
                //Solar direct irradiance on top of atmosphere perpendicular to the sun rays
                tempArray[i][0] = solConstKorr;
                // console.log('AirMas: ' + 1/Math.cos((90-inputArray[i][4]) * toRad));
                
                //Solar direct irradiance at ground level perpendicular to the sun rays
                airMass = 1/Math.cos((90-inputArray[i][4]) * toRad);
                tempArray[i][1] = solConstKorr * ((1 - 0.14 * (geodHight/1000)) * Math.pow(0.7, (Math.pow(airMass,0.678))) + 0.14 * (geodHight/1000));  //solar radiation after traveling through atmosphere (including "Trübungsfaktor")
                // console.log('Korrigierte Solarkonst.: ' + tempArray[i][0] + ', Ground level: ' + tempArray[i][1]);

                //Solar diffuse irradiance at ground level perpendicular to the sun
                tempArray[i][2] = 0.1 * tempArray[i][1];
                // tempArray[i][2] = tempArray[i][1] * 0.53 - 0.34 * Math.atan(5.5 * solConstKorr/tempArray[i][1] - 3.16); //diffuse solar radiation
                // console.log('Diffuse Strahlung.: ' + tempArray[i][2]);

                //Solar irradiance at ground level on horizontal (flat) surface
                tempArray[i][3] = tempArray[i][1] * Math.sin(inputArray[i][4] * toRad);

                //Solar irradiance at ground level on tilted surface
                tempArray[i][4] = tempArray[i][1] * (Math.cos(inputArray[i][4] * toRad) * Math.sin(moduleTilt * toRad) * Math.cos((0 - moduleAzi) * toRad) + Math.sin(inputArray[i][4] * toRad) * Math.cos(moduleTilt * toRad));

                //Global irradiation (direct + diffuse) at ground level on tilted surface
                tempArray[i][5] = tempArray[i][4] + tempArray[i][2];
                // console.log('Globalstrahlung.: ' + tempArray[i][5]);
                
                inputArray[i][5] = tempArray[i][3] + tempArray[i][2];
                inputArray[i][6] = tempArray[i][5];
            }
        }
        // console.log(tempArray);     
    }else{
        dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));  
        solConstKorr = (1 + 0.033 * Math.cos(2 * Math.PI * ((dayOfYear)/365.25))) * solConst; //Calculation of extraterrestrial solar power including orbital path fluctuance of earth arround the sun

        for(var j = 0; j < inputArray.length; j++){
            outputArray[j] = [];
            tempArray[j] = [];
            outputArray[j][0] = inputArray[j][0];

            var aziRebuild = inputArray[j][0];
            var azi;
            if(aziRebuild == 180){
                azi = 0;
            }else if(aziRebuild == 0){
                azi = 180;
            }else if(aziRebuild < 180 && aziRebuild > 0){
                azi = aziRebuild - 180;
            }else if(aziRebuild > 180 && aziRebuild < 360){
                azi = aziRebuild - 180;
            }

            if(inputArray[j][1] < 0){
                outputArray[j][1] = 0;

                tempArray[j][0] = 0;
                tempArray[j][1] = 0;
                tempArray[j][2] = 0;
                tempArray[j][3] = 0;
                tempArray[j][4] = 0;

            }else{         
                tempArray[j][0] = solConstKorr * Math.cos((90-inputArray[j][1]) * toRad); //extraterrestrial solar radiation on horizontal plane at top of atmosphere and selected latitude 

                Q = ((9.38076 * (Math.sin(inputArray[j][1] * toRad) + Math.sqrt(0.003 + Math.sin(inputArray[j][1] * toRad) * Math.sin(inputArray[j][1] * toRad))))/(2.0015 * (1 - geodHight * 0.0001))) +  0.91202;
                outputArray[j][1] = tempArray[j][0] * Math.exp(-T/Q);  //solar radiation after traveling through atmosphere (including "Trübungsfaktor")
                tempArray[j][1] = outputArray[j][1]; //solar radiation after traveling through atmosphere (including "Trübungsfaktor")
                tempArray[j][2] = outputArray[j][1]* 0.53 - 0.34 * Math.atan(5.5 * solConst/outputArray[j][1] - 3.16); //diffuse solar radiation

                var tilt = Math.sin((90 - inputArray[j][1]) * toRad) * Math.cos(moduleTilt * toRad) + Math.cos((90 - inputArray[j][1]) * toRad) * Math.cos((moduleAzi - azi) * toRad) * Math.sin(moduleTilt * toRad);
                tempArray[j][3] = tempArray[j][1] * ((tilt)/Math.sin(inputArray[j][1] * toRad)); //Radiation on tilted surface
                // console.log('Azi: ' + azi + ', Höhe: ' + inputArray[i][1] + ', Rad: ' + tempArray[i][1] + ', tilt: ' + tilt + ', sin h: ' + Math.sin(inputArray[i][1] * toRad) + ' ==> Result: ' + tempArray[i][3] );
                tempArray[j][4] = tempArray[j][2] * ((1 + Math.cos(moduleAzi * toRad))/2);
                outputArray[j][1] = tempArray[j][3] + tempArray[j][4];
            }
        }
    }
    // console.log(tempArray);
    // console.log(tempArraytest);
    // console.log(inputArray);
}

/**
* The user has the possibility to download a selected calculated dataseries. This feature and possible
* other future user options can be collected in an options area.
* This function only supports one feature at the moment: download of dataseries. All available dataseries names are
* places as item in the dropdown.
*/
function prepareOptionsBox(){
    console.log('Function prepareOptionsBox');
    var pvOptionBox = document.getElementById("pvOptionsDropdown");
    
    for(i = 0; i < dataArrays.length; i++){
        var newElement = document.createElement("a");
        newElement.setAttribute('class', 'dropdown-item');
        newElement.setAttribute('id', 'item_' + i);
        newElement.setAttribute('href', '#');
        newElement.setAttribute('onclick', 'setDropdownItemActive(this)');
        newElement.innerHTML = dataArrays[i];
        pvOptionBox.appendChild(newElement);
    }
}

/**
 * The user has the possibility to download a selected calculated dataseries. 
 * This function looks for the selected (active) dropdown-item and prepares the download (filetype, linebreak, insert header).
 */
function getCSVDownload(){
    console.log('Function getCSVDownload');

    if(this.document.getElementsByClassName("dropdown-item active").length == 0){
        alert('Bitte zuerst eine Zeitreihe auswählen.');
   }else{
        var drowpdownItemId = this.document.getElementsByClassName("dropdown-item active")[0].id;
        var csvContent;

        var arrayNr = drowpdownItemId.split('_')[1];
        var arrayHeader;
        if(arrayNr == 0 || arrayNr == 1 || arrayNr == 2){
            arrayHeader = dataArraysHeader[0].join(';');
        }else if(arrayNr == 3 || arrayNr == 4 || arrayNr == 5){
            arrayHeader = dataArraysHeader[1].join(';');
        }else if(arrayNr == 6 || arrayNr == 7 || arrayNr == 8){
            arrayHeader = dataArraysHeader[2].join(';');
        }else if(arrayNr == 9){
            arrayHeader = dataArraysHeader[3].join(';');
        }
        var cnt = 0;
        dataArraysData[arrayNr].forEach(function(rowArray) {    //add the prepared header in the first row, so that the data in the exported csv makes more sense
            if(cnt == 0){
                csvContent = arrayHeader + "\r\n";
            }

            /*if a marker has been set there is an object in the array that needs to be
            removed, because the join-function can't work with object*/
            if('marker' in rowArray){
                // console.log('Object found. Prepare for Download.');
                rowArray = [rowArray.x, rowArray.y];
                console.log(rowArray);
            }
            row = rowArray.join(";");
            csvContent += row + "\r\n";    
            cnt++;
        });
        var csvData = new Blob([csvContent], { type: 'text/csv' }); 
        var csvUrl = URL.createObjectURL(csvData);
        window.open(csvUrl);
    }
}

function serverReq(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhr.response);
        }
    };
    xhr.onerror = function () {
        alert("Request failed");
    };
 
    xhr.open('GET', url, 'true');
    xhr.send();
   
}

/** 
* Prefered way to show solar information (besides the governgovernment/rechenzentrum/voibosment): 
getHorizon(), calculateSunPath() and printChart() prepare the previously saved (app/data) shading*.csv files, calculate
the suns path and
*/
function getHorizon(cityname) {
    console.log('cityname: ' + cityname);
    var urlHorizon = '/horizon?city=' + cityname;
    serverReq(urlHorizon, prepareChart);
}


function getCorrectedIndex(inputData, i){
    // console.log('Function getCorrectedIndex');

    var dataArray = JSON.parse(JSON.stringify(inputData));
    var indexMatchSun;
    var aziArea;
    var aziSun;
    var aziMatchSun;

    if('marker' in dataArray[2].data[i]){
        // console.log('Object found.');
        // console.log(dataArray[2].data[i]);
        dataArray[2].data[i] = [dataArray[2].data[i].x, dataArray[2].data[i].y];

    }
    aziArea = dataArray[1].data[i][0];
    aziSun = dataArray[2].data[i][0];
    // console.log('aziArea: ' + aziArea + ', aziSun: ' + aziSun);

    if(aziSun > aziArea){
        for(n = 0; i - n >= 0; n++){
            if((dataArray[2].data[i-n][0] <= dataArray[1].data[i][0])){
                indexMatchSun = i - n;
                aziMatchSun = dataArray[2].data[i-n][0];
                if(Math.abs(aziMatchSun - aziArea) > Math.abs(dataArray[2].data[i][0] - aziArea)){
                    indexMatchSun = i;
                    aziMatchSun = dataArray[2].data[i][0];
                }
                break;
            }else if ((i - n) <= 0){
                indexMatchSun = i;
                aziMatchSun = dataArray[2].data[i][0];
            }
        }
    }else if(aziSun < aziArea){
        for(n = 0; i + n <= dataArray[2].data.length; n++){
            if(dataArray[2].data[i+n][0] <= dataArray[1].data[i][0]){
                indexMatchSun = i + n;
                aziMatchSun = dataArray[2].data[i+n][0];
                if(Math.abs(aziMatchSun - aziArea) > Math.abs(dataArray[2].data[i][0] - aziArea)){
                    indexMatchSun = i;
                    aziMatchSun = dataArray[2].data[i][0];
                }
                break;
            }
        }
    }else if(aziSun == aziArea){
        indexMatchSun = i;
        aziMatchSun = dataArray[2].data[i][0];
    }
    return indexMatchSun;
}

