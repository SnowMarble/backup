import Joi from "joi"
import { checkRouter } from "lib"

import get from "./get"
import create from "./create"
import stories from "./stories"

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
          categoryId: Joi.number(),
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
          thumbnail: Joi.string(),
          description: Joi.string(),
          name: Joi.string().required(),
          eventDate: Joi.date().required(),
          categoryId: Joi.number().required(),
          revealsAt: Joi.date().optional(),
        },
      },
    },
    {
      path: "/:id",
      method: "get",
      needAuth: true,
      handler: stories,
    }
  ],
})
