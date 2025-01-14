import React, { createContext, useCallback, useContext, useMemo } from "react";
import { IGetWeatherForCardResponseDTO } from "../dto/response/GetWeatherForCardResponseDTO";

interface UserCardDataContextType {
  key: number
  gender: string,
  id: {
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
}
interface UserCardContextType extends UserCardDataContextType {
    getField: <K extends keyof UserCardDataContextType>(
        field: K
    ) => UserCardDataContextType[K]
  }
const UserCardDataContext = createContext<UserCardContextType | null>(null);

export const useUserCardDataContext = (): UserCardContextType => {
  const context = useContext(UserCardDataContext);

  if (context === null) {
    throw new Error(
      "UserCardDataContext cannot be null, please add a context provider."
    );
  }

  return context;
};

  export const UserCardProvider: React.FC<React.PropsWithChildren<UserCardDataContextType>> = ({
    children,
    ...props
  }) => {
    const getField = useCallback(
      <K extends keyof UserCardDataContextType>(field: K): UserCardDataContextType[K] => props[field],
      [props]
    );
  
    const value = useMemo<UserCardContextType>(() => {
      return {
        getField,
        ...props
      };
    }, [getField, props]);
    return (
      <UserCardDataContext.Provider value={value}>
        {children}
      </UserCardDataContext.Provider>
    );
  };
