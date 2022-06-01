<template>
  <div id="header" ref="header" class="lea-header adapt-header-height">
    <div
      class="adapt-header-height header-wrapper"
      :class="{ 'is-fixed': isFixed }"
    >
      <div class="view-width">
        <!-- logo -->
        <logo></logo>
        <!-- nav -->
        <nav>
          <ul>
            <li>
              <router-link
                class="link"
                :class="{ selected: currentRoute === 'index' }"
                to="/index"
                >路由实例</router-link
              >
            </li>
            <li>
              <router-link
                class="link"
                :class="{ selected: currentRoute === 'routes' }"
                to="/routes"
                >路由授权</router-link
              >
            </li>
            <li>
              <router-link
                class="link"
                :class="{ selected: currentRoute === 'enums' }"
                to="/enums"
                >枚举</router-link
              >
            </li>
            <li>
              <router-link
                class="link"
                :class="{ selected: currentRoute === 'settings' }"
                to="/settings"
                >首选项</router-link
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div v-if="isFixed" class="placeholder adapt-header-height"></div>
  </div>
</template>

<script>
import Logo from "@/components/Logo/";

export default {
  props: {
    isFixed: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    logo: Logo,
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss">
@import "./header.scss";
</style>
