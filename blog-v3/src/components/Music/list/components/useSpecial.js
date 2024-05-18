import { ref } from "vue";
function useSpecialHooks() {
  const specialTitleSize = ref(2.4);
  const authorName = ref(1.4);
  const specialLyricSize = ref(1.8);
  const brightness = ref(0.5);
  const isProfessional = ref(false);
  const bg = ref("");

  function setProfessional() {
    if (isProfessional.value) {
      bg.value = "";
    } else {
      bg.value = "black";
    }

    isProfessional.value = !isProfessional.value;
  }

  // 修改字体的透明度
  function changeBrightness() {
    brightness.value = (brightness.value + 0.1) % 1;
  }

  function changeSpecialTitleSize(type) {
    if (type) {
      if (specialTitleSize.value < 5) {
        specialTitleSize.value += 0.1;
      }
    } else {
      if (specialTitleSize.value > 1) {
        specialTitleSize.value -= 0.1;
      }
    }
  }

  function changeAuthorSize(type) {
    if (type) {
      if (authorName.value < 2.4) {
        authorName.value += 0.1;
      }
    } else {
      if (authorName.value > 0) {
        authorName.value -= 0.1;
      }
    }
  }

  function changeLyricFontSize(type) {
    if (type) {
      if (specialLyricSize.value <= 4) {
        specialLyricSize.value += 0.1;
      }
    } else {
      if (specialLyricSize.value >= 1) {
        specialLyricSize.value -= 0.1;
      }
    }
  }

  return {
    bg,
    brightness,
    specialTitleSize,
    authorName,
    specialLyricSize,
    isProfessional,
    changeBrightness,
    changeSpecialTitleSize,
    changeLyricFontSize,
    setProfessional,
    changeAuthorSize,
  };
}

export default useSpecialHooks;
