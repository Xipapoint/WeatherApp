import React, { memo } from 'react'
import styles from './weatherDetailsHourlyCard.module.scss'
import Temperature from '../../../../Temperature/Temperature';
interface WeatherDetailsHourlyCardProps {
  key: number
  time: Date;
  temperature: number;
  rain: number;
  snowfall: number;
  cloudCover: number;
  windDirection: number;
}

const getWeatherIcon = (weather: {
  rain: number;
  snowfall: number;
  cloudCover: number;
}): string => {
  const { rain, snowfall, cloudCover } = weather;
  if (snowfall > 0) return '/large/snow.png';
  if (rain > 0) return '/large/rain_large.png';
  if(cloudCover >= 10 && cloudCover <= 60){
    return '/large/cloudy_large.png'
  } else if(cloudCover > 60) return '/large/heavy_cloudy.png'

  return '/large/sun_large.png'
}

const WeatherDetailsHourlyCard: React.FC<WeatherDetailsHourlyCardProps> = ({
  key,
  time,
  temperature,
  rain,
  snowfall,
  cloudCover,
  windDirection,
}) => {

  return(
    <div key={key} className={styles.hourlyCard} style={{ marginBottom: '8px' }}>
      <p>Time: {time.getHours()}:00</p>
      <img src={getWeatherIcon({rain, snowfall, cloudCover})} alt="" width={40} height={40} />
      <Temperature>Temperature: {temperature.toFixed(1)}°</Temperature>
      <p>Wind Direction: {Math.round(windDirection)}°</p>
  </div>
  )
}


export default memo(WeatherDetailsHourlyCard);