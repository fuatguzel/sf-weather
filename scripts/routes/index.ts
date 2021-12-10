import buildExtender from '@smartface/extension-utils/lib/router/buildExtender';
import {
  NativeRouter as Router,
  NativeStackRouter as StackRouter,
  Route,
} from '@smartface/router';
import * as Pages from 'pages';
import '@smartface/extension-utils/lib/router/goBack'; // Implements onBackButtonPressed

import backClose from '@smartface/extension-utils/lib/router/back-close';
import Image from '@smartface/native/ui/image';
backClose.setDefaultBackStyle({image: Image.createFromFile("images://arrow_back.png"), hideTitle: true});

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
            headerBarStyle: { visible: false },
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
            path: '/pages/page4',
            build: buildExtender({
              getPageClass: () => Pages.Page4,
              headerBarStyle: { visible: false },
            }),
        }),
      ],
    }),
  ],
});

export default router;
