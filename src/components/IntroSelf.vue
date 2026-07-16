<template>
  <div class="intro-wrapper">
    <div class="title">
      <div class="icon">
        <img src="@/assets/images/logo.png" alt="logo" />
        <img src="@/assets/images/title.png" alt="title" />
      </div>
      <div class="text">我是Genimi，很高兴见到你！</div>
    </div>

    <div class="sub-title">
      我可以帮你写代码、写作各种创意内容，请把你的任务交给我吧~
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑，仅作为展示组件
</script>

<style lang="scss" scoped>
.intro-wrapper {
  padding: 0 32px;
  width: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;

    .icon {
      display: flex;
      align-items: center;

      img {
        height: 64px;

        &:nth-of-type(1) {
          height: 40px;
        }
      }
    }

    .text {
      font-size: 24px;
      font-weight: 500;
    }
  }

  .sub-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #404040;
    margin: 8px 0 20px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .intro-wrapper {
    .title {
      .text {
        font-size: 18px;
      }
    }
  }

}
</style>