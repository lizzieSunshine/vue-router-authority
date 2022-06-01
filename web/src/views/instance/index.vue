<template>
  <div class="page instance-page view-width">
    <div class="oper-group">
      <div class="left-info">
        <el-button type="primary" size="small" :loading="loading" @click="get"
          >获取配置</el-button
        >
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          @click="beforeSave"
          >保存</el-button
        >
      </div>
      <div class="right-info">
        <el-tag :type="hasDefaultConfig ? 'success' : 'error'">{{
          hasDefaultConfig ? "有配置数据" : "无配置数据"
        }}</el-tag>
      </div>
    </div>
    <el-alert type="success" :closable="false" style="margin-top: 20px"
      >存储地址：{{ configPath }}</el-alert
    >

    <!-- 快速导航 -->
    <div class="quick-nav">
      <div v-for="item in defaultData" :key="item.key" class="quick-nav-item">
        <i v-if="item.selected" class="el-icon-circle-check success-icon"></i>
        <i v-else class="el-icon-circle-close info-icon"></i>
        {{ item.title }}
      </div>
    </div>

    <!-- 配置项 -->
    <div
      v-for="(item, index) in defaultData"
      :key="item.key"
      class="check-box-wrapper"
      :class="{ active: item.selected }"
      :id="item.key"
    >
      <!-- 是否选中 -->
      <el-checkbox v-model="item.selected">
        <h4 class="title">
          {{ item.title
          }}<el-tag
            type="warning"
            v-if="item.type === 'code' && item.value !== item.example"
            >自定义</el-tag
          >
        </h4>
      </el-checkbox>
      <!-- 描述 -->
      <p class="description">{{ item.description }}</p>
      <!-- 值 -->
      <div class="value-wrapper">
        <!-- input -->
        <el-input
          v-if="item.type === 'input'"
          v-model="item.value"
          placeholder=""
          style="width: 300px"
          clearable
        ></el-input>
        <!-- radio -->
        <el-radio-group v-else-if="item.type === 'radio'" v-model="item.value">
          <el-radio
            v-for="ops in item.options"
            :key="ops.value"
            :label="ops.label"
            :value="ops.value"
          ></el-radio>
        </el-radio-group>
        <!-- code -->
        <div class="code-wrapper" v-else-if="item.type === 'code'">
          <code-mirror
            :data="item.value"
            @on-update="updateCode($event, index)"
          />
          <el-button
            type="primary"
            size="small"
            class="reset"
            @click="reset(index)"
            >重置</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "@/mixins/mixin";
import form from "@/mixins/form";
import CodeMirror from "@/components/CodeMirror";

export default {
  mixins: [mixin, form],
  components: {
    "code-mirror": CodeMirror,
  },
  data() {
    return {
      initCfg: {
        getApi: "instance_get",
        saveApi: "instance_save",
      },
      configPath: "",
      defaultData: {},
      hasDefaultConfig: false,
    };
  },

  async created() {
    // 初始化配置
    this.defaultData = await this.getDefault();
    console.log(this.defaultData);

    this.get();
  },
  methods: {
    // 组装保存数据
    compileData(data = []) {
      const param = {};

      data.map((item) => {
        const { key, selected, value } = item;
        param[key] = { selected, value };
      });

      return param;
    },

    // 反编译数据
    decompileData(data = {}) {
      this.defaultData.map((item) => {
        const { key } = item;
        if (key in data) {
          item.selected = data[key]["selected"];
          item.value = data[key]["value"];
        }
      });
    },

    // 获取默认配置数据
    getDefault() {
      return new Promise((resolve) => {
        this.$request.instance_getDefault().then((res) => {
          resolve(res.data);
        });
      });
    },

    // get回调函数
    getCallback(result = {}) {
      console.log(result);
      const { data, path } = result;

      this.hasDefaultConfig = Object.keys(data).length !== 0;
      this.hasDefaultConfig && (this.decompileData(data));
      this.configPath = path;
    },

    // 提交参数拼装
    beforeSave() {
      if (!this.path) {
        return this.$message.warning("缺失path");
      }

      // 组装保存数据
      const params = {
        path: this.path,
        data: this.compileData(this.defaultData),
      };
      console.log(params);
      this.save(params);
    },

    reset(index) {
      this.defaultData[index]["value"] = this.defaultData[index]["example"];
    },

    updateCode(value, index) {
      this.defaultData[index]["value"] = value;
    },
  },
};
</script>

<style lang="scss">
@import "style";
</style>