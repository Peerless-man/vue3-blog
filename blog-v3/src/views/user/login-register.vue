<!-- 用户登录注册  -->
<script setup>
import { ref, reactive, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";

import { reqLogin, reqRegister, getUserInfoById } from "@/api/user";

import { user } from "@/store/index.js";
import { getWelcomeSay, _getLocalItem, _setLocalItem, _removeLocalItem } from "@/utils/tool";
// 本地数据加密解密
import { _encrypt, _decrypt } from "@/utils/encipher";

import { ElNotification } from "element-plus";
import SwitchTheme from "@/components/SwitchTheme/index.vue";

const userStore = user();
const route = useRoute();
const router = useRouter();

const usernameV = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入用户账号"));
  } else if (value.length > 16 || value.length < 5) {
    return cb(new Error("用户账号长度应该在5-16之间"));
  }
  cb();
};
const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;
const password1V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入密码"));
  } else if (!REGEXP_PWD.test(value)) {
    return cb(new Error("密码格式应为8-18位数字、字母、符号的任意两种组合"));
  }
  cb();
};
const password2V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入二次确认密码"));
  } else if (value != registerForm.password1) {
    return cb(new Error("两次密码不一致"));
  }
  cb();
};

const loginFormRef = ref();
const loginForm = reactive({
  username: "",
  password: "",
});
const isRemember = ref(false);
const primaryLoginForm = reactive({ ...loginForm });

const registerFormRef = ref();
const registerForm = reactive({
  username: "", // 用户名
  password1: "", // 密码
  password2: "", // 确认密码
  nick_name: "", // 昵称
});
const primaryRegisterForm = reactive({ ...registerForm });

const loginRules = {
  username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
};
const registerRules = {
  username: [{ required: true, validator: usernameV, trigger: "blur" }],
  password1: [{ required: true, validator: password1V, trigger: "blur" }],
  password2: [{ required: true, validator: password2V, trigger: "blur" }],
};

// 用户注册
const userRegister = async () => {
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      const register = {
        username: registerForm.username,
        password: registerForm.password1,
        nick_name: registerForm.nick_name,
      };
      const res = await reqRegister(register);
      if (res && res.code == 0) {
        ElNotification({
          offset: 60,
          title: "提示",
          message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "注册成功"),
        });
        // 自动登录
        await userLogin("register");
      } else {
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
        });
      }
    }
  });
};

const welcome = (id, nick_name) => {
  // 欢迎
  let msg = getWelcomeSay(nick_name);
  if (id == 3) {
    msg = "小婷光临，真是三生有幸";
  }
  ElNotification({
    offset: 60,
    title: "欢迎～",
    message: h("div", { style: "font-weight: 600;" }, msg),
  });
};

// 用户登录
const userLogin = async (type) => {
  // 如果是用户注册以后进行登录的 参数需要整合一下
  if (type == "register") {
    const loginForm = {
      username: registerForm.username,
      password: registerForm.password1,
    };

    const res = await reqLogin(loginForm);
    if (res && res.code == 0) {
      // 保存 token
      await userStore.setToken(res.result.token);
      // 记住密码
      _setLocalItem("loginForm", _encrypt(loginForm));

      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "自动登录成功"),
      });
      // 获取并保存当前用户信息
      const userRes = await getUserInfoById(res.result.id);
      if (userRes.code == 0) {
        await userStore.setUserInfo(userRes.result);
        Object.assign(registerForm, primaryRegisterForm);
        const { id, nick_name } = userRes.result;
        await welcome(id, nick_name);
        if (_getLocalItem("blogLastRouter")) {
          router.push(_getLocalItem("blogLastRouter"));
        } else {
          router.go(-2);
        }
      } else {
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
        });
      }
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  } else {
    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await reqLogin(loginForm);
        const token = res.result.token;
        if (res && res.code == 0) {
          // 保存 token
          await userStore.setToken(token);
          ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "登录成功"),
          });
          if (isRemember.value) {
            // 记住密码
            _setLocalItem("loginForm", _encrypt(loginForm));
          } else {
            _removeLocalItem("loginForm");
          }
          // 获取并保存当前用户信息
          const userRes = await getUserInfoById(res.result.id);
          if (userRes.code == 0) {
            await userStore.setUserInfo(userRes.result);
            Object.assign(loginForm, primaryLoginForm);
            const { id, nick_name } = userRes.result;
            await welcome(id, nick_name);
            if (_getLocalItem("blogLastRouter")) {
              router.push(_getLocalItem("blogLastRouter"));
            } else {
              router.go(-1);
            }
          } else {
            ElNotification({
              offset: 60,
              title: "错误提示",
              message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
            });
          }
        } else {
          ElNotification({
            offset: 60,
            title: "错误提示",
            message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
          });
        }
      }
    });
  }
};

const goTo = (path) => {
  router.push(path);
};

// 提交
const submit = () => {
  if (route.name == "Login") {
    userLogin();
  } else {
    userRegister();
  }
};

watch(
  () => route.name,
  (newV) => {
    if (newV == "Login") {
      loginFormRef.value && loginFormRef.value.resetFields();
      // 判断用户是否被记住了
      let form = _decrypt(_getLocalItem("loginForm"));
      if (form) {
        isRemember.value = true;
        Object.assign(loginForm, JSON.parse(form));
      }
    } else {
      registerForm.valid && registerFormRef.value.resetFields();
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="layout">
    <div class="center-box flex flex-col justify-start items-center">
      <h1 class="welcome" @click="goTo('/home')">欢迎来到小张的个人博客</h1>
      <div class="login-register-bg">
        <div class="login-register-box">
          <div class="flex justify-between items-center !w-[100%]">
            <span class="title">{{ route.name == "Login" ? "登录" : "注册" }}</span>
            <div v-if="route.name == 'Login'" class="no-account">
              没有账号？<span class="line" @click="goTo('/register')">去注册</span>
            </div>
            <div v-if="route.name == 'Register'" class="no-account">
              已有账号？<span class="line" @click="goTo('/login')">去登录</span>
            </div>
          </div>
          <el-form
            v-if="route.name == 'Login'"
            class="login-register-form"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :style="{ width: '100%' }"
                placeholder="请输入用户名"
                clearable
                @keyup.enter="submit"
              />
            </el-form-item>
            <el-form-item prop="password" @keyup.enter="submit">
              <el-input
                v-model="loginForm.password"
                show-password
                :style="{ width: '100%' }"
                placeholder="请输入密码"
                clearable
              />
            </el-form-item>
            <el-form-item class="remember-me">
              <div class="flex justify-between items-center w-[100%]">
                <el-checkbox v-model="isRemember">记住我</el-checkbox>
                <span></span>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="flex justify-between items-center w-[100%]">
                <span class="apply-button" type="danger" @click="submit">登录</span>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            v-else
            class="login-register-form"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                :style="{ width: '100%' }"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="registerForm.nick_name"
                :style="{ width: '199%' }"
                placeholder="请输入昵称"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password1">
              <el-input
                show-password
                v-model="registerForm.password1"
                :style="{ width: '100%' }"
                placeholder="请输入密码"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password2">
              <el-input
                show-password
                v-model="registerForm.password2"
                :style="{ width: '100%' }"
                placeholder="确认密码"
                clearable
                @keyup.enter="submit"
              />
            </el-form-item>
            <el-form-item>
              <div class="flex justify-between items-center w-[100%]">
                <span class="apply-button" @click="submit">注册</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <SwitchTheme class="switch-theme" />
        <span class="go-home" @click="goTo('/home')">想回到过去</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  background: #f7f7f7 !important;
}
.center-box {
  position: relative;
  min-height: 100vh !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;

  .switch-theme {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .go-home {
    position: absolute;
    left: 10px;
    top: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
}
.welcome {
  cursor: pointer;
  line-height: 2.4;
}

.login-register-bg {
  width: 80%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.3);
}

.login-register-box {
  width: 30vw;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    font-size: 26px;
    font-weight: 700;
  }
}

.login-register {
  &-form {
    width: 100%;
  }
  &-button {
    width: 100%;
    height: 24px;
    padding: 0 30px;
    background-color: var(--border-color);
    border: none;
    transition: all 0.5s;
    &:hover {
      background-color: var(--primary);
    }
  }
}
.apply-button {
  width: 100%;
  text-align: center;
  padding: 0 20px;
  background-color: var(--primary);
  border: 3px solid var(--primary);
  border-radius: 0;

  &:hover {
    color: #fff;
    border: 3px solid var(--border-color);
    background-color: var(--border-color);
  }
}
.line {
  cursor: pointer;
  text-decoration: underline;
}
.no-account {
  font-size: 0.8rem;
}

:deep(.el-form-item) {
  padding: 15px 0;
}

:deep(.el-input__wrapper) {
  height: 40px;
  line-height: 40px;
}

.remember-me {
  padding: 0;
}

// pc
@media screen and (min-width: 768px) {
  .center_box {
    padding: 2.8rem 10px;
    max-width: 1000px;
    margin: 0 auto;
    min-height: calc(100vh - 35rem);
  }
}

// mobile
@media screen and (max-width: 768px) {
  .login-register-bg {
    width: 90%;
  }

  .login-register-box {
    width: 80%;
  }

  .center-box {
    padding: 1.6rem 10px;
    max-width: 1000px;
    margin: 0 auto;
    min-height: calc(100vh - 35rem);
  }
}
</style>
