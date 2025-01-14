import React, { memo } from 'react'
import styles from './weatherDetailsCard.module.scss'
import Temperature from '../../../../Temperature/Temperature'
interface WeatherDetailsDailyCardProps {
  key: number,
  date: Date
  maxTemperature: string | undefined
  minTemperature: string | undefined
  sunrise: number | undefined
  sunset: number | undefined
  setDate: (time: Date) => void
  imgSrc: string
  selectedDay: boolean
}

const WeatherDetailsDailyCard: React.FC<WeatherDetailsDailyCardProps> = ({
  key,
  date,
  maxTemperature,
  minTemperature,
  setDate,
  imgSrc,
  selectedDay
}) => {
  const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  return (
    <div key={key} className={`${styles.dailyCard} ${ selectedDay ? styles.box_dark : ''}`} onClick={() => {
      setDate(date)
    }}>
      <div className={styles.date}>
        <p>{dayOfWeek}</p>
        <p style={{fontSize: '20px'}}><strong>{day}</strong></p>
        <p>{month}</p>
      </div>
      <img src={imgSrc} alt="" width={30} height={30} />
      <div className={styles.temp}>
        <Temperature>Max: <strong style={{fontSize: '14px'}}>{maxTemperature}°</strong></Temperature>
        <Temperature>Min: <strong style={{fontSize: '14px'}}>{minTemperature}°</strong></Temperature>
      </div>
  </div>
  )
}


export default memo(WeatherDetailsDailyCard);