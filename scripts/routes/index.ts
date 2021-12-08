import buildExtender from '@smartface/extension-utils/lib/router/buildExtender';
import {
  NativeRouter as Router,
  NativeStackRouter as StackRouter,
  Route,
} from '@smartface/router';
import * as Pages from 'pages';
import '@smartface/extension-utils/lib/router/goBack'; // Implements onBackButtonPressed

const router = Router.of({
  path: '/',
  isRoot: true,
  routes: [
    StackRouter.of({
      path: '/pages',
      routes: [
        Route.of({
          path: '/pages/page1',
          build: buildExtender({
            getPageClass: () => Pages.Page1,
            headerBarStyle: { visible: true },
          }),
        }),
        Route.of({
          path: '/pages/page2',
          build: buildExtender({
            getPageClass: () => Pages.Page2,
            headerBarStyle: { visible: true },
          }),
        }),
        Route.of({
            path: '/pages/page3',
            build: buildExtender({
            // FIXME: Pages.Page3 ?
              getPageClass: () => Pages.Page3,
              headerBarStyle: { visible: false },
            }),
        //     build((router, route) => {
        //         const Page1 = require('/pages/Page3');
        //         return new Page3(state.data, router);
        //       })
        }),
      ],
    }),
  ],
});

export default router;
