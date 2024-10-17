import React from 'react'

interface WeatherDetailsHourlyCardProps {
  time: Date;
  temperature: number;
  rain: number;
  snowfall: number;
  cloudCover: number;
  windDirection: number;
}

const WeatherDetailsHourlyCard: React.FC<WeatherDetailsHourlyCardProps> = ({
  time,
  temperature,
  rain,
  snowfall,
  cloudCover,
  windDirection,
}) => (
  <div style={{ marginBottom: '8px' }}>
    <p>Time: {time.toLocaleTimeString()}</p>
    <p>Temperature: {temperature}°C</p>
    <p>Rain: {rain} mm</p>
    <p>Snowfall: {snowfall} mm</p>
    <p>Cloud Cover: {cloudCover}%</p>
    <p>Wind Direction: {windDirection}°</p>
  </div>
);

export default WeatherDetailsHourlyCard;