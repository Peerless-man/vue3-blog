<script setup>
import { ref, computed, nextTick, watch } from "vue";

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

// eslint-disable-next-line vue/return-in-computed-property
const boxStyle = computed(() => {
  return {
    "color": props.color,
    "fontSize": props.fontSize + "px",
    "whiteSpace": "pre-line",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "display": "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": expanded.value ? "unset" : props.maxLines,
  };
});

function calcIsOverflow() {
  showSlotNode.value = overEllipsisRef.value.scrollHeight > overEllipsisRef.value.clientHeight;
}
function toggle() {
  expanded.value = !expanded.value;
}

watch(
  () => {
    props.text;
  },
  () =>
    nextTick(() => {
      calcIsOverflow();
    }),
  { immediate: true }
);
</script>

<template>
  <div
    class="text-box"
    ref="textOverflowRef"
    :style="{ marginBottom: showSlotNode ? '25px' : '0' }"
  >
    <span class="keep" ref="overEllipsisRef" :title="text" :style="boxStyle">{{ text }} </span>

    <span class="slot-box" ref="slotRef" v-if="showSlotNode">
      <slot :click-toggle="toggle" :expanded="expanded" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.text-box {
  position: relative;
  margin-bottom: 25px;
}

.slot-box {
  display: inline-block;
  position: absolute;
  left: 0;
  bottom: -25px;
}
</style>
