import Page4Design from 'generated/pages/page4';
import FlexLayout, { AlignItems, JustifyContent, PositionType } from '@smartface/native/ui/flexlayout';
import { City, getCities } from '../api';
import ListViewItem from '@smartface/native/ui/listviewitem';
import store from 'duck/store'
import SessionActions from '../duck/sessions/actions';
import Simple_listviewitem from 'generated/my-components/Simple_listviewitem';
import ActivityIndicator from '@smartface/native/ui/activityindicator';
import Color from '@smartface/native/ui/color';
import Screen from '@smartface/native/device/screen';

export default class Page4 extends Page4Design {
    router: any;
    loaderView: FlexLayout
    cities: City[]
    searchedCities: City[]
    searchedCity: string
	constructor() {
		super();
		// Overrides super.onShow method
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		// Overrides super.onLoad method
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

        this.searchView1.onTextChanged = (typedText: string) => {
            this.loaderView.visible = true
            setTimeout(() => {
                let filteredCities = filterGivenCities(typedText, this.cities);
                this.listView1.itemCount = filteredCities.length
                this.searchedCities = filteredCities
                this.listView1.refreshData();
                this.loaderView.visible = false
            }, 500);
        }
	}

    async getAllCities() {
        const response = await getCities();
        console.log('typeof response of cities:', typeof response)
        console.log('typeof response of cities:', response[0])
        this.cities = response
        this.searchedCities = response
        this.initListView();
    }
    initListView() {
        this.listView1.itemCount = this.cities.length
        this.listView1.rowHeight = 50
        this.listView1.touchEnabled = true
        // FIXME: ListViewItem
        this.listView1.onRowBind = (listViewItem: Simple_listviewitem, index: number) => {
            let currentCity = this.searchedCities[index]
            listViewItem.lblTitle.text = currentCity.name
        };

        this.listView1.onRowSelected = (selectedItem: Simple_listviewitem, index: number) => {
            console.log('selectedRow:' + index)
            console.log('selectedCity:', selectedItem.lblTitle.text)

            let selectedCity = this.cities.find(
                city => city.name === selectedItem.lblTitle.text
            )

            store.dispatch(SessionActions.updateCity(selectedCity))
            console.log('REDUX '+store.getState().session.city)
            this.router.goBack();
        }
        this.listView1.onPullRefresh = () => {
            console.log('refresh....')
            this.listView1.stopRefresh();
        }

        this.listView1.refreshData();
        this.listView1.visible = true
        this.loaderView.visible = false
    }
    initLoaderLayout() {
        this.loaderView = new FlexLayout();
        let container = this.loaderView
        container.width = Screen.width;
        container.height = Screen.height
        container.alignItems = AlignItems.CENTER
        container.justifyContent = JustifyContent.CENTER
        container.positionType = PositionType.ABSOLUTE
        container.backgroundColor = Color.create('#000000aa')

        let activityLoader = new ActivityIndicator();
        activityLoader.color = Color.BLUE;

        container.addChild(activityLoader)

        this.layout.addChild(container)
        this.layout.applyLayout();
    }
}

function filterGivenCities(searchKeyword: string, cities: City[]) {
    const filteredCities = cities.filter((city) => city.name.includes(searchKeyword));
    return filteredCities
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(this: Page4, superOnShow: () => void) {
	superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(this: Page4, superOnLoad: () => void) {
	superOnLoad();
    this.listView1.visible = false;
    this.initLoaderLayout()
    this.getAllCities();
}
