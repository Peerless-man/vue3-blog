<script setup>
import { ref, computed, nextTick, onMounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  maxLines: {
    type: Number,
    default: 3,
  },
  width: {
    type: Number,
    default: 0,
  },
  color: {
    String,
    default: "",
  },
  fontSize: {
    type: Number,
    default: 14,
  },
});
const expanded = ref(false);
const showSlotNode = ref(false);

const textOverflowRef = ref(null);
const slotRef = ref(null);
const overEllipsisRef = ref(null);

const offset = ref(props.width); // 元素宽度
const slotBoxWidth = ref(0); // 插槽的宽度
const textBoxWidth = ref(props.width); // 文字宽度

// eslint-disable-next-line vue/return-in-computed-property
const boxStyle = computed(() => {
  if (props.width) {
    return {
      width: props.width + "px",
      fontSize: props.fontSize + "px",
    };
  }
});

const realText = computed(() => {
  // 是否被截取
  const isCutOut =
    offset.value * props.maxLines < props.text.length * props.fontSize + props.fontSize;
  let realText = props.text;
  if (isCutOut && !expanded.value) {
    realText = props.text.slice(0, offset.value) + "...";
  }
  return realText;
});

function calculateOffset(from, to) {
  nextTick(() => {
    if (Math.abs(from - to) <= 1) return;
    if (isOverflow()) {
      to = offset.value;
    } else {
      from = offset.value;
    }
    offset.value = Math.floor((from + to) / 2);
    calculateOffset(from, to);
  });
}
function isOverflow() {
  const { len, lastWidth } = getLines();

  if (len < props.maxLines) {
    return false;
  }
  if (props.maxLines) {
    // 超出部分 行数 > 最大行数 或则  已经是最大行数但最后一行宽度 + 后面内容超出正常宽度
    const lastLineOver = !!(
      len === props.maxLines && lastWidth + slotBoxWidth.value > textBoxWidth.value
    );
    if (len > props.maxLines || lastLineOver) {
      return true;
    }
  }
  return false;
}
function getLines() {
  const clientRects = overEllipsisRef.value.getClientRects();
  if (!clientRects.length) {
    return {
      len: 1,
      lastWidth: 0,
    };
  }
  return {
    len: clientRects.length, // 总共有多少行
    lastWidth: clientRects[clientRects.length - 1].width, // 最后一行的长度
  };
}
function toggle() {
  expanded.value = !expanded.value;
}

onMounted(() => {
  const { len } = getLines();
  if (len > props.maxLines) {
    showSlotNode.value = true; // 展示省略号
    nextTick(() => {
      slotBoxWidth.value = slotRef.value.clientWidth;
      textBoxWidth.value = textOverflowRef.value.clientWidth;
      calculateOffset(0, props.text.length);
    });
  }
});
</script>

<template>
  <div ref="textOverflowRef" :style="boxStyle">
    <span class="keep" ref="overEllipsisRef" :style="{ color }" :title="realText">{{
      realText
    }}</span>
    <span class="slot-box" ref="slotRef" v-if="showSlotNode">
      <slot :click-toggle="toggle" :expanded="expanded" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.slot-box {
  display: inline-block;
}

.keep {
  white-space: pre-line;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
