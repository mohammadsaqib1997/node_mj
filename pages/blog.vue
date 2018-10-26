<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        h1.title-1.center INVESTMENT TIPS
        .columns.cards-cont
          .column(v-for="n in 3")
            .card-des
              .card-header
                .img-cont
                  img(src="~/assets/img/vid-img-3.jpg")
              .card-body
                .columns.is-gapless.is-mobile
                  .column
                    .txt Building up your refferals
                  .column
                    .date 28 Feb 2018
                .btn-cont
                  button.button.rd-more Read More
        .vw-all-btn-cont
          button.button View All

    .section.sct-2
      .container
        h1.title-1.center FUTURE PLANNING
        .columns.cards-cont
          .column(v-for="n in 3")
            .card-des.simple
              .card-header
                .img-cont
                  img(src="~/assets/img/vid-img-3.jpg")
              .card-body
                .columns.is-gapless.is-mobile
                  .column
                    .txt Building up your refferals
                  .column
                    .date 28 Feb 2018
                .btn-cont
                  button.button.rd-more Read More
        .vw-all-btn-cont
          button.button View All

    .section.sct-3
      .container
        h1.title-1.center PRODUCTS
        .columns.boxes-cont.is-multiline
          .column(v-for="n in 4")
            .box-cont
              .img-cont
                img(src="~/assets/img/vid-img-3.jpg")
              .det-cont
                h1.title-1 Bikes Owernship Made Easy
                span.date 28th Jun 2018
              .btn-cont
                button.button Read More
        .vw-all-btn-cont
          button.button View All
        hr
        h1.title-1.center EVENTS
        .columns.boxes-cont-2.is-multiline
          .column(v-for="n in 4")
            .box-cont
              .img-cont
                img(src="~/assets/img/vid-img-3.jpg")
              .columns.is-gapless.is-mobile
                .column.det-cont
                  h1.title-1 Bikes Owernship Made Easy
                  span.date 28th Jun 2018
                .column.is-narrow.btn-cont
                  button.button
                    span View
        .vw-all-btn-cont
          button.button View All

    .section.sct-4
      h1.title-1.center SOCIAL REFORMS
      .slider-cont
        .arrow.prev
        .arrow.next

        .slide-wrapper
          .columns.is-gapless
            .column
              .columns.is-gapless
                .column.is-narrow
                  .img-cont
                    img(src="~/assets/img/vid-img-3.jpg")
                .column
                  .det-cont
                    h1.title-1 Public trust initiative
                    p.txt Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    a.link(href="#") Read More
            .column
              .columns.is-gapless
                .column.is-narrow
                  .img-cont
                    img(src="~/assets/img/vid-img-3.jpg")
                .column
                  .det-cont
                    h1.title-1 Public trust initiative
                    p.txt Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    a.link(href="#") Read More


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

  .cards-cont
    margin-top: 2.5rem
    @media screen and (min-width: 769px)
      &>.column:nth-child(2)
        .card-des
          margin: 0 auto
      &>.column:nth-child(3)
        .card-des
          margin-left: auto
    @media screen and (max-width: 768px)
      &>.column
        .card-des
          margin: 0 auto
    .card-des
      width: 100%
      overflow: hidden
      border-radius: 5px
      max-width: 380px
      box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1)
      .card-header
        border-bottom: 2px solid #d9bd68
        .img-cont
          width: 100%
          display: flex
          align-items: center
          justify-content: center
          max-height: 230px
          overflow: hidden
          img
            width: 100%
      .card-body
        padding: 1.5rem
        .txt
          text-transform: uppercase
        .date
          text-align: right
          font-weight: 700
          font-size: 12px
        .btn-cont
          text-align: center
          .rd-more
            background-color: transparent
            color: white
            border: 2px solid #db3279
            height: auto
            font-weight: 800
            text-transform: uppercase
            font-size: 14px
            line-height: 2
            padding: 3px 1.5rem
            &:focus
              box-shadow: 0 0 5px 1px rgba(219, 50, 121, 0.5)
      &.simple
        background-color: #ffffff
        color: #6c6c6c
        .card-body
          .btn-cont
            .rd-more
              color: #3d3e5a
      &:not(.simple)
        background-color: #3d3e5a
        color: white
  .vw-all-btn-cont
    text-align: center
    margin-top: 1.5rem
    .button
      border: 2px solid #dfc884
      height: auto
      padding: 6px 1.2rem
      background-color: transparent
      color: #3d3e5a
      font-size: 14px
      font-weight: 700
      text-transform: uppercase
      &:focus
        box-shadow: 0 0 5px 1px rgba(216, 190, 111, .5)

  .sct-3
    .boxes-cont, .boxes-cont-2
      margin-top: 2.5rem
      &>.column
        width: 280px
        height: 280px
        margin: 0 auto
        @media screen and (max-width: 1279px)
          flex-grow: 0

    .boxes-cont
      .box-cont
        height: 100%
        position: relative
        box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1)
        .img-cont
          height: 100%
          display: flex
          align-items: center
          justify-content: center
          overflow: hidden
          &:after
            content: " "
            position: absolute
            background-color: rgba(59, 63, 87, 0.7)
            top: 0
            left: 0
            right: 0
            bottom: 0
          img
            height: 100%
            width: auto
            max-width: none
        .det-cont
          position: absolute
          top: 0
          left: 0
          padding: 1.2rem 1rem
          h1.title-1
            font-size: 18px
            font-family: inherit
            text-transform: none
            padding-bottom: 1rem
            color: white
            font-weight: 600
          .date
            font-size: 14px
            font-weight: 700
            color: white
            margin-top: 1rem
            display: inline-block
        .btn-cont
          position: absolute
          bottom: 0
          right: 0
          .button
            background-color: rgba(59, 63, 87, 0.8)
            color: white
            text-transform: uppercase
            font-weight: bold
            font-size: 14px
            height: auto
            padding: 16px 22px
            border: none
            border-radius: 0
            &:hover, &:focus
              background-color: rgba(216, 176, 71, 0.8)
            &:focus
              box-shadow: none

    .boxes-cont-2
      .box-cont
        cursor: pointer
        height: 100%
        position: relative
        box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1)
        .img-cont
          height: 100%
          display: flex
          align-items: center
          justify-content: center
          overflow: hidden
          &:after
            content: " "
            position: absolute

            top: 0
            left: 0
            right: 0
            bottom: 0
          img
            height: 100%
            width: auto
            max-width: none
        &>.columns
          position: absolute
          width: 100%
          bottom: 0
          left: 0
          .det-cont
            padding: 8px 1rem !important
            background-color: rgba(59, 63, 87, 0.8)
            h1.title-1
              font-size: 18px
              font-family: inherit
              text-transform: none
              padding-bottom: 8px
              color: white
              font-weight: 600
              &:after
                height: 2px
            .date
              font-size: 14px
              font-weight: 700
              color: white
              margin-top: 6px
              display: inline-block
          .btn-cont
            .button
              background-color: rgba(59, 63, 87, 0.95)
              color: white
              text-transform: uppercase
              font-weight: bold
              font-size: 14px
              display: block
              height: 100%
              width: 100%
              padding: 1rem
              border: none
              border-radius: 0
              &:before
                content: " "
                background-image: url("/img/vw-icon.png")
                height: 30px
                width: 30px
                background-size: contain
                background-repeat: no-repeat
                background-position: center
                display: block
                margin: 0 auto
              &:focus
                box-shadow: none
              span
                display: block
                margin-top: 5px
        &:hover
          .img-cont
            &:after
              background-color: rgba(59, 63, 87, 0.7)
          &>.columns
            .btn-cont
              .button
                &:before
                  background-image: url("/img/vw-icon-ac.png")

  .sct-4
    .slider-cont
      margin: 3rem auto
      @media screen and (max-width: 768px)
        text-align: center
      @media screen and (min-width: 769px)
        display: flex
        align-items: center
        justify-content: center
      .arrow
        width: 25px
        height: 70px
        background-repeat: no-repeat
        background-size: contain
        background-position: center
        cursor: pointer
        margin-right: 30px
        margin-left: 30px
        @media screen and (max-width: 768px)
          display: inline-block
          margin-bottom: 1.5rem
        &.prev
          background-image: url("/img/sld-prev-btn-lt.png")
        &.next
          order: 2
          background-image: url("/img/sld-next-btn-lt.png")
      .slide-wrapper
        width: 100%
        @media screen and (min-width: 769px)
          padding-left: 2rem
          padding-right: 2rem
        &>.columns
          &>.column
            &:first-child
              @media screen and (min-width: 1280px)
                margin-right: 5rem
                padding-right: 5rem !important
                border-right: 1px solid #c6c6c6
              @media screen and (max-width: 1279px)
                margin-bottom: 2rem
                padding-bottom: 2rem !important
                border-bottom: 1px solid #c6c6c6
            &>.columns
              align-items: center
          @media screen and (max-width: 1279px)
            display: block

        .img-cont
          display: flex
          align-items: center
          justify-content: center
          width: 130px
          height: 130px
          background-color: white
          overflow: hidden
          box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1)
          border: 2px solid white
          @media screen and (max-width: 768px)
            display: block
            margin: 0 auto 1.5rem
          img
            height: 100%
            width: auto
            max-width: none
        .det-cont
          @media screen and (min-width: 769px)
            padding: 0 2rem
          h1.title-1
            font-size: 18px
            font-weight: bold
            font-family: inherit
            padding-bottom: 1rem
            text-transform: none
            &:after
              height: 2px
              @media screen and (max-width: 768px)
                left: 0
                right: 0
                margin: 0 auto
          p.txt
            margin: 1rem auto
            color: #6c6c6c
          a.link
            font-weight: bold
            color: #353648
            text-transform: uppercase
            font-size: 14px

</style>
