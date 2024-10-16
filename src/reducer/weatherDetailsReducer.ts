import { IGetWeatherDetailsResponseDTO } from "../dto/response/GetWeatherDetailsResponseDTO";

interface WeatherState {
    weatherData: (IGetWeatherDetailsResponseDTO | null)
    loading: boolean
    error: string | null
  }
  
  type WeatherAction =
    | { type: 'FETCH_WEATHER_START' }
    | { type: 'FETCH_WEATHER_SUCCESS'; payload: IGetWeatherDetailsResponseDTO }
    | { type: 'FETCH_WEATHER_FAILURE'; payload: string }
  
  const initialWeatherDetailState: WeatherState = {
    weatherData: null,
    loading: false,
    error: null,
  };
  
  const weatherDetailReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
    switch (action.type) {
      case 'FETCH_WEATHER_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_WEATHER_SUCCESS':
        return {
          ...state,
          loading: false,
          weatherData: action.payload,
        };
      case 'FETCH_WEATHER_FAILURE':
        return { ...state, loading: false, error: action.payload }
      default:
        return state;
    }
  };
  
  export { weatherDetailReducer, initialWeatherDetailState };
  