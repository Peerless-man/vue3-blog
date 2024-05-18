<script setup lang="ts" name="PhotoAlbum">
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { Plus, Edit, Delete, Paperclip } from "@element-plus/icons-vue";
import Upload from "@/components/Upload/upload.vue";
import { getAlbumList, addAlbum, updateAlbum, deleteAlbum } from "@/api/photo";
import { imgUpload } from "@/api/site";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";
import { ElLoading } from "element-plus";
const coverV = (rule, value, cb) => {
  if (!albumForm.coverList.length) {
    return new Error("请上传相册封面");
  }
  cb();
};

const router = useRouter();
const albumList = ref([]);
const albumTotal = ref(0);
const param = reactive({
  current: 1,
  size: 8,
  album_name: ""
});

// 相册新增 编辑有关
const dialogVisible = ref(false);
const albumFormRef = ref();
const albumForm = reactive({
  id: "",
  album_name: "",
  description: "",
  album_cover: "",
  coverList: []
});
const primaryAlbumForm = reactive({ ...albumForm });
const albumFormRules = reactive({
  album_name: {
    required: true,
    message: "请输入相册名称",
    trigger: ["blur"]
  },
  description: {
    required: true,
    message: "请输入相册描述",
    trigger: ["blur"]
  },
  album_cover: {
    required: true,
    validator: coverV,
    trigger: ["change"]
  }
});

const closeDialog = () => {
  albumFormRef.value.resetFields();
  Object.assign(albumForm, primaryAlbumForm);
  dialogVisible.value = false;
};

// 提交表单
const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      // 先进行图片上传
      if (!albumForm.coverList[0].id) {
        const upLoadLoading = ElLoading.service({
          fullscreen: true,
          text: "图片上传中"
        });
        const imgRes = await imgUpload(albumForm.coverList[0]);
        if (imgRes.code == 0) {
          const { url } = imgRes.result;
          albumForm.album_cover = url;
        }
        upLoadLoading.close();
      } else {
        albumForm.album_cover = albumForm.coverList[0].url;
      }

      let res;
      if (albumForm.id) {
        res = await updateAlbum(albumForm);
      } else {
        res = await addAlbum(albumForm);
      }
      if (res.code == 0) {
        await pageGetAlbum();
        message(`${albumForm.id ? "修改" : "新增"}成功`, { type: "success" });
        formEl.resetFields();
        dialogVisible.value = false;
      }
    }
  });
};

const handleSizeChange = val => {
  param.size = val;
  pageGetAlbum();
};

const handleCurrentChange = val => {
  param.current = val;
  pageGetAlbum();
};

const operate = (type, val?) => {
  switch (type) {
    case "edit":
      Object.assign(albumForm, cloneDeep(val));
      dialogVisible.value = true;
      break;
    case "delete":
      deleteAlbumById(val);
      break;
    case "photos":
      router.push({
        path: "/photo/photoList",
        query: {
          id: val.id,
          albumName: val.album_name
        }
      });
      break;
    case "add":
      dialogVisible.value = true;
      break;
    default:
      return;
  }
};

const deleteAlbumById = async id => {
  const res = await deleteAlbum(id);
  if (res.code == 0) {
    pageGetAlbum();
    message("删除成功", { type: "success" });
  }
};

const pageGetAlbum = async () => {
  const res = await getAlbumList(param);
  if (res.code == 0) {
    const { list, total } = res.result;
    albumList.value = list.map(l => {
      return {
        id: l.id,
        album_name: l.album_name,
        description: l.description,
        album_cover: l.album_cover,
        coverList: [
          {
            id: 1,
            url: l.album_cover
          }
        ]
      };
    });
    albumTotal.value = total;
  }
};

onMounted(() => {
  pageGetAlbum();
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex_r_b">
        相册管理
        <el-button
          type="primary"
          :icon="Plus"
          size="small"
          @click="operate('add')"
          >新增</el-button
        >
      </div>
    </template>
    <el-row class="album">
      <el-col
        style="padding: 10px"
        :xs="24"
        :sm="12"
        :md="6"
        v-for="item in albumList"
        :key="item.id"
      >
        <div class="album-card">
          <div class="flex_r_b pad5">
            <div class="album-title" @click="operate('photos', item)">
              <span :title="item.album_name">{{ item.album_name }}</span>
            </div>
            <div class="operate flex_r_b">
              <el-icon
                class="mr-[5px]"
                color="#67c23a"
                size="18"
                @click="operate('photos', item)"
              >
                <Paperclip />
              </el-icon>
              <el-icon color="#66b1ff" size="18" @click="operate('edit', item)">
                <Edit />
              </el-icon>
              <el-popconfirm
                :title="`删除相册-${item.album_name}?`"
                icon-color="#66b1ff"
                @confirm="operate('delete', item.id)"
              >
                <template #reference>
                  <el-icon color="#f56c6c" size="16" style="margin-left: 5px">
                    <Delete />
                  </el-icon>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <span :title="item.desc" class="album-desc">{{
            item.description
          }}</span>
          <el-image
            class="album-image animate__animated animate__fadeIn"
            :src="item.album_cover"
            fit="cover"
            loading="lazy"
            preview-teleported
            :preview-src-list="[item.album_cover]"
          />
        </div>
      </el-col>
    </el-row>
    <el-pagination
      class="pagination"
      v-model:current-page="param.current"
      v-model:page-size="param.size"
      :page-sizes="[8, 12, 16]"
      :small="true"
      :disabled="false"
      :background="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="albumTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="albumForm.id ? '编辑相册' : '新增相册'"
      v-model="dialogVisible"
      :width="400"
      :before-close="closeDialog"
    >
      <el-form
        ref="albumFormRef"
        :inline="true"
        :model="albumForm"
        :rules="albumFormRules"
        class="bg-bg_color w-[99/100]"
        label-width="100"
      >
        <el-form-item class="form-item80" label="相册名称" prop="album_name">
          <el-input
            v-model="albumForm.album_name"
            placeholder="请输入相册名称"
            clearable
            maxlength="25"
          />
        </el-form-item>
        <el-form-item class="form-item80" label="相册描述" prop="description">
          <el-input
            type="textarea"
            v-model="albumForm.description"
            placeholder="请输入相册描述"
            clearable
            maxlength="25"
          />
        </el-form-item>
        <el-form-item class="cover" label="封面" prop="album_cover">
          <Upload
            v-model:fileList="albumForm.coverList"
            :width="200"
            :height="200"
            :limit="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="closeDialog()">取消</el-button>
        <el-button
          size="small"
          type="danger"
          plain
          @click="submitForm(albumFormRef)"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.album {
  height: calc(100vh - 210px);
  overflow: auto;

  &-card {
    position: relative;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  }

  &-title {
    font-weight: 600;
    width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: all 0.5s;
    color: #606266;
    vertical-align: baseline;

    &:hover {
      cursor: pointer;
      color: #66b1ff;
    }
  }

  &-desc {
    font-size: 0.8em;
    display: inline-block;
    padding: 0px 10px;
    width: 95%;
    color: #606266;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-image {
    vertical-align: bottom;
    width: 100%;
    position: relative;
    transition: all 0.5s;

    &:hover {
      cursor: pointer;
    }
  }
}

:deep(.el-card__body) {
  padding: 0 !important;
}

.pagination {
  margin: 0 0 10px 10px;
}

.flex_r_b {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operate {
  &:hover {
    cursor: pointer;
  }
}

.pad5 {
  padding: 5px;
}

.form-item {
  &50 {
    width: 50%;
    font-weight: bold;
  }

  &80 {
    width: 80%;
    font-weight: bold;
  }
}

.cover {
  font-weight: bold;

  :deep(.el-form-item__content) {
    width: 200px;
    height: 200px;
  }

  :deep(.el-upload-list__item) {
    width: 200px !important;
    height: 200px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0;
  }

  :deep(.el-upload-list--picture-card) {
    width: 200px !important;
    height: 200px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0;
  }

  :deep(.el-upload--picture-card) {
    width: 200px !important;
    height: 200px !important;
    border-radius: 0;
  }
}

@media screen and (max-width: 798px) {
  .album-image {
    height: 240px;
  }
}

@media screen and (min-width: 799px) {
  .album-image {
    height: 200px;
  }
}
</style>
