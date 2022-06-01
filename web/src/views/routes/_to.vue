<template>
  <el-dialog :title="`${routeName} · 路由跳转权限管控`" :visible.sync="visible">
    <el-alert type="warning" :closable="false"
      >请为路由指定From路由，制定后，只有指定路由能跳转到当前路由。如不指定，默认为任意理由都可访问</el-alert
    >
    <el-form :model="form" label-position="top">
      <el-form-item label="" :label-width="'120'">
        <el-checkbox-group v-model="form.froms">
          <el-checkbox
            v-for="(item, index) in enums.routes"
            :key="index"
            :label="item.value"
            :name="item.value"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="save"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// import axios from "axios";
// import { saveRecursion } from "./libs/index";

export default {
  props: {
    list: {
      default: [],
    },
  },
  data() {
    return {
      visible: false,
      routeName: "",
      data: {},
      enums: {
        routes: []
      },
      form: {
        froms: [],
      },
      loading: false,
    };
  },
  methods: {
    show(row) {
      console.log(row);
      this.data = row;
      this.routeName = row.name;
      this.visible = true;

      // 获取路由枚举
      this.getRouteNames();

      // 编辑赋值
      row['meta'] && row.meta['_froms'] && (this.form.froms = row.meta._froms);
    },

    // 获取路由枚举
    getRouteNames() {
      const params = { list: this.list };
      this.$request
        .router_getRouteNames(params)
        .then(res => {
          const { code, message, data } = res;

          if (code !== 0) {
            this.$message.error(message);
            this.enums.routes = [];
            return;
          }

          this.enums.routes = data;
        });
    },

    save() {
      const param = {
        id: this.data.id,
        froms: [...(this.form.froms || [])],
        list: this.list,
      };

      this.loading = true;
      this.$request
        .router_authFromRoutes(param)
        .then((res) => {
          const { code, message, data } = res;
          if (code !== 0) {
            this.$message.error(message);
            return;
          }

          this.$emit("on-update", data);
          this.visible = false;
          this.reset();
        })
        .finally(() => (this.loading = false));
    },

    // save() {
    //   // if (this.data['meta']) {
    //   //   this.data.meta['auth'] = [...(this.form.role || [])];
    //   // } else {
    //   //   this.data['meta'] = { auth: [...(this.form.role || [])] };
    //   // }

    //   this.visible = false;
    //   this.$emit("on-save", {
    //     ...this.data,
    //     roles: [...(this.form.role || [])]
    //   });

    //   this.reset();

    //   // axios.post("http://localhost:7777/save", params).then((res) => {
    //   //   console.log(res.data);
    //   // });

    // },

    reset() {
      this.form.role = [];
      // this.$refs.form.resetFields();
    },
  },
};
</script>