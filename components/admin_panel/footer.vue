<template lang="pug">
    .footer
        h1 Copyright © {{ year }} - MJ Supreme.
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>

<style scoped lang="scss">
.footer {
  height: 35px;
  padding: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: #e3e3e3;
  text-align: center;
  line-height: 35px;
  color: #bebebe;
  font-size: 14px;
  h1 > a {
    color: #bebebe;
    text-decoration: underline;
  }
  @media screen and (max-width: 425px) {
    font-size: 3vw;
  }
}
</style>