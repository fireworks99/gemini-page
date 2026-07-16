<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import emitter from '@/utils/mitt';

const handleCommand = (command: string) => {
  if (command === 'deleteDialogue') {
    emitter.emit("clearDialogue");
  }
}
</script>

<template>
  <div class="home_wrapper">

    <div class="left">
      <img src="@/assets/images/logo.png" alt="">
    </div>

    <div class="center">
      <img src="@/assets/images/title.png" alt="">
    </div>

    <div class="right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-icon>
            <MoreFilled />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="deleteDialogue">删除对话</el-dropdown-item>
            <el-dropdown-item disabled>新建对话</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.home_wrapper {
  display: flex;
  align-items: center;
  padding: 1rem;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);

  .left {
    height: 32px;

    img {
      height: 32px;
      width: 32px;
    }
  }

  .center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;

    img {
      height: 160%;
    }
  }

  .right {
    margin-left: auto;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
