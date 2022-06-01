export default {
  data() {
    return {
      form: {},
      rules: {},
      loading: false
    };
  },

  methods: {
    close() {
      this.isShow = false;
      this.clear();
    },

    clear() {
      Object.keys(this.form).forEach((k) => {
        this.form[k] = "";
      });
      this.$refs.form && this.$refs.form.clearValidate();
    },
  },
};