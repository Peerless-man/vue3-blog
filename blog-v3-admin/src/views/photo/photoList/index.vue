<script setup lang="ts" name="PhotoAlbum">
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  EditPen,
  CircleCheck,
  Delete,
  RefreshLeft,
  ToiletPaper,
  Plus
} from "@element-plus/icons-vue";
import { getPhotoListByAlbumId, revertPhotos, deletePhotos } from "@/api/photo";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";
import { useStaticStoreHook } from "@/store/modules/static";

const photoTab = useStaticStoreHook().photoTab;
const route = useRoute();
const router = useRouter();
const photoList = ref([]);
const photoTotal = ref(0);
const param = reactive({
  current: 1,
  size: 40,
  status: 1,
  id: null
});
const currentAlbumName = ref(null);
const isEdit = ref(false);
const previewIndex = ref(0);

const handleSizeChange = val => {
  param.size = val;
  pageGetPhoto();
};

const handleCurrentChange = val => {
  param.current = val;
  pageGetPhoto();
};

const edit = () => {
  isEdit.value = true;
};

const add = () => {
  router.push({
    path: "/photo/addPhotos",
    query: {
      id: param.id,
      albumName: currentAlbumName.value
    }
  });
};

const cancel = () => {
  isEdit.value = false;
};

const previewList = ref([]);

const pageGetPhoto = async () => {
  const res = await getPhotoListByAlbumId(param);
  if (res.code == 0) {
    const { list, total } = res.result;
    photoList.value = list.map(l => {
      return {
        id: l.id,
        url: l.url,
        checked: false
      };
    });
    previewList.value = list.map(l => {
      return l.url;
    });
    photoTotal.value = total;
  }
};
const tabChange = (val: any) => {
  param.status = val.index ? Number(val.index) + 1 : null;
  pageGetPhoto();
};

// 批量删除
const deleteBatch = async () => {
  const list = photoList.value.filter(p => p.checked);
  if (!list.length) {
    message("请选择需要删除的图片", { type: "warning" });
    return;
  }
  const res = await deletePhotos({
    type: param.status,
    imgList: list.map(l => {
      return { id: l.id, url: l.url };
    })
  });
  if (res.code == 0) {
    message("删除成功", { type: "success" });
    isEdit.value = false;
    pageGetPhoto();
  }
};

// 批量恢复
const revertBatch = async () => {
  const list = photoList.value.filter(p => p.checked);
  if (!list.length) {
    message("请选择需要恢复的图片", { type: "warning" });
    return;
  }
  const res = await revertPhotos({
    idList: list.map(l => l.id)
  });
  if (res.code == 0) {
    message("恢复成功", { type: "success" });
    pageGetPhoto();
  }
};

// 清空回收站
const clear = async () => {
  const res = await deletePhotos({
    type: param.status,
    imgList: photoList.value.map(p => {
      return {
        id: p.id,
        url: p.url
      };
    })
  });
  if (res.code == 0) {
    message("清空回收站成功", { type: "success" });
    pageGetPhoto();
  }
};

onMounted(async () => {
  // 初始化
  if (route.query.id && route.query.albumName) {
    const { id, albumName } = route.query;
    currentAlbumName.value = albumName;
    param.id = Number(cloneDeep(id));
  }
  await pageGetPhoto();
});
</script>

<template>
  <el-card class="album">
    <el-tabs @tab-click="tabChange">
      <template v-for="item of photoTab" :key="item.key">
        <el-tab-pane :lazy="true">
          <template #label>
            <el-tooltip :content="item.content" placement="top-end">
              <span>{{ item.title }}</span>
            </el-tooltip>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <template #header>
      <div class="flex_r_b">
        <span style="font-weight: 600; color: #606266"
          >图库名称 - {{ currentAlbumName }}</span
        >
      </div>
      <div class="flex_r_b mt-[5px]">
        <div />
        <div v-if="param.status == 1">
          <template v-if="!isEdit">
            <el-button type="primary" size="small" :icon="Plus" @click="add"
              >新增</el-button
            >
            <el-button type="success" size="small" :icon="EditPen" @click="edit"
              >编辑</el-button
            >
          </template>
          <template v-else>
            <el-button
              type="danger"
              size="small"
              :icon="CircleCheck"
              @click="deleteBatch"
              >批量删除</el-button
            >
            <el-button
              type="info"
              size="small"
              :icon="CircleCheck"
              @click="cancel"
              >取消</el-button
            >
          </template>
        </div>
        <div v-else>
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="deleteBatch"
            >批量删除</el-button
          >
          <el-button
            type="success"
            size="small"
            :icon="RefreshLeft"
            @click="revertBatch"
            >批量恢复</el-button
          >
          <el-button type="info" size="small" :icon="ToiletPaper" @click="clear"
            >清空</el-button
          >
        </div>
      </div>
    </template>
    <div class="album-upload">
      <template v-if="!photoList.length">
        <el-empty />
      </template>
      <template v-else>
        <div
          class="retrieve-box"
          v-for="(item, index) in photoList"
          :key="item.id"
        >
          <el-checkbox
            class="retrieve-box__checkbox"
            v-model="item.checked"
            v-if="(isEdit && param.status == 1) || param.status == 2"
          />
          <el-image
            class="retrieve-box__img"
            fit="cover"
            :data-src="item.url"
            :src="item.url"
            :initial-index="previewIndex"
            :preview-src-list="photoList.map(v => v.url)"
            @click="previewIndex = index"
          />
        </div>
      </template>
    </div>
    <el-pagination
      class="pagination"
      v-model:current-page="param.current"
      v-model:page-size="param.size"
      :page-sizes="[40, 60, 100, 200]"
      :small="true"
      :disabled="false"
      :background="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="photoTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.album-upload {
  height: calc(100vh - 280px);
  overflow: auto;
}

.album-upload::-webkit-scrollbar {
  display: none;
}

:deep(.el-card__body) {
  padding: 5px 5px 0 5px !important;
}

.pagination {
  margin: 0 0 10px 10px;
}

.flex_r_b {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.operate {
  width: 30%;

  &:hover {
    cursor: pointer;
  }
}

.retrieve-box {
  margin: 5px;
  width: 108px;
  height: 108px;
  position: relative;
  display: inline-block;

  &__checkbox {
    position: absolute;
    top: -3px;
    right: 5px;
  }

  &__img {
    width: 100%;
    height: 100%;
  }
}
</style>
