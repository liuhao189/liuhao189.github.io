<template>
  <section>
    <img alt="Vue logo" src="./assets/logo.png" />
    <img src="./assets/min.jpeg" style="height: 100px" />
    <HelloWorld msg="Hello Vue 3 + TypeScript + Vite + Changed" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
