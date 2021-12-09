import {baseURLApi, baseOneCallApi, baseRoadRiskApi} from './index';

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

export async function getWeatherOneCall(lat: number, lon: number) {
    try {
      return await baseOneCallApi.request(`&lat=${lat}&lon=${lon}`, {
        method: 'GET'
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  export async function getRoadRisk(lat: number, lon: number, dt: number) {
      try {
          return await baseRoadRiskApi.request(`&lat=${lat}&lon=${lon}&dt=${dt}`, {
              method: 'GET'
          })
      } catch (error) {
          console.error(error)
          throw error;
      }
  }