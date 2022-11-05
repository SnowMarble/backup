import { checkRouter } from 'lib'

import get from './get'

export default checkRouter({
  root: '/category',
  routers: [
    {
      path: '/',
      method: 'get',
      needAuth: true,
      handler: get
    }
  ]
})
