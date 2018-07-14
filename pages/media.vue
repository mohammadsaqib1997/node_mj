<template lang="pug">
  .wrapper
    .section
      .container
        h1.title-1.center PRESENTATIONS
        .main-slider-cont
          .arrow.prev
          .arrow.next
          .cont-wrapper.columns.is-gapless
            .column.is-12
              .slide
                h1.title-1.lt
                  | Earn More
                  br
                  | Profit
                .img-cont
                  img(src="~/assets/img/slides/slide-img-1.jpg")
                .cap-cont.columns.is-gapless
                  .decs-cont.column
                    p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                      | incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                      | quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  .btns-cont.column.is-3
                    .inner-cont
                      .det-cont
                        span
                          | Go To
                          br
                          | Presentation


        hr
        .columns.vid-cont
          .column.is-3
            h1.title-1.simple Videos
            .img-cont
              img(src="~/assets/img/video-plr-img.png")
          .column.is-9
            .slider-indec-cont
              .prev.arrow
              .link-txt View All
              .next.arrow
            .columns.slider-cont
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-1.jpg")
                .cap-txt
                  | Buildidng up your refferals
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-2.jpg")
                .cap-txt
                  | Get Maximum Discounts Rates Tips
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-3.jpg")
                .cap-txt
                  | Planning Your Growth

        hr
        .columns.gallery-cont
          .column.is-3
            h1.title-1.simple Gallery
            .img-cont
              img(src="~/assets/img/gallery-img.png")
          .column.is-9
            .slider-indec-cont
              .prev.arrow
              .link-txt View All
              .next.arrow
            .columns.slider-cont.is-gapless
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-1.jpg")
                .cap-cont
                  .inner-cont
                    .txt Team Connect Event
                    .divider
                    .txt 29th Jun 2018
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-2.jpg")
                .cap-cont
                  .inner-cont
                    .txt Team Connect Event
                    .divider
                    .txt 29th Jun 2018
              .column.is-4
                .img-cont
                  img(src="~/assets/img/vid-img-3.jpg")
                .cap-cont
                  .inner-cont
                    .txt Team Connect Event
                    .divider
                    .txt 29th Jun 2018
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
  .section
    .slider-indec-cont
      display: flex
      align-items: center
      justify-content: flex-end
      margin-bottom: 2.4rem
      margin-top: 1.5rem
      @media screen and (max-width: 768px)
        justify-content: center
      .link-txt
        text-transform: uppercase
        font-size: 15px
        font-weight: 700
        position: relative
        margin: 0 1rem
        &:after
          content: " "
          position: absolute
          background-color: #d2d2d6
          height: 1px
          width: 100%
          left: 0
          bottom: 0
      .arrow
        width: 22px
        height: 22px
        background-repeat: no-repeat
        background-size: contain
        background-position: center
        cursor: pointer
        &.prev
          background-image: url("~/assets/img/sld-prev-icon.png")
        &.next
          background-image: url("~/assets/img/sld-next-icon.png")
    .slider-cont
      @media screen and (max-width: 768px)
        max-width: 300px
        margin: 0 auto 1rem
      .img-cont
        display: flex
        align-items: center
        justify-content: center
        overflow: hidden
        height: 265px
        width: 100%
        margin: 0 auto
        position: relative
        cursor: pointer
        box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.15)
        &:before
          content: " "
          position: absolute
          right: 0
          left: 0
          top: 0
          bottom: 0
        img
          height: 100%
          max-width: none

    .main-slider-cont
      display: flex
      align-items: center
      justify-content: center
      margin: 3rem auto
      @media screen and (max-width: 768px)
        display: block
        text-align: center
      .arrow
        width: 25px
        height: 70px
        background-repeat: no-repeat
        background-size: contain
        background-position: center
        cursor: pointer
        @media screen and (max-width: 768px)
          display: inline-block
          margin-bottom: 1rem
        &.prev
          background-image: url("~/assets/img/sld-prev-btn.png")
          margin-right: 30px
        &.next
          margin-left: 30px
          order: 2
          background-image: url("~/assets/img/sld-next-btn.png")
      .cont-wrapper
        width: 100%
        box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.15)
        .slide
          position: relative
          @media screen and (max-width: 768px)
            background-color: rgba(59, 63, 87, .8)
          .img-cont
            display: flex
            align-items: center
            justify-content: center
            overflow: hidden
            position: relative
            &:after
              position: absolute
              content: " "
              top: 0
              left: 0
              bottom: 0
              right: 0
              background-color: rgba(59, 63, 87, 0.6)
            @media screen and (min-width: 768px)
              max-height: 380px
          h1.title-1
            position: absolute
            top: 2rem
            left: 2rem
            line-height: 1.1
            z-index: 2
            text-align: left
            @media screen and (max-width: 768px)
              position: relative
              top: 0
              left: 0
              padding-top: 1rem
              margin-left: 1rem
              margin-bottom: 1rem
          .cap-cont
            background-color: rgba(59, 63, 87, .5)
            color: #fff
            @media screen and (min-width: 1280px)
              position: absolute
              bottom: 0
            .decs-cont
              padding: 2rem !important
              p
                font-size: 20px
                font-weight: 300
            .btns-cont
              cursor: pointer
              @media screen and (min-width: 769px)
                border-left: 1px solid #d9bd68
              .inner-cont
                display: flex
                padding: 1rem 0
                height: 100%
                align-items: center
                justify-content: center
                background-color: rgba(59, 63, 87, .8)
                .det-cont
                  text-align: center
                  &>span
                    font-weight: 700
                    text-transform: uppercase
                    font-size: 14px
                  &:after
                    content: " "
                    display: block
                    height: 50px
                    width: 50px
                    margin: 8px auto
                    background-image: url("~/assets/img/play-btn.png")
                    background-repeat: no-repeat
                    background-size: contain
                    background-position: center

    .vid-cont
      @media screen and (max-width: 768px)
        text-align: center
      .slider-cont
        .img-cont
          margin-bottom: 1rem
          &:before
            background-color: rgba(0, 0, 0, .4)
          &:hover
            &:before
              background-color: rgba(0, 0, 0, .6)
            &:after
              content: " "
              position: absolute
              background-image: url("~/assets/img/vid-plr-icon.png")
              background-repeat: no-repeat
              background-size: contain
              background-position: center
              height: 80px
              width: 80px
        .cap-txt
          color: #565656
          font-weight: 500
          font-size: 16px
    .gallery-cont
      @media screen and (max-width: 768px)
        text-align: center

      .slider-cont
        .column
          position: relative
          cursor: pointer
          @media screen and (max-width: 768px)
            margin-bottom: 1rem
          .cap-cont
            display: none
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            background-color: rgba(59, 63, 87, .5)
            align-items: center
            justify-content: center
            .inner-cont
              text-align: center
              color: #fefefe
              font-weight: 700
              font-size: 16px
              .divider
                display: inline-block
                width: 50px
                height: 5px
                background-color: #d9bd68
                margin: 3px auto
          &:hover
            .cap-cont
              display: flex
</style>
