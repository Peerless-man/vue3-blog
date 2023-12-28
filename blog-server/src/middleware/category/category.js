const { getOneCategory } = require("../../service/category/index")

const { ERRORCODE, throwError } = require("../../result/index")
const errorCode = ERRORCODE.CATEGORY

const verifyCategory = async (ctx, next) => {
  const { id, category_name } = ctx.request.body
  if (!category_name) {
    console.error("分类名称不能为空")
    return ctx.app.emit("error", throwError(errorCode, "分类名称不能为空"), ctx)
  }
  let res = await getOneCategory({ category_name })
  if (res && res.id == id) {
    console.error("分类已存在")
    return ctx.app.emit("error", throwError(errorCode, "分类已存在"), ctx)
  }

  await next()
}

const verifyDeleteCategories = async (ctx, next) => {
  const { categoryIdList } = ctx.request.body
  if (!categoryIdList.length) {
    console.error("分类id列表不能为空")
    return ctx.app.emit("error", throwError(errorCode, "分类id列表不能为空"), ctx)
  }

  await next()
}

module.exports = {
  verifyCategory,
  verifyDeleteCategories,
}
