<template>
  <el-drawer
    :title="title"
    class="add-page"
    :size="500"
    :visible.sync="isShow"
    :wrapperClosable="false"
    :before-close="close"
  >
    <el-form
      class="form"
      ref="form"
      size="small"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-row :gutter="20">
        <!-- path -->
        <el-col :span="12">
          <el-form-item label="path" prop="path">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
        </el-col>
        <!-- name -->
        <el-col :span="12">
          <el-form-item label="name" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <!-- redirect -->
        <el-col :span="12">
          <el-form-item label="redirect" prop="redirect">
            <el-input v-model="form.redirect"></el-input>
          </el-form-item>
        </el-col>
        <!-- 中文名 -->
        <el-col :span="12">
          <el-form-item label="中文名（选填）" prop="_title">
            <el-input v-model="form._title"></el-input>
          </el-form-item>
        </el-col>
        <!-- component -->
        <el-col :span="24">
          <el-form-item label="component" prop="component">
            <!-- <el-alert type="warning" :closable="false" style="margin-bottom: 10px">
              <p>1. 如：views/home/index</p>
              <p>2. 必须到详细到页面，且后缀不带.vue</p>
            </el-alert> -->
            <el-input v-model="form.component">
              <template slot="prepend">@/</template>
              <template slot="append">.vue</template>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="component" prop="component">-->
            <!-- <el-alert type="warning" :closable="false" style="margin-bottom: 10px">
              <p>1. 如：views/home/index</p>
              <p>2. 必须到详细到页面，且后缀不带.vue</p>
            </el-alert> -->
            <!--<el-input v-model="form.component">-->
              <!--<template slot="prepend">@/</template>-->
              <!--<template slot="append">.vue</template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->

        </el-col>
      </el-row>

      <div class="hr"></div>

      <el-row :gutter="20" v-if="false">
        <!-- 分组 -->
        <el-col :span="12">
          <el-form-item label="分组" prop="group">
            <el-input v-model="form.group"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="meta" prop="meta">
        <code-mirror :data="form.meta" @on-update="updateMeta" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import form from "@/mixins/form";
import CodeMirror from "@/components/CodeMirror";

export default {
  mixins: [form],
  props: {
    list: {
      default: [],
    },
  },
  components: {
    "code-mirror": CodeMirror,
  },
  data() {
    return {
      initCfg: {
        isAdd: true,
        parentId: "",
      },
      isShow: false,
      form: {
        id: "",
        name: "",
        path: "",
        component: "",
        redirect: "",
        meta: "",
        group: "",

        _title: ""
      },
      rules: {
        // name: {
        //   required: true,
        //   message: "请输入路由名",
        // },
      },
      loading: false,
    };
  },
  computed: {
    title() {
      return this.initCfg.isAdd ? "新增" : "编辑";
    },
  },
  methods: {
    show({ isAdd, parentId = "", row }) {
      this.isShow = true;
      this.initCfg.isAdd = isAdd;
      this.initCfg.parentId = parentId;

      // edit
      if (!isAdd) {
        Object.entries(row).forEach(([k, v]) => {
          if (k in this.form) {
            this.form[k] = k === "meta" ? JSON.stringify(v) : v;
          }
        });
      }
    },

    updateMeta(val) {
      this.form.meta = val;
    },

    // 代码转对象
    formatMeta(code) {
      return new Promise((resolve) => {
        const param = {
          content: code,
        };
        this.$request
          .router_formatCodetoObj(param)
          .then((res) => {
            const { code = 1, message = '', data } = res ||{};

            if (code !== 0) {
              return this.$message.error(message);
            }

            resolve(data);
          });
      });
    },

    // 验证路由名唯一性
    validateNameRepeated() {
      return new Promise((resolve) => {
        const param = {
          list: this.list,
          name: this.form.name,
        };
        this.$request.router_validateUniqueness(param).then((res) => {
          resolve(res.data);
        });
      });
    },

    save() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        // 格式化form
        const form = JSON.parse(JSON.stringify(this.form));
        !form.component && delete form["component"];
        !form.redirect && delete form["redirect"];
        !form.meta && delete form["meta"];
        !form.id && delete form["id"];

        if (form.meta) {
          form.meta = await this.formatMeta(form.meta);
        }

        // 保存
        this.initCfg.isAdd ? this.addSubmit(form) : this.editSubmit(form);
      });
    },

    // 新增
    async addSubmit(route) {
      // 验证路由名是否重复
      let validUnique = await this.validateNameRepeated();

      if (!validUnique) {
        this.$message.error("路由名重复");
        return;
      }

      const param = {
        route,
        parentId: this.initCfg.parentId,
        routers: this.list,
      };

      this.loading = true;
      this.$request
        .router_add(param)
        .then((res) => {
          const { code, message, data } = res;

          if (code !== 0) {
            this.$message.error(message);
            return;
          }

          this.close();
          this.$emit("on-update", data || []);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 编辑
    editSubmit(route) {
      const param = {
        id: route.id,
        route,
        routers: this.list,
      };

      this.loading = true;
      this.$request
        .router_edit(param)
        .then((res) => {
          const { code, message, data } = res;

          if (code !== 0) {
            this.$message.error(message);
            return;
          }

          this.close();
          this.$emit("on-update", data || []);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleClose() {
      this.isShow = false;
      this.clear();
    },
  },
};
</script>

<style lang="scss">
.form {
  padding: 10px;
}
</style>