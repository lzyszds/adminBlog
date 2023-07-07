export interface NowWeatherData {
  token: string,
  ip: string,
  region: string,
  tags: [],
  beijingTime: Date,
  weatherData: IWeather
}

export interface IWeather {
  humidity: Number | String
  pm25: Number | String
  rainfall: Number | String
  region: String
  temperature: Number | String
  updateTime: String
  visibility: String
  weather: String
  windDirection: String
  windPower: Number | String
}
