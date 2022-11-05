import Joi from 'joi';
import { checkRouter } from 'lib'

import get from './get'
import deleteCategory from './delete'


export default checkRouter({
  root: '/category',
  routers: [
    {
      path: '/',
      method: 'get',
      needAuth: true,
      handler: get
    },
    {
      path: '/',
      method: 'delete',
      needAuth: true,
      handler: deleteCategory,
      validation: {
        type: "body",
        body: { id: Joi.number().required() }
      }
    }
  ]
})
