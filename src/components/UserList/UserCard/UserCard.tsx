import { IGetWeatherForCardResponseDTO } from "../../../dto/response/GetWeatherForCardResponseDTO"
import styles from './userCard.module.scss'
import useWindowSize from "../../../utils/hooks/useWindowSize";
import { useModal } from "../../../utils/hooks/useModal";
import WeatherDetailsModal from "../../modals/WeatherDetails/WeatherDetailsModal";
import { IGetRandomUserResponseDTO } from "../../../dto/response/GetRandomUserResponseDTO";
interface UserCardProps {
  user: {
    key: number
    gender: string
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
  };
  weather?: IGetWeatherForCardResponseDTO | null;
  getNextUser: (index: number) => IGetRandomUserResponseDTO | undefined
}

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
  if(cloudCover >= 10 && cloudCover <= 60){
    if(!isDay) return '/large/night_cloudy.png'
    return '/large/cloudy_large.png'
  } else if(cloudCover > 60) return '/large/heavy_cloudy.png'

  if(!isDay) return '/large/moon.png';
  return '/large/sun_large.png'
}

const UserCard: React.FC<UserCardProps> = ({ user, weather, getNextUser }) => {
  const { isModalOpen, openModal, closeModal, modalContent } = useModal();
  const { width } = useWindowSize(500)
  const weatherIconSize = width <= 480 ? 64 : 90
  const userIconSize = width <= 480 ? 128 : 128
  const handleOpenModal = () => {
    openModal(<WeatherDetailsModal getNextUser={getNextUser} index={user.key} onClose={closeModal} userData={user.coordinates}/>)
  }
  return (
    <div key={user.key} className={styles.userCard}>
      <img 
        src={user.picture.large} 
        alt={`${user.name.first} ${user.name.last}`} 
        width={userIconSize}
        height={userIconSize}
      />
      <div className={styles.userInfo}>
        <p>{`${user.name.title}. ${user.name.first} ${user.name.last}`}</p>
        <p>{`${user.location.country}, ${user.location.city}`}</p>
      </div>

      {weather && (
        <div className={styles.weatherData}>
          <img 
            src={getWeatherIcon(weather.current)} 
            alt="Weather" 
            width={weatherIconSize} 
            height={weatherIconSize} 
          />
          <p>Temperature: {parseFloat(weather.current.temperature2m.toFixed(1))}°C</p>
          <div className={styles.dailyTemp}>
            <p>Min: {(weather.daily.temperature2mMin[0].toFixed(1))}°C</p>
            |
            <p>Max: {weather.daily.temperature2mMax[0].toFixed(1)}°C</p>
          </div>
          <div>
            <button className={styles.saveButton}>Save user</button>
            <button onClick={handleOpenModal} className={styles.detailsButton}>Get details</button>
          </div>
        </div>
      )}
      {isModalOpen && modalContent}
    </div>
  )
}

export default UserCard
