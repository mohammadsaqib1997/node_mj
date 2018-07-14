<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        .columns.is-gapless
          .column.is-5
            h1.title-1.lt Discount Card
            p.cnt
              | A marketing product in which we provide discounts in different outlets along with complete solution of house hold to the people of Pakistan.
            button.button.btn More Info
    .section.sct-2
      .container
        h1.title-1.center Products
        .columns
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-1.png")
              .title SUPREME CARD
              .detail-txt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              button.button View More
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-2.png")
              .title MOTORCYCLE
              .detail-txt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              button.button View More
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-3.png")
              .title SPI INSSURANCE
              .detail-txt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              button.button View More
    upcoming-prod-section
    .section.sct-4
      .container
        .columns.is-gapless
          .column.is-7
            .winner-cont
              h1.title-1.lt
                | Winner Of
                br
                | The Month
              .columns.is-gapless.is-desktop
                .column.is-narrow
                  .img-cont
                    img(src="~/assets/img/default.png")
                  .lvl-cont
                    span LVL 4
                .column.detail-cont
                  .columns.is-gapless.is-mobile
                    .column.awd-img.is-narrow
                      img(src="~/assets/img/awrd.png")
                    .column.name.is-narrow
                      span
                        | AMIR
                        br
                        | MUNEER
                  .score-cont
                    span Score:
                    span  1200
          .column
            .next-winner-cont
              .announce-date-cont
                h3.title-3.acnt
                  | NEXT WINNER
                  br
                  | ANNOUNCEMENT
                .month-cont
                  .counter 02
                  .txt Month
                .dw-cont.columns.is-gapless.is-mobile
                  .days-cont.column
                    .counter 15
                    .txt Days
                  .week-cont.column
                    .counter 04
                    .txt Weeks
    .section.sct-5
      .container
        .columns
          .column
            .detail-cont
              h1.title-1
                | GROWTH OPPORTUNITIES
                br
                | WITH SUPREME
              p.txt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                | sed do eiusmod tempor incididunt
              a(href="#") More Info
          .column
            .img-cont
              img(src="~/assets/img/hm-op-img-1.png")
</template>

<script>
import upcomingProdSection from "~/components/upcoming-prod-section.vue"
export default {
  components: {
    "upcoming-prod-section": upcomingProdSection
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="sass">
  .sct-1
    position: relative
    margin-bottom: 1rem
    box-shadow: 0 5px 3px -3px #999
    background-image: url('~/assets/img/hm-img-1.jpg')
    background-repeat: no-repeat
    background-size: cover
    background-position: center
    min-height: 32rem
    display: flex
    .container
      display: flex
      align-items: center
      .columns
        width: 100%
    p.cnt
      color: #c5c5c7
      padding: 3rem 5rem 3rem 0
      font-size: 18px
    button.btn
      background-color: transparent
      border: 1px solid #d9bd68
      color: #d9bd68
      padding: 8px 2rem
      height: auto
  .sct-2
    background-color: #f6f6f6
    padding-top: 2rem
    .box-pro-det
      text-align: center
      margin-bottom: 2rem
      margin-top: 5rem
      .img-con
        display: flex
        width: 120px
        height: 120px
        align-items: center
        justify-content: center
        background-color: #f6f6f6
        border: 2px solid white
        border-radius: 10px
        box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
        transform: rotate(45deg)
        margin: 0 auto
        margin-bottom: 3rem
        img
          transform: rotate(-45deg)
          max-height: 3.5rem
      .title
        font-size: 15px
        text-transform: uppercase
        color: #3d3e5a
      .detail-txt
        color: #868686
        font-size: 15px
        padding: 0 4rem
        margin-bottom: 1.5rem
      .button
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
  .sct-4
    padding: 0
    position: relative
    @media screen and (min-width: 769px)
      &:before, &:after
        content: " "
        position: absolute
        width: 50%
        height: 100%
      &:before
        left: 0
        top: 0
        background-color: #3d3e59
      &:after
        right: 0
        top: 0
        background-color: #2f3047
      &>.container
        position: relative
        z-index: 2
    .winner-cont
      padding: 3rem
      background-color: #3d3e5a
      @media screen and (max-width: 768px)
        text-align: center
      &>.columns
        @media screen and (min-width: 1088px)
          padding: 4rem 0
        @media screen and (max-width: 1087px)
          text-align: center
          padding: 2rem 0 0
      h1.title-1
        font-size: 40px
        line-height: 50px
        @media screen and (max-width: 1087px)
          text-align: center
          &:after
            left: 0
            right: 0
            margin: 0 auto
      .img-cont
        display: block
        overflow: hidden
        width: 180px
        height: 180px
        border-radius: 100%
        padding: 5px
        border: 2px solid #d9bd68
        img
          border-radius: 100%
        @media screen and (min-width: 1088px) and (max-width: 1279px)
          width: 150px
          height: 150px
        @media screen and (max-width: 1087px)
          margin: 0 auto
      .lvl-cont
        text-align: center
        color: #9697bb
        font-weight: 800
        font-size: 18px
        margin-top: 8px
      .detail-cont
        @media screen and (min-width: 1280px)
          margin-left: 5rem
        @media screen and (min-width: 1088px) and (max-width: 1279px)
          margin-left: 2rem
          .awd-img
            img
              width: 80px
        @media screen and (max-width: 1087px)
          display: inline-block
          margin: 2rem auto 0
        @media screen and (max-width: 375px)
          &>.is-mobile
            display: block
        .name
          font-size: 40px
          line-height: 45px
          color: #d9bd68
          font-family: serif
          font-weight: 600
          margin: 0 15px
          position: relative
          text-align: left
          &:after
            content: " "
            position: absolute
            height: 1px
            width: 100%
            background-color: #d9bd68
            bottom: 0
            left: 0
          @media screen and (min-width: 1088px) and (max-width: 1279px)
            font-size: 35px
            line-height: 40px
          @media screen and (max-width: 375px)
            margin: 15px
            text-align: center
        .score-cont
          font-size: 3rem
          text-transform: uppercase
          font-weight: 300
          color: #fff
          @media screen and (min-width: 1088px) and (max-width: 1279px)
            font-size: 35px
    .next-winner-cont
      background-color: #2f3048
      height: 100%
      padding: 3rem 0
      text-align: center
      .announce-date-cont
        color: #9697bb
        display: inline-block
        text-align: center
        &>h3.title-3
          font-size: 24px
          font-weight: 600
          @media screen and (min-width: 769px)
            text-align: left
        .month-cont
          border-bottom: 1px solid #d9bd68
          margin-bottom: 1rem
          .counter
            font-size: 10rem
            font-weight: 200
            line-height: 1
          .txt
            font-size: 3.2rem
            font-weight: 700
            text-transform: uppercase
        .dw-cont
          .days-cont, .week-cont
            .counter
              font-weight: 200
              line-height: 1
              font-size: 4rem
            .txt
              font-weight: 700
              text-transform: uppercase
          .days-cont
            border-right: 1px solid #d9bd68
  .sct-5
    padding: 6rem 3.5rem
    background-image: url('~/assets/img/hm-op-img-2.png')
    background-repeat: no-repeat
    background-size: cover
    background-position: center
    @media screen and (max-width: 768px)
      padding: 3rem 1rem
    .detail-cont
      height: 100%
      padding: 2rem
      border: 5px solid #5f6077
      &>h1.title-1
        @media screen and (min-width: 769px)
          font-size: 2.6rem
        @media screen and (min-width: 426px) and (max-width: 768px)
          font-size: 40px
        @media screen and (max-width: 425px)
          font-size: 8vw
      &>.txt
        font-size: 22px
        margin: 2rem auto
        color: #5e5e5e
        @media screen and (max-width: 425px)
          font-size: 18px
      &>a
        text-transform: uppercase
        color: #db3279
        font-weight: 500
    .img-cont
      height: 100%
      display: flex
      align-items: center
      justify-content: center
</style>
