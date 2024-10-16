import { IGetRandomUserResponseDTO } from "../dto/response/GetRandomUserResponseDTO";

export class UserApi{
    public async getRandomUser(count: number): Promise<IGetRandomUserResponseDTO[]>{
        const response = await fetch(`https://randomuser.me/api/?results=${count}`);
        const data = await response.json();
        return data.results;
    }
}