import React, { useReducer, useState } from 'react'
import { weatherDetailReducer, initialWeatherDetailState } from '../../../reducer/weatherDetailsReducer'
import styles from './weatherDetailsModal.module.scss'
import { IGetWeatherDetailsRequestDTO } from '../../../dto/request/GetWeatherDetailsRequestDTO'
import { WeatherApi } from '../../../api/weatherApi'
import { IGetWeatherDetailsResponseDTO } from '../../../dto/response/GetWeatherDetailsResponseDTO'
import useErrorToast from '../../../utils/hooks/toast'
import WeatherDetailsCard from './WeatherDetailsCard/daily/WeatherDetailsDailyCard';
interface WeatherDetailsModalProps{
    onClose: () => void
    userData: IGetWeatherDetailsRequestDTO
}



const WeatherDetailsModal: React.FC<WeatherDetailsModalProps> = ({onClose, userData}) => {
    const {handleError} = useErrorToast()
    const [weatherDetailState, weatherDetailDispatch] = useReducer(weatherDetailReducer, initialWeatherDetailState)
    const [selectedDay, setSelectedDay] = useState<Date>(new Date(Date.now()))
    const fetchWeatherDetails = async () => {
        try {
            weatherDetailDispatch({type: 'FETCH_WEATHER_START'})
            const weatherApi = new WeatherApi()
            const weatherData: IGetWeatherDetailsResponseDTO = (await weatherApi.getWeatherDetails(userData))
            weatherDetailDispatch({type: 'FETCH_WEATHER_SUCCESS', payload: weatherData})
        } catch (error) {
            handleError(error)
            weatherDetailDispatch({type:'FETCH_WEATHER_FAILURE', payload: (error as string)})
        }
    }


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img style={{cursor: 'pointer'} } onClick={onClose} src="/small/close.png" alt="Close" width={16} height={16} />
        {weatherDetailState.weatherData?.daily.time.map(time => (
            <p></p>
        ))}
      </div>
    </div>
  )
}

export default WeatherDetailsModal
