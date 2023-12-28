const { createArticleTags } = require("../../service/article/articleTag")
const { getOneCategory, createCategory } = require("../../service/category/index")
const { createTag, getOneTag } = require("../../service/tag/index")
/**
 * 新增和编辑文章关于分类的公共方法
 * @param {*} id
 * @param {*} category_name
 */
const createCategoryOrReturn = async (id, category_name) => {
  let finalId
  if (id) {
    finalId = id
  } else {
    let oneTag = await getOneCategory({ category_name })
    if (oneTag) {
      finalId = oneTag.id
    } else {
      let newTag = await createCategory({ category_name })
      finalId = newTag.id
    }
  }

  return finalId
}

/**
 * 进行添加文章分类与标签关联的公共方法
 * @param {*} articleId
 * @param {*} tagList
 */
const createArticleTagByArticleId = async (articleId, tagList) => {
  let resultList = []
  // 先将新增的tag进行保存，拿到tag的id，再进行标签 文章关联
  let promiseList = tagList.map(async tag => {
    if (!tag.id) {
      let res
      let one = await getOneTag({ tag_name: tag.tag_name })
      if (one) {
        res = one
      } else {
        res = await createTag(tag)
      }
      return res
    }
  })

  // 组装添加了标签id后的标签列表
  await Promise.all(promiseList).then(res => {
    res.forEach(r => {
      if (r) {
        let i = tagList.findIndex(tag => tag.tag_name == r.tag_name)
        if (i != -1) {
          tagList[i].id = r.id
        }
      }
    })
  })

  // 文章id和标签id 关联
  if (articleId) {
    let articleTagList = tagList.map(tag => {
      // 组装文章和标签的关联表
      let obj = {
        article_id: articleId,
        tag_id: tag.id,
      }
      return obj
    })
    // 批量新增文章标签关联
    resultList = await createArticleTags(articleTagList)
  }

  return resultList
}

module.exports = {
  createCategoryOrReturn,
  createArticleTagByArticleId,
}
