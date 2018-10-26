<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        .columns.is-variable.is-7.main-prd-cont
          .column
            .prd-det-cont
              .prd-cont
                h1.title-1 Bike
                .img-cont
                  img(src="~/assets/img/prd-det-img-1.jpg")
                .info-cont.has-text-right
                  button.button.reg-now Register Now
                    b-icon(icon="angle-right")
              .desc-cont
                h2.title-2 Description
                p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                  | incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  | quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  | Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          .column.is-4
            .ben-cont
              h1.title-1.simple Benefits
              .li
                p Quick ownership.
              .li
                p Easy Installments.
              .li
                p Insurance included.
              .li
                p Customizable payment plan.
              .li
                p Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              .li
                p Lorem ipsum dolor sit amet
        hr
    .section.sct-2
      .container
        .faq-cont
          h1.title-1.simple Faq
          .cont
            a.item(href="#")
              p How can I apply for multiple bikes ?
            a.item(href="#")
              p How long it takes to process an application and what is the wait on confirmation period ?
            a.item(href="#")
              p How can I pay and what payment methods are available ?
            .item.simple.has-text-right
              a(href="#") View all >
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
  .sct-1
    padding-bottom: 0rem
    .main-prd-cont
      margin-top: 1rem
      .prd-det-cont
        .prd-cont
          box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
          position: relative
          h1.title-1
            position: absolute
            color: #fff
            margin: 2rem 3rem
            line-height: 1
            padding-bottom: 12px
          .img-cont
            display: flex
            align-items: center
            justify-content: center
            img
              width: 100%
          .info-cont
            padding: 1.5rem
            background-color: #ffffff
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
      .ben-cont
        .li
          padding-left: 1.8rem
          position: relative
          margin-bottom: 1rem
          &:before
            content: " "
            position: absolute
            width: 10px
            height: 10px
            border-radius: 100%
            background-color: #db3279
            left: 0
            top: 13px
          p
            font-size: 24px
            font-weight: 300
  .sct-2
    padding-top: 2rem
    padding-bottom: 5rem
    .faq-cont
      .cont
        background-color: #ffffff
        border-radius: 5px
        box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
        .item
          display: block
          p
            font-size: 18px
            font-weight: 300
            color: #888888
          &.simple
            padding: .5rem 1rem
            &>a
              text-transform: uppercase
              color: #353648
              font-weight: 700
              font-size: 14px
          &:not(.simple)
            padding: 1.5rem
            padding-left: 4rem
            position: relative
            &:before
              content: " "
              position: absolute
              height: 30px
              width: 30px
              background-image: url("/img/qst-mark-img.png")
              background-repeat: no-repeat
              background-size: contain
              left: 1.4rem
              top: 1.4rem
          &:not(:last-child)
            border-bottom: 1px solid #ececec


</style>
