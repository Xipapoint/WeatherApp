export interface Coordinates {
    latitude: string;
    longitude: string;
}

export interface Timezone {
    offset: string;
    description: string;
}

export interface Street {
    number: number;
    name: string;
}

export interface Location {
    street: Street;
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: Coordinates;
    timezone: Timezone;
}

export interface Login {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}

export interface Picture {
    large: string;
    medium: string;
    thumbnail: string;
}

export interface Id {
    name: string;
    value: string | null;
}



export interface IGetRandomUserResponseDTO {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: Location;
    email: string;
    login: Login;
    dob: {
        date: string;
        age: number;
    };
    registered: {
        date: string;
        age: number;
    };
    phone: string;
    cell: string;
    id: Id;
    picture: Picture;
    nat: string;
}