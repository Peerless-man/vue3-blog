const { Op } = require("sequelize")
const PhotoAlbum = require("../../model/photo/photoAlbum")
const { deletePhotosByAlbumId } = require("../photo/index")
/**
 * 相册服务层
 */
class PhotoAlbumService {
  /**
   * 新增相册
   * @param {*} param0  相册名称 param1 相册描述信息
   * @returns
   */
  async addAlbum({ album_name, album_cover, description }) {
    let res = await PhotoAlbum.create({ album_name, album_cover, description })

    return res
  }

  /**
   * 根据id删除相册
   * @param {*} id
   */
  async deleteAlbum(id) {
    let res = await PhotoAlbum.destroy({
      where: {
        id,
      },
    })
    // 删除相册下的图片
    await deletePhotosByAlbumId(id)

    return res > 0 ? true : false
  }

  /**
   * 编辑相册
   * @param {*} param0  id param1 相册名称 param2 相册描述
   */
  async updateAlbum({ id, album_name, album_cover, description }) {
    let res = await PhotoAlbum.update(
      { album_name, album_cover, description },
      {
        where: {
          id,
        },
      }
    )

    return res[0] > 0 ? true : false
  }

  /**
   * 获取相册列表
   */
  async getAlbumList({ current, size, album_name }) {
    const offset = size * (current - 1)
    const limit = size * 1
    const whereOpt = {}

    album_name &&
      Object.assign(whereOpt, {
        album_name: {
          [Op.like]: `%${album_name}%`,
        },
      })

    let { rows, count } = await PhotoAlbum.findAndCountAll({
      limit,
      offset,
      where: whereOpt,
    })

    return {
      current,
      size,
      list: rows,
      total: count,
    }
  }

  /**
   * 根据id 或 相册名称获取相册信息
   */
  async getOneAlbum({ id, album_name }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    album_name && Object.assign(whereOpt, { album_name })

    let res = await PhotoAlbum.findOne({
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }

  // 获取所有的相册
  async getAllAlbumList() {
    let res = await PhotoAlbum.findAll({
      order: [["createdAt", "DESC"]],
    })

    return res
  }
}

module.exports = new PhotoAlbumService()
