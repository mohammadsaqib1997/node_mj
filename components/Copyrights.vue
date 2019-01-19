<template lang="pug">
  .copyrights
    .columns
      .column.is-4
        p Copyright © {{ year }} - MJ Supreme.
      .column.is-4
        ul.pm-opt-cont
          li.item
            a(href='#' @click.prevent="md_act_data.active=true;md_act_data.type=0;")
              img(src="~/assets/img/payment_opt/MeezanBank.png")
          li.item
            a(href='#' @click.prevent="md_act_data.active=true;md_act_data.type=1;")
              img(src="~/assets/img/payment_opt/jazzCash.png")
          li.item
            a(href='#' @click.prevent="md_act_data.active=true;md_act_data.type=2;")
              img(src="~/assets/img/payment_opt/easyPaisa.png")
      .column.is-4
        ul.bottom-link
          li.item
            nuxt-link(to="/coming-soon") Site Map
          li.item
            nuxt-link(to="/coming-soon") Privacy Policy
          li.item
            nuxt-link(to="/terms-and-condition") Terms & Conditions
    mdAcInfo(:md_act="md_act_data.active" :type="md_act_data.type" @closed="md_act_data.active=false")
</template>

<script>
import mdAcInfo from "~/components/modals/payment-info.vue";
export default {
  components: {
    mdAcInfo
  },
  data() {
    return {
      year: new Date().getFullYear(),
      md_act_data: {
        active: false,
        type: 0
      }
    };
  }
};
</script>

<style scoped lang="scss">
.copyrights {
  border-top: 2px solid #8d93ae;

  > .columns {
    padding: 20px 0 10px;
    align-items: center;
  }

  p > a {
    color: #8d93ae;
    text-decoration: underline;
  }

  .pm-opt-cont {
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      margin: 0 0.5rem;
    }
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