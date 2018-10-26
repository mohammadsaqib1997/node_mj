<template lang="pug">
    .copyrights
        .columns
            .column
                p Copyright © {{ year }} MJ-Supreme. Designed by 
                  a(href="http://focusme360.com" target="_blank") FocusMedia360
            .column
            .column
                ul.bottom-link
                    li.item
                        nuxt-link(to="/coming-soon") Site Map
                    li.item
                        nuxt-link(to="/coming-soon") Privacy Policy
                    li.item
                        a(href="/terms-and-condition") Terms & Conditions


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
.copyrights {
  border-top: 2px solid #8d93ae;

  > .columns {
    padding: 20px 0 10px;
  }

  p > a {
    color: #8d93ae;
    text-decoration: underline;
  }

  .bottom-link {
    text-align: right;

    .item {
      display: inline-block;
      padding-right: 10px;
      padding-left: 10px;
      border-right: 1px solid #8d93ae;
      line-height: 1;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        border-right: none;
        padding-right: 0;
      }

      > a {
        color: #8d93ae;
        text-transform: uppercase;
      }
    }
  }
}
</style>