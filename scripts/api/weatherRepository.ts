import {baseURLApi} from './index';

export async function getWeatherByCityName(cityName: string) {
    try {
        return await baseURLApi.request(`&q=${cityName}`, {
            method: 'GET'
        })        
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getWeatherByLocation(lat: number, lon: number) {
    try {
        return await baseURLApi.request(`&lat=${lat}&lon=${lon}`, {
            method: 'GET'
        })
    } catch (error) {
        console.error(error)
        throw error
    }
}