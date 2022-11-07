import Joi from "joi"
import checkRouter from "lib/checkRouter"

import name from "./name"
import familycode from "./familyCode"
import createFamily from "./createFamily"
import familyCodeVerify from "./familyCodeVerify"

export default checkRouter({
  root: "/onboarding",
  routers: [
    {
      path: "/name",
      method: "post",
      needAuth: true,
      handler: name,
      validation: {
        type: "body",
        body: {
          name: Joi.string().required(),
        },
      },
    },
    {
      path: "/familycode",
      method: "post",
      needAuth: true,
      handler: familycode,
      validation: {
        type: "body",
        body: {
          familyCode: Joi.string().required(),
        },
      },
    },
    {
      path: "/create-family",
      method: 'post',
      needAuth: true,
      handler: createFamily,
      validation: {
        type: "body",
        body: {
          name: Joi.string().min(1).max(30).required(),
        }
      }
    },
    {
      path: "/family-code",
      method: "post",
      needAuth: true,
      handler: familyCodeVerify,
      validation: {
        type: "body",
        body: {
          code: Joi.string().required(),
        },
      },
    }
  ],
})
