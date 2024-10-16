import { IGetRandomUserResponseDTO } from "../dto/response/GetRandomUserResponseDTO";

interface UserState {
    users: IGetRandomUserResponseDTO[];
    loading: boolean;
    error: string | null;
    page: number;
  }
  
  type UserAction =
    | { type: 'FETCH_USERS_START' }
    | { type: 'FETCH_USERS_SUCCESS'; payload: IGetRandomUserResponseDTO[] }
    | { type: 'FETCH_USERS_FAILURE'; payload: string }
    | { type: 'ADD_USERS'; payload: IGetRandomUserResponseDTO[] };
  
  const userInitialState: UserState = {
    users: [],
    loading: false,
    error: null,
    page: 1,
  };
  
  const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
      case 'FETCH_USERS_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_USERS_SUCCESS':
        return {
          ...state,
          loading: false,
          users: [...state.users, ...action.payload],
        };
      case 'FETCH_USERS_FAILURE':
        return { ...state, loading: false, error: action.payload };
      case 'ADD_USERS':
        return { ...state, users: [...state.users, ...action.payload] };
      default:
        return state;
    }
  };

export {userInitialState, userReducer}