<template>
  <div class="settings-page view-width">
    <div class="section-wrapper">
      <h4 class="header">
        <span class="text">枚举快速选项</span>
        <div class="oper">
          <el-button type="primary" size="mini" icon="el-icon-plus"></el-button>
        </div>
      </h4>
      <div class="content">
        <el-tag
          v-for="item in enumsVal"
          :key="item.value"
          class="tag"
          closable
          type="info"
          >
            <span class="label">{{ item.label }}</span>
            <span class="desc">（{{ item.desc }}）</span></el-tag
        >
        <!-- <el-checkbox-group v-model="checkList">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox label="禁用" disabled></el-checkbox>
          <el-checkbox label="选中且禁用" disabled></el-checkbox>
        </el-checkbox-group> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      enumsVal: [
        {
          label: "roles",
          desc: "用户角色",
          value: "roles",
        },
      ],
      checkList: [],
    };
  },
};
</script>

<style lang="scss">
@import "style";
</style>