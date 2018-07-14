<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        h1.title-1.center INVESTMENT TIPS

    .section.sct-2
      .container
        h1.title-1.center FUTURE PLANNING

    .section.sct-3
      .container
        h1.title-1.center PRODUCTS
        hr
        h1.title-1.center EVENTS

    .section.sct-4
      .container
        h1.title-1.center SOCIAL REFORMS

    subscribe-section(:simple="true")
</template>

<script>
import subscribeSection from "~/components/subscribe-section.vue"
export default {
  components: {
    "subscribe-section": subscribeSection
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
  .sct-2, .sct-4
    background-color: #eeeeee
</style>
