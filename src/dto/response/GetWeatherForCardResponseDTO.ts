export interface IGetWeatherForCardResponseDTO {
    current: {
        time: Date,
        temperature2m: number,
        rain: number,
        snowfall: number,
        isDay: number,
        cloudCover: number
    },
    daily: {
        time: Date[],
        temperature2mMax: Float32Array,
        temperature2mMin: Float32Array,
    },
}