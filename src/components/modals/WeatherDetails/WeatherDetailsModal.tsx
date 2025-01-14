import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { weatherDetailReducer, initialWeatherDetailState } from '../../../reducer/weatherDetailsReducer'
import styles from './weatherDetailsModal.module.scss'
import { IGetWeatherDetailsRequestDTO } from '../../../dto/request/GetWeatherDetailsRequestDTO'
import { WeatherApi } from '../../../api/weatherApi'
import { IGetWeatherDetailsResponseDTO } from '../../../dto/response/GetWeatherDetailsResponseDTO'
import WeatherDetailsDailyCard from './WeatherDetailsCard/daily/WeatherDetailsDailyCard'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WeatherDetailsHourlyCard from './WeatherDetailsCard/hourly/WeatherDetailsHourlyCard'
import Image from '../../Image/Image'
import { useModal } from '../../../utils/hooks/useModal'
import UserInfoModal from '../UserInfoModal/UserInfoModal'
import { useUserDataContext } from '../../../context/UserDataContext'
interface WeatherDetailsModalProps{
    onClose: () => void
    userData: IGetWeatherDetailsRequestDTO
    // getNextUser: (index: number) => IGetRandomUserResponseDTO | undefined
    index: number
    name: {
      title: string
      first: string
      last: string
    }
    location: {
      country: string
      city: string
    }
    coordinates: {
      latitude: string
      longitude: string
    }
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    }
}

const WeatherDetailsModal: React.FC<WeatherDetailsModalProps> = ({onClose, name, location, coordinates, picture, index}) => {
  const { getUserByIndex } = useUserDataContext()
  const [weatherDetailState, weatherDetailDispatch] = useReducer(weatherDetailReducer, initialWeatherDetailState)
  const [userIndex, setUserIndex] = useState(index)
  const [useUserData, setUseUserData] = useState(coordinates)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(Date.now()))
  // const [isDropped, setIsDropped] = useState(false)
  const [username, setUsername] = useState(name)

  const { openModal, closeModal, isModalOpen, modalContent } = useModal()

  const fetchWeatherDetails = useCallback(async () => {
    try {
          weatherDetailDispatch({type: 'FETCH_WEATHER_START'})

          const weatherApi = new WeatherApi()
          const weatherData: IGetWeatherDetailsResponseDTO = await weatherApi.getWeatherDetails(coordinates) 
                   
          weatherDetailDispatch({type: 'FETCH_WEATHER_SUCCESS', payload: weatherData})
        } catch (error) {
          weatherDetailDispatch({type:'FETCH_WEATHER_FAILURE', payload: (error as string)})
        }
      }, [coordinates])
      
      const filterHourlyDataBySelectedDay = useCallback(() => {
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
      }, [selectedDay, weatherDetailState.weatherData])

      const getWeatherIcon = useCallback((index: number): string => {
        const { rain, snowfall, cloudCover } = weatherDetailState.weatherData!.hourly

        if (snowfall[index] > 0) return '/large/snow.png'
        if (rain[index] > 0) return '/large/rain_large.png'

        if(cloudCover[index] >= 10 && cloudCover[index] <= 60){
          return '/large/cloudy_large.png'
        } else if(cloudCover[index] > 60) return '/large/heavy_cloudy.png'
        return '/large/sun_large.png'

      }, [weatherDetailState.weatherData])

      const handleSetDate = useCallback(
        (time: Date) => {
          setSelectedDay(time);
        },
        [setSelectedDay]
      );


      useEffect(() => {
        fetchWeatherDetails()
      }, [useUserData, fetchWeatherDetails])

      useEffect(() => {
        filterHourlyDataBySelectedDay()
      },[selectedDay, filterHourlyDataBySelectedDay])

    const handleGetPreviousUser = useCallback(() => {
      if(userIndex - 1 < 0) return

      const user = getUserByIndex(userIndex - 1)
      if(!user) return

      setUserIndex(userIndex => userIndex += 1)
      setUseUserData(user.location.coordinates)
      setSelectedDay(new Date(Date.now()))
      setUsername(user.name)

    }, [getUserByIndex, userIndex])

    const handleGetNextUser = useCallback(() => {
      const user = getUserByIndex(userIndex + 1)
      if(!user) return
      
      setUserIndex(userIndex => userIndex += 1)
      setUseUserData(user.location.coordinates)
      setSelectedDay(new Date(Date.now()))
      setUsername(user.name)

    }, [getUserByIndex, userIndex])

    const openInfo = useCallback(() => {
      openModal(
      <UserInfoModal 
        title={name.title} 
        first={name.first} 
        last={name.last} 
        country={location.country} 
        city={location.city} 
        src={picture.thumbnail}
        srcSet={picture.large}
        alt={name.first + name.last}
        width={64}
        height={64}
      />
    )
    }, [name, location, openModal, picture])


    const WeatherDetails = useMemo(() => {
      return (
         weatherDetailState.weatherData?.daily.time.map((time, index) => (
          <WeatherDetailsDailyCard
            key={Number(time.toString())}
            date={time}
            maxTemperature={weatherDetailState.weatherData?.daily.temperature2mMax[index].toFixed(1)}
            minTemperature={weatherDetailState.weatherData?.daily.temperature2mMin[index].toFixed(1)}
            sunrise={ -1}
            sunset={-1}
            setDate={handleSetDate}
            imgSrc={getWeatherIcon(index)}
            selectedDay={selectedDay.getDay() === time.getDay()}
            />
          )))
      },
      [
        selectedDay, 
        getWeatherIcon, 
        weatherDetailState.weatherData?.daily.time, 
        weatherDetailState.weatherData?.daily.temperature2mMax, 
        weatherDetailState.weatherData?.daily.temperature2mMin,
        handleSetDate
      ]
      )
    

  return (
    <div className={styles.overlay}>
      <img className={styles.arrow} onClick={handleGetPreviousUser} src="/large/left-arrow.PNG" alt="" width={128} height={128} />
      <div className={styles.modal}>
        <img style={{cursor: 'pointer'} } onClick={onClose} src="/small/close.png" alt="Close" width={16} height={16} />
        <div className={styles.user}>
          <h2>{username.title}. {username.first} {username.last}</h2>
          <Image
            src={'/small/information.png'}
            alt='information'
            width={16}
            height={16}
            onMouseEnter={openInfo}
            onMouseLeave={closeModal}
            
          />
          {isModalOpen && modalContent}
        </div>

        <div className={styles.daily}>
          {WeatherDetails}
        </div>

        <h4>Hourly Data for {selectedDay.toDateString()}:</h4>
        <div className={styles.hourly}>
          {filterHourlyDataBySelectedDay()?.map((hour, index) => (
            <WeatherDetailsHourlyCard key={index} {...hour} />
          ))}
        </div>
      </div>
      <img className={styles.arrow} onClick={handleGetNextUser} src="/large/right-arrow.png" alt="" width={128} height={128} />
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

export default memo(WeatherDetailsModal)
