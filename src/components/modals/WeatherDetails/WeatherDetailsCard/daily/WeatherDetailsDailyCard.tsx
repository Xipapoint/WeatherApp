import React from 'react'
import styles from './weatherDetailsCard.module.scss'
interface WeatherDetailsDailyCardProps {
  date: Date
  maxTemperature: string | undefined
  minTemperature: string | undefined
  sunrise: number | undefined
  sunset: number | undefined
  setDate: (time: Date) => void
  imgSrc: string
}

const WeatherDetailsDailyCard: React.FC<WeatherDetailsDailyCardProps> = ({
  date,
  maxTemperature,
  minTemperature,
  setDate,
  imgSrc
}) => {
  const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  return (
    <div className={styles.dailyCard} onClick={() => setDate(date)}>
      <div className={styles.date}>
        <p>{dayOfWeek}</p>
        <p style={{fontSize: '20px'}}><strong>{day}</strong></p>
        <p>{month}</p>
      </div>
      <img src={imgSrc} alt="" width={30} height={30} />
      <div className={styles.temp}>
        <p>Max: <strong style={{fontSize: '14px'}}>{maxTemperature}°</strong></p>
        <p>Min: <strong style={{fontSize: '14px'}}>{minTemperature}°</strong></p>

      </div>
  </div>
  )
}


export default WeatherDetailsDailyCard;