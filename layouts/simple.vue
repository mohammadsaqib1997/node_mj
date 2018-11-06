<template lang="pug">
  .simple
    template(v-if="$store.state.pageLoading === false")
      nuxt
</template>

<style lang="scss" scoped>
.simple {
  background-color: #fbfbfb;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
</style>

