<template>
  <div class="component-container">
    <el-card class="project-card">
      <template #header>
        <span class="fw-b">锐视视频网项目简介</span>
      </template>
      <div class="project-card__main">
        <!-- 项目简介 -->
        <!-- <el-link target="_blank" type="primary" href="https://gitee.com/haoxr"> -->
        锐视视频网
        <!-- </el-link> -->
        是基于NodeJS、NestJS、Mysql8、Typeorm、Vue3、Element-Plus、uni-app等主流技术栈构建的一整套全栈开源视频网站项目，
        涉及
        <el-link
          target="_blank"
          type="primary"
          href="https://cloud.tencent.com/document/product/266"
          >腾讯云点播</el-link
        >
        、
        <el-link
          target="_blank"
          type="success"
          href="https://cloud.tencent.com/document/product/436"
          >对象存储</el-link
        >

        <el-divider />

        <!-- 源码地址 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge class="fw-b"> 项目地址 </el-badge>
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="primary"
              href="https://github.com/dhanweb/ruishi-video"
              >Github</el-link
            >
          </el-col>
        </el-row>
        <el-divider />
        <!-- 技术栈 -->
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 后端技术栈 </el-col>
          <el-col :span="18"> NodeJS、NestJS、Typeorm、Mysql8.x、redis、JWT </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 前端技术栈 </el-col>
          <el-col :span="18">
            Vue3、TypeScript、Element-Plus、uni-app、vue3-element-admin
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "index",
};
</script>

<style lang="scss" scoped>
.component-container {
  .project-card {
    font-size: 14px;

    &__main {
      line-height: 28px;
      height: 320px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .fw-b {
    font-weight: bold;
  }
}
</style>
