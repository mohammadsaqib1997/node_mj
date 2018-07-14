<template lang="pug">
  .wrapper
    .section.sct-1
      .overlay
      h1.sct-heading Our Products
    .section.sct-2
      .container
        h1.title-1 DISCOUNT PRODUCTS
        .columns.main-prd-cont
          .column.is-4
            .prd-list-cont
              .cont.active.columns.is-mobile.is-gapless
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-1.png")
                .title.column SUPREME CARD
              .cont.columns.is-mobile.is-gapless
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-2.png")
                .title.column MOTORCYCLE
              .cont.columns.is-mobile.is-gapless
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-3.png")
                .title.column SPI INSSURANCE
          .column
            .prd-det-cont
              .prd-cont
                .img-cont
                  img(src="~/assets/img/hm-img-1.jpg")
                .info-cont.level.is-mobile
                  .level-left
                    nuxt-link.button.more-info(to="/product-details") More Info
                  .level-right
                    button.button.reg-now Register Now
                      b-icon(icon="angle-right")
              .desc-cont
                h2.title-2 Description
                p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                  | incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  | quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  | Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    upcoming-prod-section
    subscribe-section
</template>

<script>
import upcomingProdSection from "~/components/upcoming-prod-section.vue"
import subscribeSection from "~/components/subscribe-section.vue"
export default {
  components: {
    "upcoming-prod-section": upcomingProdSection,
    "subscribe-section": subscribeSection
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
  .sct-1
    position: relative
    text-align: center
    margin-bottom: 1rem
    box-shadow: 0 5px 3px -3px #999
    background-image: url('~/assets/img/prd-img-1.jpg')
    background-repeat: no-repeat
    background-size: cover
    background-position: center
    .overlay
      background-color: rgba(25, 25, 76, 0.8)
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
    .sct-heading
      position: relative
      display: inline-block
      font-size: 3rem
      border: 2px solid #d7bb6d
      padding: 20px 40px
      margin: 2rem auto
      color: #fff
      font-weight: 200
      text-transform: uppercase
  .sct-2
    .main-prd-cont
      margin: 3rem auto
      .prd-list-cont
        .cont
          align-items: center
          .img-cont
            cursor: pointer
            width: 100px
            height: 100px
            display: flex
            align-items: center
            justify-content: center
            padding: 20px !important
            background-color: #f6f6f6
            border: 2px solid #fff
            border-radius: 6px
            margin-right: 1.2rem
            box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
            img
              max-height: 100%
          .title
            font-size: 16px
            text-transform: uppercase
            color: #6c6c6c
            font-weight: 500
          &.active
            .img-cont
              background-color: #3d3e5a
            .title
              color: #3d3e5a
      .prd-det-cont
        .prd-cont
          box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
          .img-cont
            display: flex
            align-items: center
            justify-content: center
          .info-cont
            padding: 1.5rem
            background-color: #ffffff
            .more-info
              border: 2px solid #dfc884
              height: auto
              padding: 6px 1.2rem
              background-color: transparent
              color: #3d3e5a
              font-size: 14px
              font-weight: 500
              text-transform: uppercase
              &:focus
                box-shadow: 0 0 5px 1px rgba(216, 190, 111, .5)
            .reg-now
              background-color: #db3279
              color: #fff
              font-weight: 800
              text-transform: uppercase
              font-size: 14px
              padding: 6.5px 1.7rem
              height: auto
              border: none
              border-bottom: 3px solid #ba2b67
              &:focus
                box-shadow: 0 0 5px 1px rgba(219, 50, 121, 0.5)
              .icon
                margin-top: 2px
                margin-left: 5px
        .desc-cont
          margin-top: 3rem
          h2.title-2
            color: #b7b7b7
          p
            margin: 1rem auto
            color: #4c4c4c
</style>
