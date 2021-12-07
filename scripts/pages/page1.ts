import Page1Design from 'generated/pages/page1';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import PageTitleLayout from 'components/PageTitleLayout';
import System from '@smartface/native/device/system';
import Application from '@smartface/native/application';
import Location from '@smartface/native/device/location';
import PermissionUtil from '@smartface/extension-utils/lib/permission';
import { getWeatherByCityName, getWeatherByLocation } from '../api/weatherRepository';
import { getLocation } from '@smartface/extension-utils/lib/location';
import View from '@smartface/native/ui/view';

export default class Page1 extends Page1Design {
    router: any;
    constructor() {
        super();
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

        this.calendar.on(View.Events.Touch, () => {
            this.router.push('/pages/page2', { message: 'CITY LIST' });
        });

        this.btnNext.onPress = async () => {
            const response = await getWeatherByCityName(this.cityName.text);
            this.toggleIndicatorVisibility(true);
            if (response) {
                console.log('weather response', response);
                this.lblWeatherStatus.text = response.weather[0].description
                this.lblCity.text = response.name;
                this.toggleIndicatorVisibility(false);
            }
            else {
                this.toggleIndicatorVisibility(false);
            }
        };
        this.cityName.onActionButtonPress = this.btnNext.onPress;
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
    async getCurrentLocation() {
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000)
        const loc = await getLocation()
        if(loc) {
            const response = await getWeatherByLocation(loc.latitude, loc.longitude) 
            if(response) {
                console.log('weather responce => ', response)
                this.lblCity.text = response.name;
                this.lblWeatherStatus.text = response.weather[0].description
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

    Location.android.checkSettings({
        onSuccess: () => {
            PermissionUtil.getPermission({androidPermission: Application.Android.Permissions.ACCESS_FINE_LOCATION, permissionText: 'Please go to the settings and grant permission'})
                .then(() => {
                    this.getCurrentLocation()
                })
                .then((reason) => {
                    console.log('Permission rejected')
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
    console.info('Onload page1');
    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
}
