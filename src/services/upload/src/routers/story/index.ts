import Joi from "joi"
import { checkRouter } from "lib"

import today from "./today"
import create from "./create"

export default checkRouter({
  root: "/story",
  routers: [
    {
      path: "/",
      method: "post",
      needAuth: true,
      handler: create,
      validation: {
        type: "body",
        body: {
          description: Joi.string(),
          albumId: Joi.number().required(),
          image: Joi.string().length(32).required(),
        },
      },
    },
    {
      path: "/today",
      method: "get",
      needAuth: true,
      handler: today,
    }
  ],
})
