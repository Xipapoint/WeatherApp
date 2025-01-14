import { IGetWeatherForCardResponseDTO } from "../../../dto/response/GetWeatherForCardResponseDTO"
import styles from './userCard.module.scss'
import useWindowSize from "../../../utils/hooks/useWindowSize";
import { useModal } from "../../../utils/hooks/useModal";
import WeatherDetailsModal from "../../modals/WeatherDetails/WeatherDetailsModal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { memo, useCallback } from "react";
import Temperature from "../../Temperature/Temperature";
import UserInfo from "../../UserInfo/UserInfo";
import Image from "../../Image/Image";

const getWeatherIcon = (weather: {
  temperature2m: number;
  rain: number;
  snowfall: number;
  isDay: number;
  cloudCover: number;
}): string => {
  const { rain, snowfall, isDay, cloudCover } = weather;
  if (snowfall > 0) return '/large/snow.png';
  if (rain > 0) return '/large/rain_large.png';
  if (cloudCover >= 10 && cloudCover <= 60) {
    if (!isDay) return '/large/night_cloudy.png'
    return '/large/cloudy_large.png'
  } else if (cloudCover > 60) return '/large/heavy_cloudy.png'

  if (!isDay) return '/large/moon.png';
  return '/large/sun_large.png'
}


type User = {
  gender: string;
  name: string;
  location: string;
  id: { value: string };
  coordinates: { lat: number; lon: number };
  picture: string;
};


interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
    userKey: number,
    gender: string,
    userId: {
      name: string
      value: string | null
    }
    name: {
      title: string
      first: string
      last: string
    },
    location: {
      country: string
      city: string
    },
    coordinates: {
      latitude: string
      longitude: string
    }
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    }
    email: string
  weather?: IGetWeatherForCardResponseDTO | null;
  // getNextUser: (index: number) => IGetRandomUserResponseDTO | undefined
}
const UserCard: React.FC<UserCardProps> = ({ gender, name, location, userId, coordinates, picture, weather, userKey, ...props }) => {
  // const { gender, name, location, id, coordinates, picture, weather, userKey } = useUserCardDataContext()

  const { isModalOpen, openModal, closeModal, modalContent } = useModal();
  const { width } = useWindowSize(500)
  
  const weatherIconSize = width <= 480 ? 64 : 90
  const userIconSize = 128

  const {setItem, getItem} = useLocalStorage()

  const handleSaveUser = useCallback(() => {
    const users = getItem('users')
    if(!users) {
      setItem('users', [{gender, name, location, userId, coordinates, picture}])
      setItem('weathers', [weather])
      return
    } 

    const weathers = getItem('weathers')!

    const parsedUsers = JSON.parse(users) as Array<User>

    parsedUsers.forEach(parsedUser => {
      if(JSON.stringify(parsedUser) === JSON.stringify({gender, name, location, userId, coordinates, picture})) return
    })

    const newUsers = [...parsedUsers, {gender, name, location, userId, coordinates, picture}]

    setItem('users', newUsers)

    const parsedWeathers = JSON.parse(weathers) as Array<typeof weather>
    const newWeathers = [...parsedWeathers, weather]
    
    setItem('weathers', newWeathers)
  }, [getItem, setItem, gender, name, location, userId, coordinates, picture, weather])
  const handleOpenModal = useCallback(() => {
    try {
    openModal(
      <WeatherDetailsModal  
        index={userKey} 
        onClose={closeModal} 
        userData={coordinates} 
        name={name} 
        location={location}
        coordinates={coordinates}  
        picture={picture}
      />
    )
    } catch (error) {
      console.log(error);
    }

  }, [closeModal, openModal, coordinates, userKey, name, location, picture])
  return (
    <div key={userKey} className={styles.userCard} {...props}>
      <Image
        src={picture.thumbnail}
        srcSet={picture.large}
        alt={name.first + name.last}
        width={userIconSize}
        height={userIconSize}
      />
      <UserInfo
        title={name.title}
        first={name.first}
        last={name.last}
        country={location.country}
        city={location.city}
      />

      {weather && (
        <div className={styles.weatherData}>
          <Image
            src={getWeatherIcon(weather.current)}
            alt="Weather"
            width={weatherIconSize}
            height={weatherIconSize}         
          />
          <Temperature>Temperature: {parseFloat(weather.current.temperature2m.toFixed(1))}°C</Temperature>
          <div className={styles.dailyTemp}>
            <Temperature>Min: {(weather.daily.temperature2mMin[0].toFixed(1))}°C</Temperature>
            |
            <Temperature>Max: {weather.daily.temperature2mMax[0].toFixed(1)}°C</Temperature>
          </div>
          <div>
            <button onClick={handleSaveUser} className={styles.saveButton}>Save user</button>
            <button onClick={handleOpenModal} className={styles.detailsButton}>Get details</button>
          </div>
        </div>
      )}
      {isModalOpen && modalContent}
    </div>
  )
}

export default memo(UserCard)
