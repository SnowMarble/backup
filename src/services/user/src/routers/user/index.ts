import checkRouter from "lib/checkRouter";

import familyCode from './familyCode'

export default checkRouter({
  root: "/user",
  routers: [
    {
      path: '/family-code',
      method: 'get',
      needAuth: true,
      handler: familyCode
    }
  ],
});
