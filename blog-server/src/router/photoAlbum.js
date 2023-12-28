/**
 * 关于相册的路由
 * @author: M
 */
const Router = require("koa-router")
const router = new Router({ prefix: "/photoAlbum" })

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index")
const { addAlbum, deleteAlbum, updateAlbum, getAlbumList, getAllAlbumList } = require("../controller/photoAlbum/index")

// 新增相册
router.post("/add", auth, needAdminAuthNotNeedSuper, addAlbum)

// 删除相册
router.delete("/delete/:id", auth, needAdminAuthNotNeedSuper, deleteAlbum)

// 修改相册
router.put("/update", auth, needAdminAuthNotNeedSuper, updateAlbum)

// 分页获取相册列表
router.post("/", getAlbumList)

// 一次性获取所有的相册列表
router.get("/getAllAlbumList", getAllAlbumList)

module.exports = router
