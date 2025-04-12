# Tesseract
### A Chrome Extension Dashboard Homepage.
## Description:
An elegant chrome extension dashboard which incorporates several widgets like Analog clock, calendar, weather,
Gmap, Music-Player, to-do list, stocks. Bootstrap is also used to apply quick styles, I have used bootstrap grid to contain the widgets so that it
can be responsive, container-fluid class is also used to contain and aligned the elements inside, row class is used to keep the widget in a row.
All of these feature's source code is given assets folder or directly in the index.html (Which uses iframe). All the APIs mentioned below are open-source(does not require to create an key explicitly for a particular user or developer) and every features are being handled at the client side, this chrome extension does not rely on any complex backend features. You can also set a video file as a background apart from image file like jpeg, gif etc. This project does not collects any user data as it completely relies on the client side handling. However it does contain some third party open source APIs which may collect the data
if mentioned at their privacy policy.

#### Analog Clock
It is just a simple anal;og clock made with html, css and js. This clock
comprises numbers to mark time, it is created and embedded dynamically using js by calculating angles.
It also has three hands for hours, minutes and seconds. Seconds hand rotates every second by a certain degree, minutes and hour
hands depend upon seconds hand for it's rotation angle. It's style is applied from the clock.css which you will find it in the assets folder and it's
functionality is applied from clock.js which is also at the assets folder. This element is contained inside col-3 class which is a bootstrap grid.

#### Calendar
It is created dynamically using js, a very simple yet elegant design. It shows month name atop and current date is also marked. This element is contained inside
col-3 class which is a bootstrap grid.

#### Weather Widget
It is created with help of js, weather.js script calculates the location via geolocation IP address. Geolocation returns longitude and latitude coordinates, js functions determines the weather condition for this returned coordinates using Open-Meteo API. It shows several other informations like AQI,humidity, feels Like temperature, hourly and weekly forecast. This element is contained inside
col-3 class which is a bootstrap grid.

#### Map
It is embedded via Gmap which requires map.js script to work. It also locates the device using geolocation IP address. This element is contained inside
col-3 class which is a bootstrap grid.

#### Music-Player
It uses jiosaavn unofficial api to fetch music, it's default player controls is hidden and a customized player controls is used to work. This element is contained inside col-4 class which is a bootstrap grid.

#### To-do List
It is created using html, css and js. This element is contained inside col-3 class which is a bootstrap grid. This element is contained inside col-4 class which is a bootstrap grid. To store the tasks it uses localstorage as they are just texts so indexedDB is not required.

#### Stocks widget
This reflects the price dynamically using the tradingview chart provided via iframe directly it also does not requrie external js file. This element is contained inside col-4 class which is a bootstrap grid.

#### Background Changer
It is a button to change the background. You can set a video file as a background. To store the background files it uses indexedDB instead of localstorage
as for videos it requires large storage capacity which is not availabe in localstorage.

## How to Use
1. Download All the files.
2. In chrome go to manage extension an enable developer mode.
3. Click on the load unpacked.
4. Select the directory where the manifest.json is present.
5. Click on new tab and you will find it there.


Note: I created this project alone, it was not a group project. However, I had used AIs like chatGPT and Deepseek, to increase the pace and productivity.

