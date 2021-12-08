import Page3Design from 'generated/pages/page3';
import { getWeatherByCityName } from 'api/weatherRepository';

export default class Page3 extends Page3Design {
	constructor() {
		super();
		// Overrides super.onShow method
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		// Overrides super.onLoad method
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        //this.toggleIndicatorVisibility(true);
        this.activityIndicator1.visible = false;
        this.button1.onPress = async () => {
            this.toggleIndicatorVisibility(false);
            const response = await getWeatherByCityName(this.textBox1.text);
            this.toggleIndicatorVisibility(true);
            if (response) {
                console.log('city response', response);
                // TODO: response should be in state. And return datas back.
                this.label2.text = response.weather[0].main;
                //this.toggleIndicatorVisibility(false);
            }
            else {
                //this.toggleIndicatorVisibility(false);
            }
        };
        this.textBox1.onActionButtonPress = this.button1.onPress;

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
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(this: Page3, superOnShow: () => void) {
	superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(this: Page3, superOnLoad: () => void) {
	superOnLoad();
}
