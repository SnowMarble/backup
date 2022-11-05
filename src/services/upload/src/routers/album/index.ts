import Joi from "joi"
import { checkRouter } from "lib"

import get from "./get"
import create from "./create"

export default checkRouter({
  root: "/album",
  routers: [
    {
      path: "/",
      method: "get",
      needAuth: true,
      handler: get,
      validation: {
        type: "query",
        body: {
          sort: Joi.string().valid("asc", "desc"),
          sortType: Joi.string()
            .valid("lastViewed", "updatedAt", "name")
            .required(),
        },
      },
    },
    {
      path: "/",
      method: "post",
      needAuth: true,
      handler: create,
      validation: {
        type: "body",
        body: {
          description: Joi.string(),
          name: Joi.string().required(),
          eventDate: Joi.date().required(),
          categoryId: Joi.number().required(),
        },
      },
    },
  ],
})
