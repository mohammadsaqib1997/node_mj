<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        .columns.is-gapless
          .column.is-5
            h1.title-1 Discount Card
            p.cnt
              | A marketing product in which we provide discounts in different outlets along with complete solution of house hold to the people of Pakistan.
            button.button.btn More Info
    .section.sct-2
      .container
        h1.title-1 Products
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
    .section.sct-3
      .container
        h1.title-1 Upcoming PRoDUCTS
        .columns.is-multiline.fpd-cont
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-1.png")
              .det-cont
                .title Bikes
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-2.png")
              .det-cont
                .title New Cars
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-3.png")
              .det-cont
                .title Old Cars
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-4.png")
              .det-cont
                .title Vans
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-5.png")
              .det-cont
                .title Plots
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-6.png")
              .det-cont
                .title One Story Bunglow
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
          .column.is-4
            .box-fpd-cont
              .img-cont
                img(src="~/assets/img/hm-fpd-img-7.png")
              .det-cont
                .title 2 Story Bunglow
                .detail-txt
                  | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  | sed do eiusmod tempor incididunt
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="sass">
  .sct-2, .sct-3
    h1.title-1
      text-align: center
      &:after
        left: 0
        right: 0
        margin: 0 auto

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

    h1.title-1
      color: #fefefe
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
  .sct-3
    background-color: #fefefe
    position: relative
    margin-top: 3rem
    &:before
      content: " "
      position: absolute
      top: -30px
      left: 0
      right: 0
      background-color: #fefefe
      height: 4rem
      transform: rotate(-2deg)
      box-shadow: 0 -3px 10px -3px rgba(204, 204, 204, .3)
    .fpd-cont
      margin-top: 1.5rem
      .box-fpd-cont
        margin-top: 2rem
        display: flex
        .det-cont
          padding-right: 3rem
          width: auto
          flex-grow: 1
          flex-basis: 0
          flex-shrink: 1
          display: block
          .title
            font-size: 15px
            text-transform: uppercase
            color: #3d3e5a
            padding-top: 6px
            margin-bottom: 8px
          .detail-txt
            color: #868686
            font-size: 15px
            margin-bottom: 1.5rem
        .img-cont
          display: flex
          align-items: center
          justify-content: center
          height: 110px
          width: 110px
          background-color: white
          border: 2px solid #e3ce90
          border-radius: 5px
          margin-right: 1rem










</style>
