const Photo = require("../../model/photo/photo")
/**
 * 图片服务层
 */
class PhotoService {
  /**
   * 批量新增图片
   * @returns
   */
  async addPhotos(photoList) {
    let res = await Photo.bulkCreate(photoList)

    return res
  }

  /**
   * 批量删除图片
   * @param {*} idList
   */
  async deletePhotos(idList, type) {
    let res
    if (Number(type) == 1) {
      res = await Photo.update(
        { status: 2 },
        {
          where: {
            id: idList,
          },
        }
      )
    } else {
      res = await Photo.destroy({
        where: {
          id: idList,
        },
      })
    }

    return res
  }

  /** 批量恢复图片 */
  async revertPhotos(idList) {
    let res = await Photo.update(
      { status: 1 },
      {
        where: {
          id: idList,
        },
      }
    )

    return res
  }

  /**
   * 获取图片列表
   */
  async getPhotosByAlbumId({ current, size, id, status }) {
    const offset = size * (current - 1)
    const limit = size * 1

    let { rows, count } = await Photo.findAndCountAll({
      limit,
      offset,
      where: {
        album_id: id,
        status,
      },
    })

    return {
      current,
      size,
      list: rows,
      total: count,
    }
  }

  /**
   * 根据相册id删除图片
   */
  async deletePhotosByAlbumId(album_id) {
    let res = await Photo.destroy({
      where: {
        album_id,
      },
    })

    return res
  }

  async getAllPhotosByAlbumId(album_id) {
    let res = await Photo.findAll({
      where: {
        album_id,
        status: 1,
      },
      order: [["createdAt", "DESC"]],
    })

    return res
  }
}

module.exports = new PhotoService()
