import { checkRouter, userInfo } from "lib";

export default checkRouter({
  root: "/test",
  routers: [
    {
      path: "/",
      method: "get",
      needAuth: true,
      handler: async (req, res) => {
        const info = await userInfo(req.user.id);
        res.json(info);
      }
    }
  ]
})
