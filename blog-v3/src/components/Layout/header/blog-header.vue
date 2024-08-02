<script setup>
import { onMounted, onBeforeUnmount, computed, reactive, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { ElNotification } from "element-plus";
import MessageBox from "@/components/MessageBox/message-box.vue";
import SwitchTheme from "@/components/SwitchTheme/index.vue";
import Login from "./login/login.vue";
import { debounce } from "@/utils/tool";

const router = useRouter();
const route = useRoute();
const userStore = user();
const { getBlogAvatar, getUserInfo } = storeToRefs(userStore);
const headerState = reactive({
  drawerShow: false,
  startScrollTop: 0,
  headerClass: "",
  activeIndex: 0,
  scrollTop: 0,
});

const getPath = computed(() => {
  return route.path;
});

// 切换menu
const handleSelect = async (val, type) => {
  if (val == "/logout") {
    await logOut();
    ElNotification({
      offset: 60,
      title: "提示",
      message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "退出成功"),
    });
  } else if (val == "/login") {
    userStore.setShowLogin(true);
  } else {
    router.push(val);
  }
  if (type == "mobile") {
    headerState.drawerShow = false;
  }
};

// 切换抽屉
const handleClose = () => {
  headerState.drawerShow = false;
};

// 去登录
const toLogin = () => {
  userStore.setShowLogin(true);
  headerState.drawerShow = false;
};

// 去个人中心
const toPersonal = () => {
  router.push("/userCenter");
  headerState.drawerShow = false;
};

// 退出登录
const logOut = () => {
  userStore.clearUserInfo();
  if (route.path == "/userCenter") {
    router.push("/home");
  }
};

// 顶部导航固定
const scroll = debounce(() => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const { startScrollTop } = headerState;
  headerState.scrollTop = scrollTop;

  if (scrollTop <= 50) {
    headerState.headerClass = "fixed-header";
    headerState.startScrollTop = scrollTop;
    return;
  }
  if (startScrollTop > scrollTop) {
    headerState.headerClass = "fixed-header";
  } else if (startScrollTop <= scrollTop) {
    headerState.headerClass = "hide-header";
  }
  headerState.startScrollTop = scrollTop;
}, 5);

onMounted(() => {
  // 页面增加滚动事件
  window.addEventListener("scroll", scroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scroll);
});
</script>

<template>
  <div
    :class="['header_box', headerState.headerClass]"
    :style="{
      background: headerState.scrollTop < 50 ? 'transparent' : 'var(--header-bg)',
    }"
  >
    <div class="pc_menu flex_r_between">
      <div class="sub-avatar">
        <router-link v-if="getBlogAvatar" to="/"
          ><el-avatar class="el-avatar" :src="getBlogAvatar" />
        </router-link>
        <MessageBox class="ml-[10px]" v-if="getUserInfo.id" :user-id="getUserInfo.id" type="pc" />
      </div>
      <div class="flex_r_around">
        <BlogSearch></BlogSearch>
        <el-menu
          class="sub-menu"
          mode="horizontal"
          :default-active="getPath"
          :ellipsis="false"
          menu-trigger="click"
          @select="(val) => handleSelect(val, 'pc')"
        >
          <el-menu-item index="/home"><i class="iconfont icon-home"></i> 主页</el-menu-item>
          <el-menu-item index="/archives"><i class="iconfont icon-icon"></i> 时间轴</el-menu-item>
          <el-sub-menu index="/resources">
            <template #title><i class="iconfont icon-menu"></i> 更多</template>
            <!-- <el-menu-item index="/message/chat"
              ><i class="iconfont icon-speechbubble"></i> 聊天室</el-menu-item
            > -->
            <el-menu-item index="/resources/front"
              ><i class="iconfont icon-folder"></i> 前端推荐</el-menu-item
            >
            <el-menu-item index="/resources/back"
              ><i class="iconfont icon-houduankaifa"></i> 后端推荐</el-menu-item
            >
            <!-- <el-menu-item index="/music"><i class="iconfont icon-bofangduilie"></i> 音乐</el-menu-item> -->
          </el-sub-menu>
          <el-menu-item index="/category"><i class="iconfont icon-sort"></i> 分类</el-menu-item>
          <!-- <el-menu-item index="/tag"><i class="iconfont icon-label_fill"></i> 标签</el-menu-item> -->
          <el-menu-item index="/photoAlbum"><i class="iconfont icon-paper"></i> 相册</el-menu-item>
          <el-menu-item index="/talk"><i class="iconfont icon-speechbubble"></i> 说说</el-menu-item>
          <el-menu-item index="/link/list"
            ><i class="iconfont icon-pengyouquan"></i> 友链</el-menu-item
          >
          <el-menu-item index="/message/list"
            ><i class="iconfont icon-liuyan"></i> 留言</el-menu-item
          >
          <el-menu-item index="/login" v-if="!getUserInfo.id"
            ><i class="iconfont icon-timerauto"></i> 登录</el-menu-item
          >
          <div v-else class="user flex justify-center items-center">
            <el-sub-menu index="/#">
              <template #title
                ><el-avatar :src="getUserInfo.avatar" :size="30">{{
                  getUserInfo.nick_name
                }}</el-avatar></template
              >
              <el-menu-item index="/userCenter"
                ><i class="iconfont icon-gerenzhongxin"></i> 个人中心</el-menu-item
              >
              <el-menu-item index="/logout"
                ><i class="iconfont icon-tuichudenglu"></i> 退出</el-menu-item
              >
            </el-sub-menu>
          </div>
        </el-menu>
        <SwitchTheme />
      </div>
    </div>
    <div class="mobile_menu flex_r_between">
      <div class="flex items-center">
        <span class="iconfont icon-menu2" @click="headerState.drawerShow = true"> </span>
        <MessageBox
          class="ml-[10px]"
          v-if="getUserInfo.id"
          :user-id="getUserInfo.id"
          type="mobile"
        />
      </div>

      <div class="flex_r_between">
        <BlogSearch></BlogSearch>
        <el-drawer
          style="background: #484848"
          v-model="headerState.drawerShow"
          direction="ltr"
          :before-close="handleClose"
          :append-to-body="true"
          size="60%"
          :z-index="9999"
        >
          <div class="flex justify-center items-center">
            <el-avatar
              v-if="getUserInfo.id"
              class="el-avatar"
              :src="getUserInfo.avatar"
              :size="80"
              @click="toPersonal"
              >{{ getUserInfo.nick_name }}</el-avatar
            >
            <el-avatar v-else class="el-avatar" :size="80" @click="toLogin">去登录</el-avatar>
          </div>
          <el-menu
            class="sub-menu mt-[5px]"
            :default-active="getPath"
            :ellipsis="false"
            @select="(val) => handleSelect(val, 'mobile')"
          >
            <el-menu-item index="/home"><i class="iconfont icon-home"></i> 主页</el-menu-item>
            <el-menu-item index="/archives"><i class="iconfont icon-icon"></i> 时间轴</el-menu-item>
            <el-sub-menu index="/resources">
              <template #title><i class="iconfont icon-menu"></i> 更多</template>
              <!-- <el-menu-item index="/message/chat"
                ><i class="iconfont icon-speechbubble"></i> 聊天室</el-menu-item
              > -->
              <el-menu-item index="/resources/front"
                ><i class="iconfont icon-folder"></i> 前端推荐</el-menu-item
              >
              <el-menu-item index="/resources/back"
                ><i class="iconfont icon-houduankaifa"></i> 后端推荐</el-menu-item
              >
            </el-sub-menu>
            <el-menu-item index="/category"><i class="iconfont icon-sort"></i> 分类</el-menu-item>
            <el-menu-item index="/tag"><i class="iconfont icon-label_fill"></i> 标签</el-menu-item>
            <el-menu-item index="/photoAlbum"
              ><i class="iconfont icon-paper"></i> 相册</el-menu-item
            >
            <el-menu-item index="/talk"
              ><i class="iconfont icon-speechbubble"></i> 说说</el-menu-item
            >
            <el-menu-item index="/link/list"
              ><i class="iconfont icon-pengyouquan"></i> 友链</el-menu-item
            >

            <el-menu-item index="/message/list"
              ><i class="iconfont icon-liuyan"></i> 留言</el-menu-item
            >
            <el-menu-item v-if="getUserInfo.id" index="/logout"
              ><i class="iconfont icon-tuichudenglu"></i> 退出</el-menu-item
            >
            <!-- <el-sub-menu index="/menu">
              <template #title><i class="iconfont icon-menu21"></i> 菜单</template>
            </el-sub-menu> -->
          </el-menu>
        </el-drawer>
        <SwitchTheme />
      </div>
    </div>
  </div>
  <Login />
</template>

<style lang="scss" scoped>
.header_box {
  .sub-avatar {
    padding: 5px 0 0 0;
    display: flex;
    align-items: center;
  }

  .sub-menu {
    height: 53px;

    .icon-sort {
      font-size: 1.2rem;
    }

    .icon-icon,
    .icon-label_fill {
      font-size: 1.3rem;
    }
  }
}

.pc_menu {
  :deep(.el-sub-menu__icon-arrow) {
    display: none;
  }
}

:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover) {
  background-color: transparent;
}

.iconfont {
  font-size: 1.2rem;
  margin-right: 5px;
}

.icon-menu2 {
  font-size: 1.4rem;
  color: var(--menu-color);
}

.icon-menu {
  font-size: 1.1rem;
}

.icon-pengyouquan {
  font-size: 1.3rem;
}
.icon-timerauto {
  font-size: 1.1rem;
}

.icon-houduankaifa {
  font-size: 1.2rem;
}

.icon-tuichudenglu {
  font-size: 1.3rem;
}

.icon-liuyan {
  font-size: 1.3rem;
}

:deep(.el-drawer__close-btn .el-icon) {
  font-size: 22px;
}

.hide-header {
  animation-name: hideHeader;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
}

.fixed-header {
  animation-name: header;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
}

@keyframes header {
  0% {
    transform: translateY(-52px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes hideHeader {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-52px);
  }
}
</style>
