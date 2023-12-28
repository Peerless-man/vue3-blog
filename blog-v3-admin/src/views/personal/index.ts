import { ref, reactive, onMounted } from "vue";
import { imgUpload } from "@/api/site";
import {
  getUserInfoById,
  updateUserPassword,
  updateUserInfo
} from "@/api/user";
import { useUserStoreHook } from "@/store/modules/user";

import { message } from "@/utils/message";
import { storageSession } from "@pureadmin/utils";
import { userInfoType } from "@/store/modules/types";
import { ElLoading } from "element-plus";
import { deepClone } from "@/utils/utils";

export function useSite() {
  const myInfoForm = reactive({
    nick_name: "",
    avatar: "",
    avatarList: []
  });
  const primaryMyInfoForm = reactive({});

  const passwordForm = reactive({
    password: "",
    password1: "",
    password2: ""
  });

  const password1V = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请输入新密码"));
    } else if (value.length < 4 || value.length > 16) {
      callback(new Error("密码长度应该在4-16位之间"));
    } else if (value == passwordForm.password) {
      callback(new Error("新密码和旧密码应该不同!"));
    } else {
      callback();
    }
  };
  const password2V = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value.length < 4 || value.length > 16) {
      callback(new Error("密码长度应该在4-16位之间"));
    } else if (value != passwordForm.password1) {
      callback(new Error("二次确认密码与新密码不一致!"));
    } else {
      callback();
    }
  };

  const myInfoRules = reactive({
    nick_name: { required: true, message: "请输入昵称", trigger: "blur" }
  });

  const passwordRules = reactive({
    password: [{ required: true, message: "请输入原密码", trigger: ["blur"] }],
    password1: [{ required: true, validator: password1V, trigger: "blur" }],
    password2: [{ required: true, validator: password2V, trigger: "blur" }]
  });

  const isEditMyInfo = ref(false);
  const isEditPassword = ref(false); // 控制编辑与保存

  async function save(type, formRef) {
    await formRef.validate(async valid => {
      if (valid) {
        switch (type) {
          case "info":
            await updateMyInfo();
            isEditMyInfo.value = false;
            break;
          case "psd":
            isEditPassword.value = false;
            updatePassword();
            break;
          default:
            return;
        }
      }
    });
  }

  function edit(type) {
    switch (type) {
      case "info":
        isEditMyInfo.value = true;
        break;
      case "psd":
        isEditPassword.value = true;
        break;
      default:
        return;
    }
  }

  function cancel(type, ref) {
    ref.clearValidate();
    switch (type) {
      case "info":
        isEditMyInfo.value = false;
        ref.clearValidate();
        Object.assign(myInfoForm, primaryMyInfoForm);
        Object.assign(primaryMyInfoForm, deepClone(myInfoForm));

        break;
      case "psd":
        isEditPassword.value = false;
        ref.clearValidate();
        break;
      default:
        return;
    }
  }

  // 初始化我的信息
  async function initMyInfo() {
    const res = await getUserInfoById(useUserStoreHook().getUserId);
    if (res.code == 0) {
      const { avatar, nick_name } = res.result;
      if (useUserStoreHook()?.getNickName != nick_name) {
        useUserStoreHook()?.SET_NICKNAME(nick_name);
        storageSession().setItem<userInfoType>("blogCurrentUser", {
          nick_name,
          avatar
        });
      }
      if (useUserStoreHook()?.getAvatar != avatar) {
        useUserStoreHook()?.SET_AVATAR(avatar);
        storageSession().setItem<userInfoType>("blogCurrentUser", {
          nick_name,
          avatar
        });
      }

      Object.assign(myInfoForm, res.result);
      if (avatar) {
        myInfoForm.avatarList = [
          {
            id: 1,
            name: avatar.split("/").slice(-1),
            url: avatar
          }
        ];
      }

      Object.assign(primaryMyInfoForm, deepClone(myInfoForm));
    }
  }
  // 修改个人信息
  async function updateMyInfo() {
    if (myInfoForm.avatarList.length && !myInfoForm.avatarList[0].id) {
      const upLoadLoading = ElLoading.service({
        fullscreen: true,
        text: "图片上传中"
      });
      const imgRes = await imgUpload(myInfoForm.avatarList[0]);
      if (imgRes.code == 0) {
        const { url } = imgRes.result;
        myInfoForm.avatar = url;
      }
      upLoadLoading.close();
    }
    if (!myInfoForm.avatarList.length) {
      myInfoForm.avatar = "";
    }

    const res = await updateUserInfo(myInfoForm);
    if (res.code == 0) {
      message("用户修改成功", { type: "success" });
      initMyInfo();
    }
  }

  // 修改密码
  async function updatePassword() {
    const res = await updateUserPassword(passwordForm);
    if (res.code == 0) {
      message("密码修改成功，请重新登录", { type: "success" });
      useUserStoreHook()?.logOut();
    }
  }

  async function init() {
    await initMyInfo();
  }

  onMounted(() => {
    init();
  });

  return {
    myInfoForm,
    myInfoRules,
    passwordForm,
    passwordRules,
    isEditMyInfo,
    isEditPassword,
    edit,
    save,
    cancel
  };
}
