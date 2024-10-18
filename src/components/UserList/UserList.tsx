import React, { useEffect, useReducer, useRef } from 'react'
import { ToastContainer, Bounce } from 'react-toastify'
import UserCard from './UserCard/UserCard'
import { UserApi } from '../../api/userApi'
import { WeatherApi } from '../../api/weatherApi'
import { IGetRandomUserResponseDTO } from '../../dto/response/GetRandomUserResponseDTO'
import { userReducer, userInitialState } from '../../reducer/userReducer'
import { weatherCardReducer, initialWeatherState } from '../../reducer/weatherCardReducer'
import useErrorToast from '../../utils/hooks/toast'
import 'react-toastify/dist/ReactToastify.css';
import styles from './userList.module.scss'

const UserList = () => {
    const { handleError } = useErrorToast()
    const [userState, userDispatch] = useReducer(userReducer, userInitialState)
    const [weatherCardState, weatherCardDispatch] = useReducer(weatherCardReducer, initialWeatherState)
    const observer = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    const fetchUsers = async () => {
        try {
          const userApi = new UserApi()
          const response = await userApi.getRandomUser(10)
          return response
          
        } catch (error) {
          handleError(error)
          userDispatch({ type: 'FETCH_USERS_FAILURE', payload: 'Error fetching users' })
        }
      }
    
      const fetchWeatherForUsers = async (users: IGetRandomUserResponseDTO[]) => {
        weatherCardDispatch({ type: 'FETCH_WEATHER_START' })
        const weatherApi = new WeatherApi()
    
        try {
          const lat: number[] = []
          const long: number[] = []
          users.map(async (user) => {
            lat.push(Number(user.location.coordinates.latitude))
            long.push(Number(user.location.coordinates.longitude))
          })
          const weatherData = await weatherApi.getWeatherForCard({lat, long})
          // if(weatherData.length === 0) handleError(new AppError("Couldnt get the response from the server. Try again later", 500, ''))
          weatherCardDispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: weatherData })
        } catch (err) {
          handleError(err)
          weatherCardDispatch({ type: 'FETCH_WEATHER_FAILURE', payload: 'Error fetching weather' })
        }
      };
    
      const loadUsers = async () => {
        userDispatch({ type: 'FETCH_USERS_START' })
        const users = await fetchUsers()
        if (users && users.length > 0) {
          userDispatch({ type: 'FETCH_USERS_SUCCESS', payload: users })
          await fetchWeatherForUsers(users)
        }
      };
    
      useEffect(() => {
        loadUsers()
      }, [])
    
      useEffect(() => {
        if (userState.loading) return
    
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting) {
            loadUsers()
          }
        };
    
        observer.current = new IntersectionObserver(handleIntersection)
        if (loadMoreRef.current) {
          observer.current.observe(loadMoreRef.current)
        }
    
        return () => {
          if (observer.current && loadMoreRef.current) {
            observer.current.unobserve(loadMoreRef.current)
          }
        }
      }, [userState.loading, weatherCardState.loading])

      const getNextUser = (index: number) => {
        if(index + 1 > userState.users.length) return
        console.log("get user: ", userState.users[index]);
        
        return userState.users[index]
      }

  return (
    <>
      {userState.loading && <p>Loading users...</p>}
      <h1>All Users</h1>
      <ul className={styles.userList}>
        {userState.users.map((user, index) => (
          <div key={index} >
            <UserCard user={{
              key:  index,
              gender: user.gender,
              name: user.name,
              location: {
                country: user.location.country,
                city: user.location.city
              },
              coordinates: user.location.coordinates,
              picture: user.picture,
              email: user.email,
              
            }}
            weather={weatherCardState.weatherData[index]}      
            getNextUser={getNextUser}     
            />
          </div>

        ))}
      </ul>
      <div ref={loadMoreRef} style={{ height: '20px', background: 'transparent' }} />
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
    </>
  )
}

export default UserList
