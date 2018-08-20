<template lang="pug">
    section.section(v-if="$store.state.pageLoading === false")
        h1.title
            | {{ error.statusCode }}
        h2.info
            | {{ error.message }}
        nuxt-link.button(to="/" v-if="error.statusCode === 404") Homepage

</template>
<script>
export default {
  layout: "error_layout",
  props: ["error"]
};
</script>

<style scoped>
.section {
  text-align: center;
}
.title {
  margin-top: 15px;
  font-size: 5em;
}

.info {
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
}

.button {
  margin-top: 50px;
}
</style>
