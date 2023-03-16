<template>
  <div class="previewDialog">
    <el-dialog
      width="80%"
      title="预览"
      :append-to-body="true"
      v-model="visible"
      @close="dialogClose"
    >
      <div class="container">
        <div class="video-box">
          <div class="video-wrap">
            <div class="preview_video" v-show="activeName === ETab.mp4">
              <video class="video-js" id="my-video" ref="mp4Ref">
                <source :src="part.url2" type="video/mp4" />
              </video>
            </div>

            <div class="preview_video" v-show="activeName === ETab.hls">
              <video class="video-js" ref="hlsRef">
                <source :src="part.url" type="application/x-mpegURL" />
              </video>
            </div>
          </div>
          <div class="btn-group">
            <el-button
              :type="activeName === ETab.mp4 ? 'primary' : ''"
              @click="activeName = ETab.mp4"
              >MP4文件预览</el-button
            >

            <el-button
              :loading="part.status"
              :type="activeName === ETab.hls ? 'primary' : ''"
              @click="activeName = ETab.hls"
              >{{ part.status ? "转码中..." : "HLS文件预览" }}</el-button
            >
          </div>
        </div>
        <el-descriptions title="" :column="1" border>
          <el-descriptions-item label="标题">{{ part.description }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{
            secondsToTime(part.duration)
          }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Username">kooriookami</el-descriptions-item> -->
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { IPartInfo } from "@/api/video/types";
import videojs from "video.js";
import { secondsToTime } from "@/utils/filter";
import lang_zhcn from "video.js/dist/lang/zh-CN.json";

enum ETab {
  mp4 = "mp4",
  hls = "hls",
}

type Props = {
  part: IPartInfo;
};

const props = defineProps<Props>();

type STATE = {
  visible: boolean;
  activeName: ETab;
};

const state = reactive<STATE>({
  visible: true,
  activeName: ETab.mp4,
});

const { visible, activeName } = toRefs(state);

const emits = defineEmits<{
  (event: "closed", visible: boolean): void;
}>();

const mp4Player = ref<null | typeof videojs.players>(null);
const hlsPlayer = ref<null | typeof videojs.players>(null);
const mp4Ref = ref<HTMLVideoElement>();
const hlsRef = ref<HTMLVideoElement>();

watch(
  () => activeName.value,
  (val) => {
    if (val === ETab.mp4) {
      hlsPlayer.value.pause();
    } else if (val === ETab.hls) {
      mp4Player.value.pause();
    }
  }
);

// 对话框关闭
function dialogClose() {
  emits("closed", false);
}

onMounted(() => {
  initVideo();
});

function initVideo() {
  nextTick(() => {
    const options = {
      controls: true,
      preload: "auto",
      width: "630",
      height: "360",
      languages: {
        "zh-CN": lang_zhcn,
      },
    };
    if (mp4Ref.value) {
      mp4Player.value = videojs(mp4Ref.value, options, () => {
        console.log("mp4Player is ready");
      });
    }
    if (hlsRef.value) {
      hlsPlayer.value = videojs(hlsRef.value, options, () => {
        console.log("hlsPlayer  is ready");
      });
    }
  });
}
onUnmounted(() => {
  dispose();
});
function dispose() {
  mp4Player.value.dispose();
  hlsPlayer.value.dispose();
  console.log("dispose()");
}
</script>

<style scoped lang="scss">
.container {
  display: flex;

  .video-box {
    // width: 700px;
  }
  .btn-group {
    margin-top: 20px;
  }
  .el-descriptions {
    margin-left: 20px;
    flex: 1;
  }
}
</style>
