import multer from "multer"
import { checkRouter } from "lib"

import { upload } from "./upload"
import get from "./get"

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
      needAuth: true,
      handler: get,
    },
  ],
})
