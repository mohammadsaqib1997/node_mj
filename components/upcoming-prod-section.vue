<template lang="pug">
.section.up-cm-pd
  .container
    h1.title-1.center Upcoming PRoDUCTS
    .columns.is-multiline.fpd-cont
      //- // .column.is-4
      //- //   .box-fpd-cont
      //- //     .img-cont
      //- //       img(src="~/assets/img/hm-fpd-img-1.png")
      //- //     .det-cont
      //- //       .title Bikes
      //- //       .detail-txt
      //- //         | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
      //- //         | sed do eiusmod tempor incididunt
      .column.is-4
        .box-fpd-cont
          .img-cont
            img(src="~/assets/img/hm-fpd-img-2.png")
          .det-cont
            .title New Cars
            .detail-txt
              | Our registered members would be given an opportunity to own a brand. 
              //- br
              //- a.link Read more...
      .column.is-4
        .box-fpd-cont
          .img-cont
            img(src="~/assets/img/hm-fpd-img-3.png")
          .det-cont
            .title Used Cars
            .detail-txt
              | Our valued members would also be facilitated to buy a variety.
              //- br
              //- a.link Read more...
      //- // .column.is-4
      //- //   .box-fpd-cont
      //- //     .img-cont
      //- //       img(src="~/assets/img/hm-fpd-img-4.png")
      //- //     .det-cont
      //- //       .title Vans
      //- //       .detail-txt
      //- //         | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
      //- //         | sed do eiusmod tempor incididunt
      .column.is-4
        .box-fpd-cont
          .img-cont
            img(src="~/assets/img/hm-fpd-img-5.png")
          .det-cont
            .title Plots
            .detail-txt
              | Apart from the different luxuries, MJ Supreme has also been planning.
              //- br
              //- a.link Read more...
      //- // .column.is-4
      //- //   .box-fpd-cont
      //- //     .img-cont
      //- //       img(src="~/assets/img/hm-fpd-img-6.png")
      //- //     .det-cont
      //- //       .title One Story Bunglow
      //- //       .detail-txt
      //- //         | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
      //- //         | sed do eiusmod tempor incididunt
      //- // .column.is-4
      //- //   .box-fpd-cont
      //- //     .img-cont
      //- //       img(src="~/assets/img/hm-fpd-img-7.png")
      //- //     .det-cont
      //- //       .title 2 Story Bunglow
      //- //       .detail-txt
      //- //         | Lorem ipsum dolor sit amet, consectetur adipisicing elit,
      //- //         | sed do eiusmod tempor incididunt
</template>

<style lang="sass" scoped>
  .up-cm-pd
    background-color: #f6f6f6
    position: relative
    margin-top: 3rem
    @media screen and (min-width: 769px)
      padding-bottom: 5rem
    &:before
      content: " "
      position: absolute
      top: -30px
      left: 0
      right: 0
      background-color: #f6f6f6
      height: 4rem
      transform: rotate(-2deg)
      box-shadow: 0 -3px 10px -3px rgba(204, 204, 204, .3)
    & /deep/
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
              .link
                color: #3d3e5a
                font-size: 14px
                font-weight: 500
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
