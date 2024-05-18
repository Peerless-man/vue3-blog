<template>
  <div class="mac-box">
    <div class="macbook">
      <div class="inner">
        <div class="screen">
          <div class="face-one">
            <div class="camera"></div>
            <div class="display">
              <div class="shade"></div>
            </div>
            <span>MacBook Pro</span>
          </div>
          <img src="../../assets/img/apple-logo-white.svg" class="logo" />
        </div>
        <div class="body">
          <div class="face-one">
            <div class="touchpad"></div>
            <div class="keyboard">
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key space"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
              <div class="key f"></div>
            </div>
          </div>
          <div class="pad one"></div>
          <div class="pad two"></div>
          <div class="pad three"></div>
          <div class="pad four"></div>
        </div>
      </div>
      <div class="shadow"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mac-box {
  // background: var(--global-white);
  width: 100%;
  height: 100vh;
  background-color: #86868b !important;
}
.macbook {
  width: 146px;
  height: 96px;
  position: absolute;
  left: 50%;
  top: 25%;
  // margin: -75px 0 0 -48px;
  transform: translate(-50%, -50%);
  perspective: 500px;
}
.shadow {
  position: absolute;
  width: 60px;
  height: 0px;
  left: 40px;
  top: 160px;
  transform: rotateX(80deg) rotateY(0deg) rotateZ(0deg);
  box-shadow: 0 0 60px 40px rgba(0, 0, 0, 0.3);
  animation: shadow infinite 12s ease;
}
.inner {
  z-index: 20;
  position: absolute;
  width: 146px;
  height: 96px;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
  animation: rotate infinite 12s ease;
}
.screen {
  width: 146px;
  height: 96px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  background: #ddd;
  transform-style: preserve-3d;
  transform-origin: 50% 93px;
  transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  animation: lid-screen infinite 12s ease;
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0) 100%);
  background-position: left bottom;
  background-size: 300px 300px;
}
.screen .logo {
  position: absolute;
  width: 20px;
  height: 24px;
  left: 50%;
  top: 50%;
  margin: -12px 0 0 -10px;
  transform: rotateY(180deg) translateZ(0.1px);
}
.screen .face-one {
  width: 146px;
  height: 96px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  background: #222;
  transform: translateZ(0.5px);
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0) 100%);
}
.screen .face-one .camera {
  width: 15px;
  height: 3px;
  /* border-radius: 100%; */
  background: var(--global-black);
  position: absolute;
  z-index: 21;
  left: 50%;
  top: 0px;
  margin-left: -7.5px;
}
.screen .face-one .display {
  width: 145px;
  height: 87px;
  margin: 1px;
  background: url("../../assets/img/macbookpro.png") no-repeat center center var(--global-black);
  background-size: 100% 100%;
  border-radius: 4px;
  position: relative;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 1);
}
.screen .face-one .display .shade {
  position: absolute;
  left: 0;
  top: 0;
  width: 130px;
  height: 74px;
  background: linear-gradient(
    -135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 47%,
    rgba(255, 255, 255, 0) 48%
  );
  animation: screen-shade infinite 12s ease;
  background-size: 300px 200px;
  background-position: 0px 0px;
}
.screen .face-one span {
  position: absolute;
  top: 89px;
  left: 66px;
  font-size: 3px;
  color: #666;
}

.body {
  width: 146px;
  height: 96px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  background: #cbcbcb;
  transform-style: preserve-3d;
  transform-origin: 50% bottom;
  transform: rotateX(-90deg);
  animation: lid-body infinite 12s ease;
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0) 100%);
}
.body .face-one {
  width: 146px;
  height: 96px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  transform-style: preserve-3d;
  background: #dfdfdf;
  animation: lid-keyboard-area infinite 12s ease;
  transform: translateZ(-1px);
  background-image: linear-gradient(30deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0) 100%);
}
.body .touchpad {
  width: 50px;
  height: 38px;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 4px;
  margin: -46px 0 0 -25px;
  background: #cdcdcd;
  background-image: linear-gradient(30deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0) 100%);
  box-shadow: inset 0 0 3px #888;
}
.body .keyboard {
  width: 130px;
  height: 45px;
  position: absolute;
  left: 7px;
  top: 41px;
  border-radius: 4px;
  transform-style: preserve-3d;
  background: #cdcdcd;
  background-image: linear-gradient(30deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0) 100%);
  box-shadow: inset 0 0 3px #777;
  padding: 0 0 0 2px;
}
.keyboard .key {
  width: 6px;
  height: 6px;
  background: #444;
  float: left;
  margin: 1px;
  transform: translateZ(-2px);
  border-radius: 2px;
  box-shadow: 0 -2px 0 #222;
  animation: keys infinite 12s ease;
}
.key.space {
  width: 46px;
}
.key.f {
  height: 3px;
}
.body .pad {
  width: 5px;
  height: 5px;
  background: #333;
  border-radius: 100%;
  position: absolute;
}
.pad.one {
  left: 20px;
  top: 20px;
}
.pad.two {
  right: 20px;
  top: 20px;
}
.pad.three {
  right: 20px;
  bottom: 20px;
}
.pad.four {
  left: 20px;
  bottom: 20px;
}

@keyframes rotate {
  0% {
    transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
  }
  5% {
    transform: rotateX(-20deg) rotateY(-20deg) rotateZ(0deg);
  }
  20% {
    transform: rotateX(30deg) rotateY(200deg) rotateZ(0deg);
  }
  25% {
    transform: rotateX(-60deg) rotateY(150deg) rotateZ(0deg);
  }
  60% {
    transform: rotateX(-20deg) rotateY(130deg) rotateZ(0deg);
  }
  65% {
    transform: rotateX(-20deg) rotateY(120deg) rotateZ(0deg);
  }
  80% {
    transform: rotateX(-20deg) rotateY(375deg) rotateZ(0deg);
  }
  85% {
    transform: rotateX(-20deg) rotateY(357deg) rotateZ(0deg);
  }
  87% {
    transform: rotateX(-20deg) rotateY(360deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(-20deg) rotateY(360deg) rotateZ(0deg);
  }
}

@keyframes lid-screen {
  0% {
    transform: rotateX(0deg);
    background-position: left bottom;
  }
  5% {
    transform: rotateX(50deg);
    background-position: left bottom;
  }
  20% {
    transform: rotateX(-90deg);
    background-position: -150px top;
  }
  25% {
    transform: rotateX(15deg);
    background-position: left bottom;
  }
  30% {
    transform: rotateX(-5deg);
    background-position: right top;
  }
  38% {
    transform: rotateX(5deg);
    background-position: right top;
  }
  48% {
    transform: rotateX(0deg);
    background-position: right top;
  }
  90% {
    transform: rotateX(0deg);
    background-position: right top;
  }
  100% {
    transform: rotateX(0deg);
    background-position: right center;
  }
}

@keyframes lid-body {
  0% {
    transform: rotateX(-90deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes lid-keyboard-area {
  0% {
    background-color: #dfdfdf;
  }
  50% {
    background-color: #bbb;
  }
  100% {
    background-color: #dfdfdf;
  }
}
@keyframes screen-shade {
  0% {
    background-position: -20px 0px;
  }
  5% {
    background-position: -40px 0px;
  }
  20% {
    background-position: 200px 0;
  }
  50% {
    background-position: -200px 0;
  }
  80% {
    background-position: 0px 0px;
  }
  85% {
    background-position: -30px 0;
  }
  90% {
    background-position: -20px 0;
  }
  100% {
    background-position: -20px 0px;
  }
}
@keyframes keys {
  0% {
    box-shadow: 0 -2px 0 #222;
  }
  5% {
    box-shadow: 1 -1px 0 #222;
  }
  20% {
    box-shadow: -1px 1px 0 #222;
  }
  25% {
    box-shadow: -1px 1px 0 #222;
  }
  60% {
    box-shadow: -1px 1px 0 #222;
  }
  80% {
    box-shadow: 0 -2px 0 #222;
  }
  85% {
    box-shadow: 0 -2px 0 #222;
  }
  87% {
    box-shadow: 0 -2px 0 #222;
  }
  100% {
    box-shadow: 0 -2px 0 #222;
  }
}
@keyframes shadow {
  0% {
    transform: rotateX(80deg) rotateY(0deg) rotateZ(0deg);
    box-shadow: 0 0 60px 40px rgba(0, 0, 0, 0.3);
  }
  5% {
    transform: rotateX(80deg) rotateY(10deg) rotateZ(0deg);
    box-shadow: 0 0 60px 40px rgba(0, 0, 0, 0.3);
  }
  20% {
    transform: rotateX(30deg) rotateY(-20deg) rotateZ(-20deg);
    box-shadow: 0 0 50px 30px rgba(0, 0, 0, 0.3);
  }
  25% {
    transform: rotateX(80deg) rotateY(-20deg) rotateZ(50deg);
    box-shadow: 0 0 35px 15px rgba(0, 0, 0, 0.1);
  }
  60% {
    transform: rotateX(80deg) rotateY(0deg) rotateZ(-50deg) translateX(30px);
    box-shadow: 0 0 60px 40px rgba(0, 0, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 60px 40px rgba(0, 0, 0, 0.3);
  }
}
.links {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.links a {
  color: #555;
  margin-left: 10px;
  text-decoration: none;
}
</style>
