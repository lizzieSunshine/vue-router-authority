export default {
  data() {
    return {
      initCfg: {
        getApi: '',
        saveApi: ''
      },
      list: [],
      loading: false
    };
  },

  computed: {
    // 目标文件物理路径
    path() {
      // return this.$route.query.p;
      return window.global.target;
    },
  },

  methods: {
    /**
     * 校验
     * @returns 
     */
    validateApiUrl(api) {
      const url = this.initCfg[api];

      !url && this.$message.warning('缺少接口地址');

      return url ? url : false;
    },


    // 获取所有数据、翻页数据
    get() {
      if (!this.validateApiUrl("getApi")) return;
      const api = this.validateApiUrl("getApi");

      if (!this.path) {
        return this.$message.warning('缺失path');
      }

      const params = {
        path: this.path,
      };

      this.loading = true;
      this.$request[api](params)
        .then((res) => {
          const { code = 0, message = "", data = [] } = res;

          if (code !== 0) {
            this.$message.error(message);
            return;
          }
          
          this['getCallback'] && this.getCallback(data);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 新增
    add(parentId) {
      this.$refs.add.show({ isAdd: true, parentId });
    },

    update(data) {
      this.list = data;
    },

    save(data) {
      if (!this.validateApiUrl("saveApi")) return;
      const api = this.validateApiUrl("saveApi");

      // 参数
      let params = data || { path: this.path };

      this.loading = true;
      this.$request[api](params)
        .then((res) => {
          const { code = 0, message = "", data = [] } = res;

          if (code !== 0) {
            this.$message.error(message);
            return;
          }

          this.$message.success('保存成功');
          this['saveCallback'] && this.saveCallback(data);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },

  delete() {}
};