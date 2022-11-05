import { checkRouter } from 'lib'

export default checkRouter({
  root: '/',
  routers: [
    {
      path: '/',
      method: 'get',
      needAuth: true,
      handler: (req, res) => {
        res.json(req.user)
      }
    }
  ]
})
