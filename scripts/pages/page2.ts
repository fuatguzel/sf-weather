import Page2Design from 'generated/pages/page2';
import HeaderBarItem from '@smartface/native/ui/headerbaritem';
import touch from '@smartface/extension-utils/lib/touch';
import Image from '@smartface/native/ui/image';
import PageTitleLayout from 'components/PageTitleLayout';
import componentContextPatch from '@smartface/contx/lib/smartface/componentContextPatch';
import Color from '@smartface/native/ui/color';
import System from '@smartface/native/device/system';
import Simple_listviewitem from 'generated/my-components/Simple_listviewitem';
import { getWeatherOneCall } from 'api/weatherRepository';


export default class Page2 extends Page2Design {
  router: any;
  routeData: any;
  parentController: any;
  constructor() {
    super();
    // Overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // Overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    // touch.addPressEvent(this.btnSayHello, () => {
    //   alert(this.routeData.message.name);
    // });
    
  }

  async getWeatherDetails() {
    if (this.routeData.message) {
        console.log(this.routeData.message.city)
        this.label1.text = this.routeData.message.city;
        const response = await getWeatherOneCall(this.routeData.message.lat, this.routeData.message.lon);
        console.log('one call api2', response)
        if (response) {
            try {
                this.listView1.rowHeight = 100;
                this.listView1.itemCount = response.daily.length;
                this.listView1.onRowBind = (listViewItem: Simple_listviewitem, index: number) => {
                    listViewItem.lblTitle.text = new Date(response.daily[index].dt * 1000).toLocaleDateString("en-US", {
                        weekday: 'long'
                    });
                    listViewItem.lblChevron.text = response.daily[index].temp.day;
                    // listViewItem.lblNightTemp.text = response.daily[index].temp.night;
                    // listViewItem.imgDayIcon.loadFromUrl({
                    //     url: `https://openweathermap.org/img/wn/${response.daily[index].weather[0].icon}@2x.png`,
                    // })
                }
                //this.listView1.refreshData();

            } catch (error) {
                console.error(error)
            }

        }

    }
}

//   initListView() {
//     this.listView1.rowHeight = 100;
//     this.listView1.onRowBind = (listViewItem: Simple_listviewitem, index: number) => {
//         listViewItem.lblTitle = this.routeData.message.name;
//         //listViewItem.valueText = this.elements[index].value;
//         //listViewItem.toggleZebra(index % 2 !== 0);
//     };
//     this.listView1.refreshEnabled = false;
//     }
//     refreshListView() {
//         this.listView1.itemCount = 10;
//         this.listView1.refreshData();
//     }
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 */
function onShow(this: Page2, superOnShow: () => void) {
  superOnShow();
  //this.getWeatherDetails()
  this.headerBar.titleLayout.applyLayout();
  this.routeData && console.info(this.routeData.message);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 */
function onLoad(this: Page2, superOnLoad: () => void) {
  superOnLoad();
  this.getWeatherDetails();
  //this.initListView();
  let headerBar;
  this.headerBar.titleLayout = new PageTitleLayout();
  componentContextPatch(this.headerBar.titleLayout, 'titleLayout');
  this.headerBar.setItems([
    new HeaderBarItem({
      title: 'Option',
      onPress: () => {
        console.warn('You pressed Option item!');
      },
    }),
  ]);
  if (System.OS === 'Android') {
    headerBar = this.headerBar;
    headerBar.setLeftItem(
      new HeaderBarItem({
        onPress: () => {
          this.router.goBack();
        },
        image: Image.createFromFile('images://arrow_back.png'),
      }),
    );
  } else {
    headerBar = this.parentController.headerBar;
  }
  headerBar.itemColor = Color.WHITE;
}
