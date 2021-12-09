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

const COLORS: string[] = [
    "#ffffff", "#e6f7ff", "#cceeff", "#b3e6ff", "#99ddff", "#80d4ff", "#66ccff",
    "#4dc3ff", "#33bbff", "#1ab2ff", "#00aaff", "#0099e6", "#0088cc", "#0077b3",
    "#006699"
];

const STATICS: string[] = [
    "Lorem ipsum lorem ipsum lorem ipsum.", "Lorem ipsum lorem ipsum lorem ipsum.","Lorem ipsum lorem ipsum lorem ipsum.","Lorem ipsum lorem ipsum lorem ipsum.","Lorem ipsum lorem ipsum lorem ipsum.","Lorem ipsum lorem ipsum lorem ipsum."
];

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

        this.gridView1.itemCount = STATICS.length; ;
        this.gridView1.layoutManager.onItemLength = (length: number) => {
            return 5*length;
        }
        this.gridView1.onItemBind = (gridViewItem: News, index: number) => {
            // FIXME:
            gridViewItem.lblNews.text = STATICS[index];
            gridViewItem.dispatch({
                type: "updateUserStyle",
                userStyle: {
                  backgroundColor: `${COLORS[index]}`
                }
              });
            //Color.create()
            //gridViewItem.background = COLORS[index];
        }

        this.calendar.on(View.Events.Touch, () => {
            this.router.push('/pages/page2', { message: {
                lat: this.latitude,
                lon: this.longitude,
                city: this.city
            } });
        });

        this.button1.onPress = () => {
            this.router.push('/pages/page4', {message: 'NULL'});
        }
    }
    toggleIndicatorVisibility(toggle: boolean) {
        this.activityIndicator1.dispatch({
            type: 'updateUserStyle',
            userStyle: {
                visible: toggle
            }
        });
        throw new Error("Method not implemented.");
    }
    hideFlex() {
        this.flexLayout1.visible = false;
    }

    initGridView() {
        // TODO:
        
        this.gridView1.itemCount = STATICS.length; ;
        this.gridView1.layoutManager.onItemLength = (length: number) => {
            return 5*length;
        }
        this.gridView1.onItemBind = (gridViewItem: News, index: number) => {
            // FIXME:
            //gridViewItem.lblNews.text = STATICS[index];
            gridViewItem.dispatch({
                type: "updateUserStyle",
                userStyle: {
                  backgroundColor: `${COLORS[index]}`
                }
              });
            //Color.create()
            //gridViewItem.background = COLORS[index];
        }
        this.gridView1.refreshData();
    }

    async getRoadRiskInfos() {
        const loc = getLocation();
        const response = await getRoadRisk(this.latitude, this.longitude, this.date);
        if(response) {
            console.log('Road Risk responce => ', response)
        }
    }

    
    async getCurrentLocation() {
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000)
        const loc = await getLocation()
        if(loc) {
            const response = await getWeatherByLocation(loc.latitude, loc.longitude) 
            if(response) {
                console.log('location responce => ', response)
                this.longitude = response.coord.lon;
                this.latitude = response.coord.lat;
                this.date = response.dt;
                this.city = response.name;
                // this.calendar.on(View.Events.Touch, () => {
                //     this.router.push('/pages/page2', { message: response });
                // });
                this.lblCity.text = response.name;
                this.lblCity.textColor = Color.GREEN;
                this.lblWeatherStatus.text = response.weather[0].main;
                this.lblTemp.text = response.weather[0].description;
                this.lblWind.text = response.wind.speed
                this.lblHumidity.text = response.main.humidity
                // TODO: Background change

                switch (response.weather[0].main) {
                    case "Clouds":
                        this.layout.backgroundColor = Color.GRAY;
                        break;
                    case "Sunny":
                        this.layout.backgroundColor = Color.YELLOW;
                        break;  
                    case "Rain":
                        this.layout.backgroundColor = Color.BLUE;
                        break;
                    case "Clear":
                        this.layout.backgroundColor = Color.WHITE;
                    break;       
                    default:
                        break;
                }
                this.toggleIndicatorVisibility(false);
                this.hideFlex();
            }
            else {
                this.toggleIndicatorVisibility(false);
            }
        }
    }
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page1, superOnShow: () => void) {
    superOnShow();
    this.headerBar.titleLayout.applyLayout();

    const currentCityName = this.lblCity.text;
    const sessionCity = store.getState().session.city
    if ((currentCityName != sessionCity.name) && sessionCity.id != -1) {
        console.log('convertion:', Number(sessionCity.latitude), Number(sessionCity.longitude))
        getWeatherByLocation(Number(sessionCity.latitude), Number(sessionCity.longitude))

    }

    Location.android.checkSettings({
        onSuccess: () => {
            PermissionUtil.getPermission({androidPermission: Application.Android.Permissions.ACCESS_FINE_LOCATION, permissionText: 'Please go to the settings and grant permission'})
                .then(() => {
                    this.getCurrentLocation()
                })
                .then((reason) => {
                    console.log('Permission rejected'+reason)
                })
    },
    onFailure: (e: { statusCode: Location.Android.SettingsStatusCodes }) => {
        console.log('Location.checkSettings onFailure');
        if (e.statusCode == Location.Android.SettingsStatusCodes.DENIED) {
            console.log('SettingsStatusCodes.DENIED');
        } else {
            // go to settings via Application.call
            console.log('SettingsStatusCodes.OTHER' + Location.Android.SettingsStatusCodes.OTHER);
        }
    }
    })
    if (System.OS === 'iOS') {
        this.getCurrentLocation();
    } else {
        this.getCurrentLocation();
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page1, superOnLoad: () => void) {
    superOnLoad();
    const session = store.getState();
    console.info('Onload page1');
    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
    //this.initGridView();
    this.getRoadRiskInfos();
}
