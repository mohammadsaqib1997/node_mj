<template lang="pug">
    .footer
        h1 Copyright © 2018 MJ-Supreme. Designed by 
            a(href="http://focusme360.com" target="_blank") FocusMedia360
</template>

<script>
export default {};
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