<template lang="pug">
.section.subscribe(:class="{ 'is-simple': simple }")
  .container
    .columns.sbs-cont.is-variable.is-7
      .column.is-narrow
        img(src="~/assets/img/sbs-email.png")
      .column
        h1.title-1 Subscribe
        p.txt Subscribe to our newsletter for latest updates on up-coming products,
          |  special offers and exculives insights to get more out of your membership.
      .column.is-narrow
        button.button.sbs-btn Subscribe Now
</template>

<script>
export default {
  props: {
    simple: {
      default: false
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
  .subscribe
    background-color: #ffffff
    position: relative
    &.is-simple
      box-shadow: 0 -2px 15px -4px #e6e6e6
    &:not(.is-simple)
      margin-top: 3rem
      &:before
        content: " "
        position: absolute
        top: -30px
        left: 0
        right: 0
        background-color: #ffffff
        height: 4rem
        transform: rotate(-2deg)
        box-shadow: 0 -3px 10px -3px rgba(204, 204, 204, .3)
    @media screen and (min-width: 769px)
      padding-bottom: 5rem
    .sbs-cont
      align-items: center
      h1.title-1
        font-size: 32px
        padding-bottom: 6px
      p.txt
        margin-top: 1rem
        font-size: 16px
        padding-right: 8rem
        color: #4c4c4c
      .sbs-btn
        background-color: #db3279
        color: #fff
        font-weight: 600
        text-transform: uppercase
        font-size: 16px
        padding: 10px 34px
        height: auto
        border: none
        border-bottom: 4px solid #ba2b67
        &:focus
          box-shadow: 0 0 5px 1px rgba(219, 50, 121, 0.5)

</style>
