<template>
  <el-dialog class="auth-page" :title="`${routeName} · 路由授权`" :visible.sync="visible">
    <el-alert class="alert-info" type="warning" :closable="false">
      请为路由指定角色，如不选择，默认该路由无权限控制
      <el-button type="text">
        <router-link :to="{ name: 'enums', query: { path: $route.query.p } }"><i class="el-icon-edit"></i>修改角色</router-link>
      </el-button>
    </el-alert>
    {{roles}}
    <el-form :model="form">
      <el-form-item label="角色" :label-width="'120'">
        <el-checkbox-group v-model="form.role">
          <el-checkbox
            v-for="(item, index) in roles"
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
import mixin from "@/mixins/mixin";

export default {
  mixins: [mixin],
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
      roles: [
        {
          label: "超级管理员",
          value: "0",
        },
        {
          label: "企业管理员",
          value: "1",
        },
        {
          label: "企业子账号",
          value: "2",
        },
        {
          label: "个人账户",
          value: "3",
        },
      ],
      form: {
        role: [],
      },
      loading: false,
    };
  },

  methods: {
    show(row) {
      this.data = row;
      this.routeName = row.name;
      this.visible = true;

      row['meta'] && row.meta['auth'] && (this.form.role = row.meta.auth);

      // 获取枚举
      this.getRolesEnums();
    },

    getRolesEnums() {
      if (!this.path) return this.$message.warning('缺失path');

      const params = { 
        path: this.path,
        name: 'roles'
      };
      this.$request.enums_getByName(params).then(res => {
        console.log(res);
        this.roles = res.code === 0 ? res.data || [] : [];
      });
    },

    save() {
      const param = {
        id: this.data.id,
        roles: [...(this.form.role || [])],
        list: this.list,
      };

      this.loading = true;
      this.$request
        .router_auth(param)
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

<style lang="scss">
@import "style";
</style>