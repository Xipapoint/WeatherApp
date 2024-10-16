import { IGetWeatherForCardResponseDTO } from "../dto/response/GetWeatherForCardResponseDTO";

interface WeatherState {
    weatherData: (IGetWeatherForCardResponseDTO | null)[];
    loading: boolean;
    error: string | null;
  }
  
  type WeatherAction =
    | { type: 'FETCH_WEATHER_START' }
    | { type: 'FETCH_WEATHER_SUCCESS'; payload: IGetWeatherForCardResponseDTO[] }
    | { type: 'FETCH_WEATHER_FAILURE'; payload: string };
  
  const initialWeatherState: WeatherState = {
    weatherData: [],
    loading: false,
    error: null,
  };
  
  const weatherCardReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
    switch (action.type) {
      case 'FETCH_WEATHER_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_WEATHER_SUCCESS':
        return {
          ...state,
          loading: false,
          weatherData: [...state.weatherData, ...action.payload],
        };
      case 'FETCH_WEATHER_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export { weatherCardReducer, initialWeatherState };
  