<template lang="pug">
  b-loading(:is-full-page="true" :active="loading" :can-cancel="false")
</template>

<script>
export default {
  computed: {
    loading: function () {
      return this.$store.state.pageLoading
    }
  },
  methods: {
    start() {},
    finish() {}
  }
};
</script>