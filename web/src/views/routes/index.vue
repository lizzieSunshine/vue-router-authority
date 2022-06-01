<template>
  <div class="page view-width routes-page">
    <div class="oper-group">
      <el-button type="primary" size="small" @click="get">获取路由</el-button>
      <el-button
        type="primary"
        size="small"
        :loading="savaLoding"
        @click="beforeSave"
        >保存</el-button
      >
      <el-button type="primary" size="small" @click="add('')">新增</el-button>
    </div>
    <el-alert class="alert" type="success" :closable="false"
      >存储地址：{{ configPath }}</el-alert
    >
    <el-table
      class="table"
      :data="list"
      :border="true"
      :stripe="true"
      size="mini"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName"
      v-loading="loading"
    >
      <!-- <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="_parentId" label="_parentId"> </el-table-column> -->
      <el-table-column prop="name" label="name" min-width="110" fixed="left">
        <template slot-scope="scope">
          <span
            class="route-name"
            :class="{ 'is-root': !scope.row._parentId }"
            >{{ scope.row.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="path" label="path">
        <!-- <template slot-scope="scope"> /{{ scope.row.path }} </template> -->
      </el-table-column>
      <!-- component -->
      <el-table-column prop="group" label="分组"> </el-table-column>
      <el-table-column prop="meta" label="meta">
        <template slot-scope="scope"> {{ scope.row.meta }} </template>
      </el-table-column>
      <el-table-column prop="auth" label="授权角色">
        <template slot-scope="scope">
          <!-- <el-tag type="success" size="mini" v-if="scope.row.meta && scope.row.meta['auth']">已授权</el-tag> -->
          <i
            class="el-icon-success"
            v-if="scope.row.meta && scope.row.meta['auth']"
          ></i>
          {{ scope.row.meta && scope.row.meta["auth"] }}
        </template>
      </el-table-column>
      <!-- 前置路由 -->
      <el-table-column prop="auth" label="前置路由">
        <template slot-scope="scope">
          {{ scope.row.meta && scope.row.meta["_froms"] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="scope">
          <!-- 授权 -->
          <el-dropdown trigger="click" size="mini">
            <span class="el-dropdown-link authority-btn">
              授权<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p @click="authorizeRole(scope.row)">角色授权</p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p @click="authorizeJump(scope.row)">前置路由</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button
            type="text"
            size="mini"
            class="authority-btn"
            @click="authorize(scope.row)"
            >授权</el-button
          > -->
          <!-- 新增 -->
          <el-tooltip effect="dark" content="新增child" placement="top">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-circle-plus"
              class="oper-btn"
              @click="add(scope.row.id, scope)"
            ></el-button>
          </el-tooltip>

          <!-- 编辑 -->
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              class="oper-btn"
              @click="edit(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除 -->
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-remove"
              class="oper-btn delete-btn"
              :loading="savaLoding"
              @click="deleteRow(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 上移 -->
          <!-- <el-tooltip effect="dark" content="上移" placement="top">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-top"
              class="oper-btn delete-btn"
              :loading="savaLoding"
              @click="deleteRow(scope.row)"
            ></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <add ref="add" :list="list" @on-update="updateRouters"></add>
    <!-- 授权 -->
    <authorize
      ref="authorize"
      :list="list"
      @on-update="updateRouters"
    ></authorize>
    <!-- 授权 -->
    <to ref="to" :list="list" @on-update="updateRouters"></to>
  </div>
</template>

<script>
import mixin from "@/mixins/mixin";
import Add from "./_add.vue";
import Authorize from "./_authorize.vue";
import To from "./_to.vue";

export default {
  mixins: [mixin],
  components: {
    add: Add,
    authorize: Authorize,
    to: To,
  },
  data() {
    return {
      initCfg: {
        getApi: "router_get",
        saveApi: "router_save",
      },
      configPath: "",
      list: [],
      savaLoding: false,
    };
  },
  created() {
    this.get();
  },
  methods: {
    // 表格样式
    tableRowClassName({ row }) {
      const { _parentId } = row;

      return !_parentId ? "row-root" : "";
    },

    // 获取列表回调
    getCallback(result) {
      const { path, data } = result;
      this.configPath= path;
      this.list = data;
    },

    // 新增
    add(parentId) {
      this.$refs.add.show({ isAdd: true, parentId });
    },

    // 编辑
    edit(row) {
      console.log(row);
      this.$refs.add.show({ isAdd: false, row });
    },

    // 删除
    deleteRow(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const { id, _parentId } = row;
          const param = {
            parentId: _parentId,
            id,
            list: this.list,
          };

          this.savaLoding = true;

          this.$request
            .router_delete(param)
            .then((res) => {
              const { code, message, data } = res;

              if (code !== 0) {
                this.$message.error(message);
                return;
              }

              this.list = data;
              this.beforeSave();
            })
            .finally(() => {
              this.savaLoding = false;
            });
        })
        .catch(() => {
        });
    },

    // 角色授权
    authorizeRole(row) {
      this.$refs.authorize.show(row);
    },

    // 前置路由授权
    authorizeJump(row) {
      this.$refs.to.show(row);
    },

    updateRouters(routers) {
      this.list = routers;
      this.beforeSave();
    },

    // 保存
    beforeSave() {
      const param = {
        path: this.path,
        list: this.list,
      };
      this.save(param);
    },
  },
};
</script>

<style lang="scss">
@import "style";
</style>