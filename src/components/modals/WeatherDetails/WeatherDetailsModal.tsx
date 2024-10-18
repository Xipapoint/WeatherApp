import React, { useEffect, useReducer, useState } from 'react'
import { weatherDetailReducer, initialWeatherDetailState } from '../../../reducer/weatherDetailsReducer'
import styles from './weatherDetailsModal.module.scss'
import { IGetWeatherDetailsRequestDTO } from '../../../dto/request/GetWeatherDetailsRequestDTO'
import { WeatherApi } from '../../../api/weatherApi'
import { IGetWeatherDetailsResponseDTO } from '../../../dto/response/GetWeatherDetailsResponseDTO'
import WeatherDetailsDailyCard from './WeatherDetailsCard/daily/WeatherDetailsDailyCard'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import WeatherDetailsHourlyCard from './WeatherDetailsCard/hourly/WeatherDetailsHourlyCard'
import { IGetRandomUserResponseDTO } from '../../../dto/response/GetRandomUserResponseDTO'
interface WeatherDetailsModalProps{
    onClose: () => void
    userData: IGetWeatherDetailsRequestDTO
    getNextUser: (index: number) => IGetRandomUserResponseDTO | undefined
    index: number
}



const WeatherDetailsModal: React.FC<WeatherDetailsModalProps> = ({onClose, userData, getNextUser, index}) => {
  const [weatherDetailState, weatherDetailDispatch] = useReducer(weatherDetailReducer, initialWeatherDetailState)
  const [userIndex, setUserIndex] = useState(index)
  const [useUserData, setUseUserData] = useState(userData)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(Date.now()))
  const fetchWeatherDetails = async () => {
    try {
          console.log("user data in modal: ", userData);
          weatherDetailDispatch({type: 'FETCH_WEATHER_START'})
          const weatherApi = new WeatherApi()
          console.log("starting fetching");
          
          const weatherData: IGetWeatherDetailsResponseDTO = await weatherApi.getWeatherDetails(useUserData)
          console.log("weather data for modal: ", weatherData);
          
          weatherDetailDispatch({type: 'FETCH_WEATHER_SUCCESS', payload: weatherData})
        } catch (error) {
          weatherDetailDispatch({type:'FETCH_WEATHER_FAILURE', payload: (error as string)})
        }
      }
      
      const filterHourlyDataBySelectedDay = () => {
        if(!weatherDetailState?.weatherData){
          return
        }
        if(!weatherDetailState?.weatherData?.hourly){
          return
        }
        const { hourly } = weatherDetailState.weatherData
        return hourly.time
        .map((hourlyTime, index) => ({
          time: hourlyTime,
          temperature: hourly.temperature2m[index],
          rain: hourly.rain[index],
          snowfall: hourly.snowfall[index],
          cloudCover: hourly.cloudCover[index],
          windDirection: hourly.windDirection10m[index],
        }))
        .filter((hour, index) => new Date(hour.time).toDateString() === selectedDay.toDateString() && index % 3 === 0)
      }

      const getWeatherIcon = (index: number): string => {
        const { rain, snowfall, cloudCover } = weatherDetailState.weatherData!.hourly;
        if (snowfall[index] > 0) return '/large/snow.png';
        if (rain[index] > 0) return '/large/rain_large.png';
        if(cloudCover[index] >= 10 && cloudCover[index] <= 60){
          return '/large/cloudy_large.png'
        } else if(cloudCover[index] > 60) return '/large/heavy_cloudy.png'
        return '/large/sun_large.png'
      }
      useEffect(() => {
        fetchWeatherDetails()
      }, [useUserData])
    useEffect(() => {

      filterHourlyDataBySelectedDay()
    },[selectedDay])

    const handleGetPreviousUser = () => {
      if(userIndex - 1 < 0) return
      const user = getNextUser(userIndex - 1)
      if(!user) return
      setUserIndex(userIndex => userIndex += 1)
      setUseUserData(user.location.coordinates)
    }
    const handleGetNextUser = () => {
      const user = getNextUser(userIndex + 1)
      if(!user) return
      setUserIndex(userIndex => userIndex += 1)
      setUseUserData(user.location.coordinates)
    }
    

  return (
    <div className={styles.overlay}>
      <img className={styles.arrow} onClick={handleGetPreviousUser} src="/large/left-arrow.PNG" alt="" width={128} height={128} />
      <div className={styles.modal}>
        <img style={{cursor: 'pointer'} } onClick={onClose} src="/small/close.png" alt="Close" width={16} height={16} />
        <div className={styles.daily}>

          {weatherDetailState.weatherData?.daily.time.map((time, index) => (
            <WeatherDetailsDailyCard
              key={index}
              date={time}
              maxTemperature={weatherDetailState.weatherData?.daily.temperature2mMax[index].toFixed(1)}
              minTemperature={weatherDetailState.weatherData?.daily.temperature2mMin[index].toFixed(1)}
              sunrise={ -1}
              sunset={-1}
              setDate={() => setSelectedDay(time)}
              imgSrc={getWeatherIcon(index)}
              selectedDay={selectedDay}
              />
            ))}
          </div>

        <h4>Hourly Data for {selectedDay.toDateString()}:</h4>
        <div className={styles.hourly}>
          {filterHourlyDataBySelectedDay()?.map((hour, index) => (
            <WeatherDetailsHourlyCard key={index} {...hour} />
          ))}

        </div>
      </div>
      <img onClick={handleGetNextUser} className={styles.arrow} src="/large/right-arrow.png" alt="" width={128} height={128} />
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </div>
  )
}

export default WeatherDetailsModal
