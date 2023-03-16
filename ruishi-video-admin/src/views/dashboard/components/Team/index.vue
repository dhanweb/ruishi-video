<template>
  <div class="component-container">
    <el-card class="project-card">
      <template #header>
        <span class="fw-b">个人简历</span>
      </template>
      <div class="project-card__main">
        <p>熟练使用 JavaScript和 ES6及之后的新特性语法</p>
        <p>熟练使用 Vue2，Vue3，Typescript，Uniapp 进行开发</p>
        <p>熟悉 ElementUI，ElementPlus，ECharts 等常用组件库</p>
        <p>了解 NodeJS，Express，NestJS，Mysql 能完成简单的服务器相关开发</p>

        <el-divider />

        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge class="fw-b"> 期望岗位 </el-badge>
          </el-col>
          <el-col :span="5"> web前端 4-6K</el-col>
          <el-col :span="8"> 广州、深圳 </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge class="fw-b"> 联系方式 </el-badge>
          </el-col>
          <el-col :span="5"> 13169107494 </el-col>
          <el-col :span="8"> 851849619@qq.com </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge class="fw-b"> 教育经历 </el-badge>
          </el-col>
          <el-col :span="5"> 2023届本科 </el-col>
          <el-col :span="9"> 湛江科技学院-计算机科学与技术 </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge class="fw-b"> 更多 </el-badge>
          </el-col>
          <el-col :span="5">
            <el-link
              target="_blank"
              type="danger"
              href="https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/%E6%9E%97%E5%90%AB-%E7%AE%80%E5%8E%86.pdf"
              >林含-简历.PDF</el-link
            >
          </el-col>
          <el-col :span="5">
            <el-link
              target="_blank"
              type="success"
              href="https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/6b80496cacbbf155511b15a1ae6d144.jpg"
              >微信二维码</el-link
            >
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
