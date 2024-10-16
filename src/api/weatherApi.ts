import { fetchWeatherApi } from "openmeteo"
import { IGetWeatherForCardRequestDTO } from "../dto/request/GetWeatherForCardRequestDTO"
import { IGetWeatherForCardResponseDTO } from "../dto/response/GetWeatherForCardResponseDTO"
import { IGetWeatherDetailsResponseDTO } from "../dto/response/GetWeatherDetailsResponseDTO"

export class WeatherApi {
    private weatherApiUrl: string
    constructor() {
        this.weatherApiUrl = "https://api.open-meteo.com/v1/forecast"
    }

    public async getWeatherForCard(weatherDTO: IGetWeatherForCardRequestDTO): Promise<IGetWeatherForCardResponseDTO[]> {
        const params = {
            "latitude": weatherDTO.lat,
	        "longitude": weatherDTO.long,
            "current": ["temperature_2m", "is_day", "rain", "snowfall", "cloud_cover"],
            "daily": ["temperature_2m_max", "temperature_2m_min"]
        }
        console.log("params in weather for card: ", params);
        
        const responses = await fetchWeatherApi(this.weatherApiUrl, params)
        console.log("responses in weather for card: ", responses);
        
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);  

        const weathersData: IGetWeatherForCardResponseDTO[] = [] 
        responses.forEach(response => {
            const utcOffsetSeconds = response.utcOffsetSeconds();

            const current = response.current()!;
            const daily = response.daily()!;

            const weatherData: IGetWeatherForCardResponseDTO = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    isDay: current.variables(1)!.value(),
                    rain: current.variables(2)!.value(),
                    snowfall: current.variables(3)!.value(),
                    cloudCover: current.variables(4)!.value()
                },
                daily: {
                    time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                    temperature2mMax: daily.variables(0)!.valuesArray()!,
                    temperature2mMin: daily.variables(1)!.valuesArray()!,
                },
            }
            weathersData.push(weatherData)
        });
        return weathersData
    }

    public async getWeatherDetails(weatherDTO: IGetWeatherForCardRequestDTO): Promise<IGetWeatherDetailsResponseDTO>{
        const params = {
            "latitude": weatherDTO.lat,
	        "longitude": weatherDTO.long,
            "hourly": ["temperature_2m", "rain", "snowfall", "cloud_cover", "wind_direction_10m"],
            "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"]
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
        

        const weathersData: IGetWeatherDetailsResponseDTO[] = [] 
        responses.forEach(response => {
            const utcOffsetSeconds = response.utcOffsetSeconds();
        
        const hourly = response.hourly()!;
        const daily = response.daily()!;
        
        
        const weatherData: IGetWeatherDetailsResponseDTO = {
        
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                rain: hourly.variables(1)!.valuesArray()!,
                snowfall: hourly.variables(2)!.valuesArray()!,
                cloudCover: hourly.variables(3)!.valuesArray()!,
                windDirection10m: hourly.variables(4)!.valuesArray()!,
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2mMax: daily.variables(0)!.valuesArray()!,
                temperature2mMin: daily.variables(1)!.valuesArray()!,
                sunrise: daily.variables(2)!.valuesArray()!,
                sunset: daily.variables(3)!.valuesArray()!,
            },
        
        };
        weathersData.push(weatherData)
        })
        return weathersData[0]
    }
}