const { Op } = require("sequelize")
const Tag = require("../../model/tag/tag")

/**
 * 标签服务层
 */
class TagService {
  /**
   * 新增标签
   * @param {*} tag
   * @returns Boolean
   */
  async createTag(tag) {
    const { tag_name } = tag
    const res = await Tag.create({ tag_name })

    return res.dataValues
  }

  /**
   * 修改标签
   * @param {*} tag
   * @returns Boolean
   */
  async updateTag(tag) {
    const { id, tag_name } = tag
    const res = await Tag.update({ tag_name }, { where: { id } })

    return res[0] > 0 ? true : false
  }

  /**
   * 删除标签
   * @param {*} idList
   * @returns 删除条数
   */
  async deleteTags(idList) {
    const res = await Tag.destroy({
      where: {
        id: idList,
        // id: {
        //   [Op.in]: idList,
        // },
      },
    })

    return res
  }

  /**
   * 根据id或者标签名称获取标签信息
   * @param { id , tag_name}
   * @returns tagValue
   */
  async getOneTag({ id, tag_name }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    tag_name && Object.assign(whereOpt, { tag_name })

    const res = await Tag.findOne({
      attributes: ["id", "tag_name"],
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }

  async getTagList({ current, size, tag_name }) {
    const whereOpt = {}
    const offset = (current - 1) * size
    const limit = size * 1

    tag_name &&
      Object.assign(whereOpt, {
        tag_name: {
          [Op.like]: `%${tag_name}%`,
        },
      })

    const { count, rows } = await Tag.findAndCountAll({
      offset,
      limit,
      where: whereOpt,
    })

    return {
      current: current,
      size: size,
      total: count,
      list: rows,
    }
  }

  /**
   * 根据tag_id列表获取tag列表
   * @param {*} tagIdList
   */
  async getTagByTagIdList(tagIdList) {
    let res = await Tag.findAll({
      attributes: ["id", "tag_name"],
      where: {
        id: tagIdList,
      },
    })
    let tagNameList = res.map(v => {
      return v.tag_name
    })
    let obj = {
      tagNameList,
      tagList: res,
    }

    return obj
  }

  // 字典 用于反显tag
  async getTagDictionary() {
    let res = await Tag.findAll({
      attributes: ["id", "tag_name"],
    })

    return res ? res : null
  }

  // 获取标签总数
  async getTagCount() {
    let res = await Tag.count()
    return res
  }
}

module.exports = new TagService()
