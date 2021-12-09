import ServiseCall from '@smartface/extension-utils/lib/service-call';

const apiKey = '8dbceb648ccfe3329080de2fa9022d0d';

export const baseURLApi = new ServiseCall({
    baseUrl : `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`,
    logEnabled : true,
    headers : {
        apiVersion : '1.0'
    }
})

export const baseOneCallApi = new ServiseCall({
    baseUrl: `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&units=metric`,
    logEnabled: true,
    headers: {
      apiVersion: '1.0'
    }
  });

  export const baseRoadRiskApi = new ServiseCall({
    baseUrl: `https://api.openweathermap.org/data/2.5/roadrisk?appid=${apiKey}`,
    logEnabled: true,
    headers: {
      apiVersion: '1.0'
    }
  });

  export const cityBaseApi = new ServiseCall({
    baseUrl: 'https://gist.githubusercontent.com/ozdemirburak/4821a26db048cc0972c1beee48a408de/raw/4754e5f9d09dade2e6c461d7e960e13ef38eaa88',
    logEnabled: false
})

  export type City = {
    id: number
    name: string
    latitude: string
    longitude: string
    population: number
    region: string
}

export async function getCities(): Promise<City[]> {
    try {
        const response = await cityBaseApi.request('/cities_of_turkey.json', {
            method: 'GET'
        });
        if (response) {
            const parsedCities = JSON.parse(response)
            return parsedCities
        }
        return []
    } catch (err) {
        console.error(err);
        throw err;
    }
}