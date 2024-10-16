export interface IGetWeatherDetailsResponseDTO{
    hourly: {
        time: Date[];
        temperature2m: Float32Array;
        rain: Float32Array;
        snowfall: Float32Array;
        cloudCover: Float32Array;
        windDirection10m: Float32Array;
    };
    daily: {
        time: Date[],
        temperature2mMax: Float32Array,
        temperature2mMin: Float32Array,
        sunrise: Float32Array,
        sunset: Float32Array,
    },
}