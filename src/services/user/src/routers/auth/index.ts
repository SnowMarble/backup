import Joi from 'joi'
import checkRouter from "lib/checkRouter";

import login from "./login";
import refresh from './refresh'

export default checkRouter({
  root: "/auth",
  routers: [
    {
      path: "/login",
      method: "post",
      needAuth: false,
      handler: login,
      validation: {
        type: 'body',
        body: {
          idToken: Joi.string().required(),
        }
      }
    },
    {
      path: "/refresh",
      method: "post",
      needAuth: false,
      handler: refresh,
    },
    {
      path: "/test",
      method: "get",
      needAuth: true,
      handler: (req, res) => {
        res.send(req.user)
      }
    }
  ],
});
