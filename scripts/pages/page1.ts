import Page1Design from 'generated/pages/page1';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import PageTitleLayout from 'components/PageTitleLayout';
import System from '@smartface/native/device/system';
import Application from '@smartface/native/application';
import Location from '@smartface/native/device/location';
import PermissionUtil from '@smartface/extension-utils/lib/permission';
import { getWeatherByLocation, getRoadRisk } from '../api/weatherRepository';
import { getLocation } from '@smartface/extension-utils/lib/location';
import View from '@smartface/native/ui/view';
import Color from '@smartface/native/ui/color';
import News from 'generated/my-components/News';

import store from 'duck/store';
import Screen from '@smartface/native/device/screen';

const COLORS: string[] = [
    "#FDFAF6","#EEC4C4","#FFF5AB" 
];

const DATES: string[] = [
    'Today', 'Nex week', 'Next month'
];

const ALERTS: object = [
    {
        "message_type": "success",
        "message": "Good days."
    },
    {
        "message_type": "danger",
        "message": "Don't go outside!"
    },
    {
        "message_type": "warning",
        "message": "Active children and adults, and people with lung disease, such as asthma, should reduce prolonged or heavy exertion outdoors"
    }
]

export default class Page1 extends Page1Design {
    router: any;
    alerts: any;
    latitude: number;
    longitude: number;
    city: string;
    date: number;
    constructor() {
        super();
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

        this.location.on(View.Events.Touch, () => {
            this.router.push('/pages/page4');
        })

        this.calendar.on(View.Events.Touch, () => {
            this.router.push('/pages/page2', { message: {
                lat: this.latitude,
                lon: this.longitude,
                city: this.city
            } });
        });

        this.getCurrentLocation();
    }

    initGridView() {
        this.gridView1.itemCount = DATES.length; ;
        this.gridView1.layoutManager.onItemLength = (length: number) => {
            return Screen.width - length;
        }
        // TODO: Add ALERT>message_type for background colors.
        this.gridView1.onItemBind = (gridViewItem: News, index: number) => {
            gridViewItem.lblNews.text = DATES[index];
            gridViewItem.dispatch({
                type: "updateUserStyle",
                userStyle: {
                  backgroundColor: `${COLORS[index]}`
                }
              });
            gridViewItem.lblSecond.text = ALERTS[index].message;
            
        }
        this.gridView1.refreshData();
    }

    async getWeatherInfoByLocation(latitude: number, longitude: number) {
        try {
            const response = await getWeatherByLocation(latitude, longitude)
            if (response) {
                this.city = response.name
                this.latitude = response.coord.lat
                this.longitude = response.coord.lon

                this.lblCity.text = response.name
                this.lblWeatherStatus.text = response.weather[0].main;
                this.lblTemp.text = response.main.temp+'°';
                this.label1.text = response.weather[0].description;

                this.layout.backgroundColor = getBackgroundColor(response.weather[0].main)
            }
        } catch (error) {

        }
    }
    
    async getCurrentLocation() {
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000)
        const loc = await getLocation()
        if(loc) {
            const response = await this.getWeatherInfoByLocation(loc.latitude, loc.longitude) 
        }
    }
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page1, superOnShow: () => void) {
    superOnShow();
    //this.headerBar.titleLayout.applyLayout();

    const currentCityName = this.lblCity.text;
    const sessionCity = store.getState().session.city
    if ((currentCityName != sessionCity.name) && sessionCity.id != -1) {
        console.log('convertion:', Number(sessionCity.latitude), Number(sessionCity.longitude))
        this.getWeatherInfoByLocation(Number(sessionCity.latitude), Number(sessionCity.longitude))
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page1, superOnLoad: () => void) {
    superOnLoad();
    const session = store.getState();
    this.initGridView();
}

function getBackgroundColor(main: string): Color {
    switch (main) {
        case "Clouds":
            return Color.create('#716F81'); break;
        case "Thunderstorm":
            return Color.create('#867AE9'); break;   
        case "Sunny":
            return Color.create('#FFF338'); break;   
        case "Rain":
            return Color.create('#64C9CF'); break;   
        case "Mist":
            return Color.create('#DAD0C2'); break;   
        case "Clear":
            return Color.create('#A2CDCD'); break;
        default:
            return Color.WHITE; break;
    }
}
