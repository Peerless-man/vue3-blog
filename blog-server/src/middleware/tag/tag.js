const { getOneTag } = require("../../service/tag/index")
const { ERRORCODE, throwError } = require("../../result/index")
const errorCode = ERRORCODE.TAG

const verifyTag = async (ctx, next) => {
  const { id, tag_name } = ctx.request.body
  if (!tag_name) {
    console.error("标签名称不能为空")
    return ctx.app.emit("error", throwError(errorCode, "标签名称不能为空"), ctx)
  }
  let res = await getOneTag({ tag_name })
  if (res && res.id !== id) {
    console.error("标签已存在")
    return ctx.app.emit("error", throwError(errorCode, "标签已存在"), ctx)
  }
  await next()
}

const verifyDeleteTags = async (ctx, next) => {
  const { tagIdList } = ctx.request.body
  if (!tagIdList.length) {
    console.error("标签id列表不能为空")
    return ctx.app.emit("error", throwError(errorCode, "标签id列表不能为空"), ctx)
  }

  await next()
}

module.exports = {
  verifyTag,
  verifyDeleteTags,
}
