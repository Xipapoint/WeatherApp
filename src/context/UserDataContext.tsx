import React, { createContext, useContext, useReducer, useMemo, useCallback } from "react";
import { UserApi } from "../api/userApi"; // Предположим, у вас есть такие модули
import { WeatherApi } from "../api/weatherApi";
import { userReducer, userInitialState } from "../reducer/userReducer"; // Ваши редюсеры
import { weatherCardReducer, initialWeatherState } from "../reducer/weatherCardReducer";
import useErrorToast from "../utils/hooks/toast";
import { IGetRandomUserResponseDTO } from "../dto/response/GetRandomUserResponseDTO";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { IGetWeatherForCardResponseDTO } from "../dto/response/GetWeatherForCardResponseDTO";

interface UserDataContextType {
  userState: typeof userInitialState;
  weatherState: typeof initialWeatherState;
  loadUsers: () => void;
  loadSavedUsers: () => void
  getUserByIndex: (index: number) =>  IGetRandomUserResponseDTO | null
}

const UserDataContext = createContext<UserDataContextType | null>(null);

export const useUserDataContext = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("UserDataContext must be used within a UserDataProvider.");
  }
  return context;
};

export const UserDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { handleError } = useErrorToast()
  const [userState, userDispatch] = useReducer(userReducer, userInitialState);
  const [weatherState, weatherCardDispatch] = useReducer(weatherCardReducer, initialWeatherState);
  const {getItem} = useLocalStorage()

    const fetchLocalStorage = useCallback(() => {
      const users = getItem('users')
          if(users){
            const parsedUsers = JSON.parse(users) as Array<IGetRandomUserResponseDTO>
            const weathers = getItem('weathers')
            const parsedWeathers = JSON.parse(weathers!) as Array<IGetWeatherForCardResponseDTO>
            return {
              valid: true,
              users: parsedUsers,
              weathers: parsedWeathers
            }
          }
          return {
            valid: false
          }
    }, [getItem])

    const fetchUsers = useCallback(async () => {
        try {
          const userApi = new UserApi()
          const response = await userApi.getRandomUser(10)
          return response
          
        } catch (error) {
          handleError(error)
          userDispatch({ type: 'FETCH_USERS_FAILURE', payload: 'Error fetching users' })
        }
      }, [handleError])

      const fetchWeatherForUsers = useCallback(async (users: IGetRandomUserResponseDTO[]) => {
        const weatherApi = new WeatherApi()
    
        try {
          const lat: number[] = []
          const long: number[] = []
          users.map(async (user) => {
            lat.push(Number(user.location.coordinates.latitude))
            long.push(Number(user.location.coordinates.longitude))
          })
          const weatherData = await weatherApi.getWeatherForCard({lat, long})
          weatherCardDispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: weatherData })
        } catch (err) {
          handleError(err)
          weatherCardDispatch({ type: 'FETCH_WEATHER_FAILURE', payload: 'Error fetching weather' })
        }
      }, [handleError])

      const loadUsers = useCallback(
        async () => {
          userDispatch({ type: "FETCH_USERS_START" });
          weatherCardDispatch({ type: "FETCH_WEATHER_START" });
          const users = await fetchUsers();
          if (users) {
            userDispatch({ type: "FETCH_USERS_SUCCESS", payload: users });
            await fetchWeatherForUsers(users);
          }
    },
    [fetchUsers, fetchWeatherForUsers]
  );

  const loadSavedUsers = useCallback(() => {
    userDispatch({ type: "FETCH_USERS_START" });
    weatherCardDispatch({ type: "FETCH_WEATHER_START" });
      const result = fetchLocalStorage()
      const {users, weathers} = result
      if(users)
        userDispatch({ type: 'FETCH_USERS_SUCCESS', payload: users })
      if(weathers)
        weatherCardDispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: weathers })
  }, [fetchLocalStorage])

  const getUserByIndex = useCallback(
    (index: number) => (index >= 0 && index < userState.users.length ? userState.users[index] : null),
    [userState.users]
  );

  const value = useMemo(() => ({ userState, weatherState, loadUsers, loadSavedUsers, getUserByIndex }), [
    userState,
    weatherState,
    loadUsers,
    loadSavedUsers,
    getUserByIndex
  ]);

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
