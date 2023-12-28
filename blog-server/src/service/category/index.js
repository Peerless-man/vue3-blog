const Category = require("../../model/category/category")
const { Op } = require("sequelize")
/**
 * 分类服务层
 */
class CategoryService {
  /**
   * 新增分类
   * @param {*} category
   * @returns Boolean
   */
  async createCategory(category) {
    const { category_name } = category
    const res = await Category.create({ category_name })

    return res.dataValues
  }

  /**
   * 修改分类
   * @param {*} category
   * @returns Boolean
   */
  async updateCategory(category) {
    const { id, category_name } = category
    const res = await Category.update({ category_name }, { where: { id } })

    return res[0] > 0 ? true : false
  }

  /**
   * 删除分类
   * @param {*} idList
   * @returns 删除条数
   */
  async deleteCategories(idList) {
    const res = await Category.destroy({
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
   * 根据id或者分类名称获取分类信息
   * @param { id , category_name}
   * @returns categoryValue
   */
  async getOneCategory({ id, category_name }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    category_name && Object.assign(whereOpt, { category_name })

    const res = await Category.findOne({
      attributes: ["id", "category_name"],
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }

  // 通过分类id获取分类名称
  async getCategoryNameById(id) {
    let res = await Category.findByPk(id)
    return res ? res.dataValues.category_name : null
  }

  // 分页获取分类列表
  async getCategoryList({ current, size, category_name }) {
    const whereOpt = {}
    const offset = (current - 1) * size
    const limit = size * 1

    category_name &&
      Object.assign(whereOpt, {
        category_name: {
          [Op.like]: `%${category_name}%`,
        },
      })

    const { count, rows } = await Category.findAndCountAll({
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

  // 获取分类数据字典
  async getCategoryDictionary() {
    let res = await Category.findAll({
      attributes: ["id", "category_name"],
    })

    return res ? res : null
  }
  
  // 获取分类总数
  async getCategoryCount() {
    let res = await Category.count()
    return res
  }
}

module.exports = new CategoryService()
