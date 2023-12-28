<script setup>
import gsap from "gsap";
import { onMounted } from "vue";

onMounted(() => {
  const select = (e) => document.querySelector(e);
  const selectAll = (e) => document.querySelectorAll(e);

  const container = select(".container");
  const cuboid = selectAll(".hi__cuboid");
  const hiWords = selectAll(".hi__word");
  let winW = 0;
  let winH = 0;
  let pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  function init() {
    setWinDimensions();
    console.log(container);
    gsap.set(container, { autoAlpha: 1 });

    gsap.timeline({ delay: 0.5 }).from(
      cuboid,
      {
        y: winH,
        duration: 3,
        stagger: 0.14,
        ease: "elastic(0.4,0.3)",
      },
      0
    );

    gsap.to(cuboid, {
      rotateX: -360,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    gsap.fromTo(
      cuboid,
      {
        rotateY: 8,
        rotate: -10,
      },
      {
        rotateY: -8,
        rotate: 10,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      }
    );
  }

  function setWinDimensions() {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }

  function calcOffset(xPos, yPos) {
    let dX = (2 * (xPos - winW / 2)) / winW;
    let dY = (-2 * (yPos - winH / 2)) / winH;
    return [dX, dY];
  }

  function followPointer(pX, pY) {
    let nPos = calcOffset(pX, pY); // get cursor position from center
    let nX = nPos[0];
    let nY = nPos[1];
    let positiveX = Math.sqrt(nX * nX);
    let positiveY = Math.sqrt(nY * nY);
    let deltaS = 450 * positiveX;
    let deltaW = 600 * positiveY;
    gsap.to(hiWords, {
      fontStretch: `${550 - deltaS}%`,
      fontWeight: 800 - deltaW,
      duration: 2,
    });
  }

  window.addEventListener("mousemove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    followPointer(pointer.x, pointer.y);
  });

  window.addEventListener("touchmove", function (event) {
    pointer.x = event.touches[0].clientX;
    pointer.y = event.touches[0].clientY;
    followPointer(pointer.x, pointer.y);
  });

  window.addEventListener("touchstart", function (event) {
    pointer.x = event.touches[0].clientX;
    pointer.y = event.touches[0].clientY;
    followPointer(pointer.x, pointer.y);
  });
  init();
  window.onresize = setWinDimensions;
});
</script>

<template>
  <div class="home_bg">
    <div class="container">
      <div class="hi">
        <div class="hi__cuboid">
          <div class="face face--front"><p class="hi__word">Hello</p></div>
          <div class="face face--back"><p class="hi__word">Hello</p></div>
          <div class="face face--top"><p class="hi__word">Hello</p></div>
          <div class="face face--bottom"><p class="hi__word">Hello</p></div>
        </div>
        <div class="hi__cuboid">
          <div class="face face--front"><p class="hi__word">From</p></div>
          <div class="face face--back"><p class="hi__word">From</p></div>
          <div class="face face--top"><p class="hi__word">From</p></div>
          <div class="face face--bottom"><p class="hi__word">From</p></div>
        </div>
        <div class="hi__cuboid">
          <div class="face face--front"><p class="hi__word">M</p></div>
          <div class="face face--back"><p class="hi__word">M</p></div>
          <div class="face face--top"><p class="hi__word">M</p></div>
          <div class="face face--bottom"><p class="hi__word">M</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home_bg {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

@font-face {
  font-family: "Bandeins-Strange";
  src: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/61488/BandeinsStrangeVariableGX.ttf")
    format("truetype");
  font-stretch: 100% 800%;
  font-weight: 200 800;
  font-display: block;
}

@mixin cuboid($cWidth, $cHeight, $cDepth, $cColor) {
  position: relative;
  width: $cWidth;
  height: $cHeight;
  transform-style: preserve-3d;

  .face {
    position: absolute;
    left: 0;
    top: 0;
    background-color: $cColor;
  }

  .face--front {
    width: $cWidth;
    height: $cHeight;
    transform: translateZ(calc(#{$cDepth}/ 2));
  }

  .face--back {
    width: $cWidth;
    height: $cHeight;
    transform: translateZ(calc(#{$cDepth}/ 2 * -1)) rotateY(180deg) rotate(180deg);
  }

  .face--left {
    width: $cDepth;
    height: $cHeight;
    transform: translateX(calc(#{$cDepth}/ 2 * -1)) rotateY(-90deg);
  }

  .face--right {
    width: $cDepth;
    height: $cHeight;
    transform: translateX(calc(#{$cWidth} - #{$cDepth}/ 2)) rotateY(90deg);
  }

  .face--top {
    width: $cWidth;
    height: $cDepth;
    transform: translateY(calc(#{$cDepth}/ 2 * -1)) rotateX(90deg);
  }

  .face--bottom {
    width: $cWidth;
    height: $cDepth;
    transform: translateY(calc(#{$cHeight} - #{$cDepth}/ 2)) rotateX(-90deg);
  }
}

:root {
  --grey: #5e5d5e;
  --mid-grey: #3f3f3f;
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html,
body {
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  font-family: "Bandeins-Strange";
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  background-size: 50px 50px;
  background-position: center;
  background-image: linear-gradient(to right, var(--mid-grey) 1px, transparent 1px),
    linear-gradient(to bottom, var(--mid-grey) 1px, transparent 1px);
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  visibility: hidden;
}

.hi {
  position: relative;
  z-index: 1;
  font-size: 100px;
  font-stretch: 400%;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  text-align: center;
  transform-style: preserve-3d;
}

.hi__cuboid {
  @include cuboid(500px, 70px, 70px, black);
  margin: 30px 0;
}

.face {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &.face--top,
  &.face--bottom {
    background: white;
    color: black;
  }
}

.hi__word {
  margin: 0;
  transform: translateY(-5px);
}
</style>
