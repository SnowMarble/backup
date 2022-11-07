import checkRouter from "lib/checkRouter";

import me from "./me";
import familyCode from './familyCode'
import familyMember from "./familyMember";

export default checkRouter({
  root: "/user",
  routers: [
    {
      path: "/me",
      method: 'get',
      needAuth: true,
      handler: me,
    },
    {
      path: '/family-code',
      method: 'get',
      needAuth: true,
      handler: familyCode
    },
    {
      path: "/family-members",
      method: 'get',
      needAuth: true,
      handler: familyMember,
    }
  ],
});
