<template>
  <div class="page view-width enums-page">
    <!-- 配置项 -->
    <div class="oper-group">
      <el-button type="primary" size="small" :loading="loading" @click="get"
        >获取枚举</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="beforeSave"
        >保存</el-button
      >
      <!-- <el-button
        type="primary"
        size="small"
        :loading="loading"
        icon="el-icon-plus"
        @click="add"
        ></el-button
      > -->
    </div>
    <el-alert
      class="alert"
      type="success"
      :closable="false"
      style="margin-top: 20px"
      >存储地址：{{ configPath }}</el-alert
    >
    <el-alert
      class="alert"
      type="warning"
      :closable="false"
      style="margin-top: 20px"
    >
      <p>1. 路由授权的枚举，必须为'roles'</p>
    </el-alert>
    <code-mirror
      class="code-edit"
      ref="codeMirror"
      :data="result"
      @on-update="updateCode"
    ></code-mirror>
  </div>
</template>

<script>
import mixin from "@/mixins/mixin";
import CodeMirror from "@/components/CodeMirror";

export default {
  mixins: [mixin],
  components: {
    "code-mirror": CodeMirror,
  },
  data() {
    return {
      initCfg: {
        getApi: "enums_get",
        saveApi: "enums_save",
      },
      result: "",
      list: [],
      loading: false,
      savaLoding: false,
    };
  },

  created() {
    // 初始化code
    this.initCode();
    this.get();
  },
  methods: {
    initCode() {
      this.result = `{
  roles: []
}`;
    },

    updateCode(value) {
      this.result = value;
    },

    // 新增
    add() {},

    // get回调函数
    getCallback(result = {}) {
      const { data, path } = result;
      this.result = data;
      this.configPath = path;
    },

    beforeSave() {
      const param = {
        path: this.path,
        data: this.result,
      };
      this.save(param);
    },
  },
};
</script>

<style lang="scss">
@import "style";
</style>