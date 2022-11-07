import multer from "multer"
import { checkRouter } from "lib"

import { upload } from "./upload"
import get from "./get"

import imageTempAuth from "middlewares/imageTempAuth"

export default checkRouter({
  root: "/upload",
  routers: [
    {
      path: "/",
      method: "post",
      needAuth: true,
      middlewares: [multer().single("file")],
      handler: upload,
    },
    {
      path: "/:key",
      method: "get",
      middlewares: [imageTempAuth],
      needAuth: false,
      handler: get,
    },
  ],
})
