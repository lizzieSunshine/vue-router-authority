<template>
  <div class="code-mirror-wrapper">
    <codemirror
      ref="code"
      v-model="code"
      :options="cmOptions"
      v-loading="loading"
      element-loading-text="数据加载"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)"
      class="code-mirror"
      @ready="onReady"
      @focus="onFocus"
      @input="onInput"
    ></codemirror>
  </div>
</template>

<script>
// https://www.jianshu.com/p/04c21d5735fe
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

/**
 * theme
 * we required all the themes before render
 */
import "codemirror/theme/monokai.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/ambiance-mobile.css"; // 白色
import "codemirror/theme/material-darker.css"; // 白色
import "codemirror/theme/duotone-light.css"; // 白色
import "codemirror/theme/neo.css"; // 白色

import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入

// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/swift/swift.js'
// import 'codemirror/mode/vue/vue.js'

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/http/http";
import "codemirror/mode/php/php";
import "codemirror/mode/python/python";
import "codemirror/mode/http/http";
import "codemirror/mode/sql/sql";
import "codemirror/mode/vue/vue";
import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/yaml/yaml";

export default {
  props: {
    /**
     * 主题，包括以下：
     * monokai、cobalt、seti、darcula、ambiance-mobile、duotone-light
     */
    theme: {
      type: String,
      default: "darcula",
    },
    /**
     * 双向绑定值
     */
    data: {
      type: String || Object,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    /**
     * 编辑器语言
     * 支持的预言有：css、javascript、php、xml、python、http、sql、vue、yaml、markdown
     */
    language: {
      type: String,
      default: "javascript",
    },
    /**
     * 是否加载
     */
    loading: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    codemirror,
  },

  data() {
    return {
      code: "",
      cmOptions: {
        value: "",
        // 主题，对应主题库 JS 需要提前引入
        theme: this.theme,
        // 自动缩进，设置是否根据上下文自动缩进,默认为true
        smartIndext: true,
        // 缩进单位
        indentUnit: 2,
        // 缩进格式
        tabSize: 2,
        mode: {
          name: this.language,
          json: true,
        },
        // 是否在编辑器左侧显示行号
        lineNumbers: true,
        line: true,
        // 是否只读
        readOnly: this.readOnly,
        lineWrapping: true,
        // 括号匹配
        matchBrackets: true,
        // extraKeys: {"Ctrl": "autocomplete"},//ctrl可以弹出选择项
      },

      result: "",

      modes: [
        {
          value: "css",
          label: "CSS",
        },
        {
          value: "javascript",
          label: "Javascript",
        },
        {
          value: "html",
          label: "XML/HTML",
        },
        {
          value: "x-java",
          label: "Java",
        },
        {
          value: "x-objectivec",
          label: "Objective-C",
        },
        {
          value: "x-python",
          label: "Python",
        },
        {
          value: "x-rsrc",
          label: "R",
        },
        {
          value: "x-sh",
          label: "Shell",
        },
        {
          value: "x-sql",
          label: "SQL",
        },
        {
          value: "x-swift",
          label: "Swift",
        },
        {
          value: "x-vue",
          label: "Vue",
        },
        {
          value: "markdown",
          label: "Markdown",
        }
      ],
    };
  },

  watch: {
    data: {
      immediate: true,
      handler(val) {
        // let type = typeof val;
        // if (type === 'number' || (type === 'string' && val !== '')) {
        //   this.code = JSON.stringify(JSON.parse(val || ''), null, 2);
        // }
        this.code = val;
      }
    }
  },

  created() {},

  methods: {
    onReady() {
      // console.log('on ready');
    },
    onFocus() {
      // console.log('on focus');
    },
    onInput() {
      this.$emit('on-update', this.code);
    },
    getCode() {
      // console.log(typeof this.code);
      // console.log(this.code);
      return this.code;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>