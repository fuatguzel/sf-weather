import Page1Design from 'generated/pages/page1';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import PageTitleLayout from 'components/PageTitleLayout';
import System from '@smartface/native/device/system';
import Application from '@smartface/native/application';
import Location from '@smartface/native/device/location';
import PermissionUtil from '@smartface/extension-utils/lib/permission';
import { getWeatherByLocation } from '../api/weatherRepository';
import { getLocation } from '@smartface/extension-utils/lib/location';
import View from '@smartface/native/ui/view';
import GridViewItem from '@smartface/native/ui/gridviewitem';
import Color from '@smartface/native/ui/color';
import News from 'generated/my-components/News';

const COLORS: string[] = [
    "#ffffff", "#e6f7ff", "#cceeff", "#b3e6ff", "#99ddff", "#80d4ff", "#66ccff",
    "#4dc3ff", "#33bbff", "#1ab2ff", "#00aaff", "#0099e6", "#0088cc", "#0077b3",
    "#006699"
];

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

        this.button1.onPress = () => {
            this.router.push('/pages/page3', {message: 'NULL'});
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
        
        this.gridView1.itemCount = COLORS.length; ;
        this.gridView1.layoutManager.onItemLength = (length: number) => {
            return 5*length;
        }
        this.gridView1.onItemBind = (gridViewItem: GridViewItem, index: number) => {
            // FIXME:
            //gridViewItem.label.text = COLORS[index];
            
        }
        this.gridView1.refreshData();
    }

    async getCurrentLocation() {
        Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000)
        const loc = await getLocation()
        if(loc) {
            const response = await getWeatherByLocation(loc.latitude, loc.longitude) 
            if(response) {
                console.log('location responce => ', response)
                this.lblCity.text = response.name;
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
    console.info('Onload page1');
    this.headerBar.leftItemEnabled = false;
    this.headerBar.titleLayout = new PageTitleLayout();
    componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
    if (System.OS === 'Android') {
        this.headerBar.title = '';
    }
    this.initGridView();
}
