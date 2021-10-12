class Weather {
      api = {
            linkWeather: "http://api.openweathermap.org/data/2.5/weather?",
            keyWeather: "7955c4c4cf116944ef187df998882b94",
            linkPictures: "https://www.flickr.com/services/rest?",           
            keyPictures: "b905e87b9b552b09892ef69884dcfaf9",
      };
      domElements = {
            searchBox: document.querySelector('#serch-box'),
            city: document.querySelector('#city'),
            date: document.querySelector('#date'),
            weather: document.querySelector('#weather'),
            celsius: document.querySelector('.celsius'),
            minTemp: document.querySelector('#minTemp'),
            maxTemp: document.querySelector('#maxTemp'),
            background : document.querySelector('body'),
      };
      
      async forWeather(cityName) {
            try{
                  const responseForWeather = await fetch(`${this.api.linkWeather}q=${cityName}&lang=en&appid=${this.api.keyWeather}`);
                  const dataForWeather = await responseForWeather.json();

                  this.domElements.weather.textContent = dataForWeather.weather[0].description;

                  this.domElements.city.textContent = this.domElements.searchBox.value.toUpperCase();

                  this.domElements.celsius.textContent = Math.round(dataForWeather.main.temp - 273.15) ;
                  this.domElements.minTemp.textContent = Math.round(dataForWeather.main.temp_min - 273.15);
                  this.domElements.maxTemp.textContent = Math.round(dataForWeather.main.temp_max - 273.15);
                  
                  const date = new Date();
                  const localTime = date.getTime();
                  const localOffset = date.getTimezoneOffset() * 60000;
                  let utc = localTime + localOffset;
                  let atlanta = utc + (dataForWeather.timezone * 1000);
                  const dateForAllCountry = new Date(atlanta).toDateString();
                  this.domElements.date.textContent = dateForAllCountry;

                  this.domElements.searchBox.style.color = 'black';
                  this.domElements.city.style.color = 'white';
                  this.domElements.searchBox.value = '';

                  let descriptionSky = dataForWeather.weather[0].main;
                  return descriptionSky;
            }
            catch(errorWeather){
                  console.error(errorWeather);
                  this.domElements.searchBox.value = 'error wrong name';
                  this.domElements.city.textContent = 'error wrong name';
                  this.domElements.searchBox.style.color = 'red';
                  this.domElements.city.style.color = 'red';
            }
      }
      async forPictures(valueOfSearchbox) {
            try{
                  let changePromiseToValue = () => {
                        this.forWeather(this.domElements.searchBox.value).then(descriptionSky => { return descriptionSky });
                  };
                  changePromiseToValue()

                  const responseForPictures = await fetch(`${this.api.linkPictures}
                  method=flickr.photos.search&format=json&nojsoncallback=1&page=
                  ${Math.floor(Math.random() * 10)}&per_page=${Math.floor(Math.random() * 10)}
                  &tags=${valueOfSearchbox}
                  &api_key=${this.api.keyPictures}`);

                  const dataForPictures = await responseForPictures.json();

                  let farm = dataForPictures.photos.photo[0].farm;
                  let server = dataForPictures.photos.photo[0].server;
                  let id = dataForPictures.photos.photo[0].id;
                  let secret = dataForPictures.photos.photo[0].secret; 
                  let size = 'b';

                  let url = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.png`;
                  return this.domElements.background.style.backgroundImage = `url(${url})`;
            }
            catch(errorPictures){
                  console.error(errorPictures);
                  this.domElements.background.style.backgroundImage = `url(./img/ASpot_Weather.jpg)`;
            };
      };
};
const weatherApi = new Weather();
weatherApi.domElements.searchBox.addEventListener('keypress', click);
function click(event){
      if(event.keyCode == 13 && weatherApi.domElements.searchBox.value !== ''){
            weatherApi.forPictures(weatherApi.domElements.searchBox.value);
      };
};