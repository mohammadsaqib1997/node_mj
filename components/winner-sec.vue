<template lang="pug">
  .section
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
</template>

<style lang="scss" scoped>
.section {
  padding: 0;
  position: relative;

  @media screen and (min-width: 769px) {
    &:before,
    &:after {
      content: " ";
      position: absolute;
      width: 50%;
      height: 100%;
    }

    &:before {
      left: 0;
      top: 0;
      background-color: #3d3e59;
    }

    &:after {
      right: 0;
      top: 0;
      background-color: #2f3047;
    }

    & > .container {
      position: relative;
      z-index: 2;
    }
  }

  .winner-cont {
    padding: 3rem;
    background-color: #3d3e5a;

    @media screen and (max-width: 768px) {
      text-align: center;
    }

    & > .columns {
      @media screen and (min-width: 1088px) {
        padding: 4rem 0;
      }

      @media screen and (max-width: 1087px) {
        text-align: center;
        padding: 2rem 0 0;
      }
    }

    h1.title-1 {
      font-size: 40px;
      line-height: 50px;

      @media screen and (max-width: 1087px) {
        text-align: center;

        &:after {
          left: 0;
          right: 0;
          margin: 0 auto;
        }
      }
    }

    .img-cont {
      display: block;
      overflow: hidden;
      width: 180px;
      height: 180px;
      border-radius: 100%;
      padding: 5px;
      border: 2px solid #d9bd68;

      img {
        border-radius: 100%;
      }

      @media screen and (min-width: 1088px) and (max-width: 1279px) {
        width: 150px;
        height: 150px;
      }

      @media screen and (max-width: 1087px) {
        margin: 0 auto;
      }
    }

    .lvl-cont {
      text-align: center;
      color: #9697bb;
      font-weight: 800;
      font-size: 18px;
      margin-top: 8px;
    }

    .detail-cont {
      @media screen and (min-width: 1280px) {
        margin-left: 5rem;
      }

      @media screen and (min-width: 1088px) and (max-width: 1279px) {
        margin-left: 2rem;

        .awd-img {
          img {
            width: 80px;
          }
        }
      }

      @media screen and (max-width: 1087px) {
        display: inline-block;
        margin: 2rem auto 0;
      }

      @media screen and (max-width: 375px) {
        & > .is-mobile {
          display: block;
        }
      }

      .name {
        font-size: 40px;
        line-height: 45px;
        color: #d9bd68;
        font-family: serif;
        font-weight: 600;
        margin: 0 15px;
        position: relative;
        text-align: left;

        &:after {
          content: " ";
          position: absolute;
          height: 1px;
          width: 100%;
          background-color: #d9bd68;
          bottom: 0;
          left: 0;
        }

        @media screen and (min-width: 1088px) and (max-width: 1279px) {
          font-size: 35px;
          line-height: 40px;
        }

        @media screen and (max-width: 375px) {
          margin: 15px;
          text-align: center;
        }
      }

      .score-cont {
        font-size: 3rem;
        text-transform: uppercase;
        font-weight: 300;
        color: #fff;

        @media screen and (min-width: 1088px) and (max-width: 1279px) {
          font-size: 35px;
        }
      }
    }
  }

  .next-winner-cont {
    background-color: #2f3048;
    height: 100%;
    padding: 3rem 0;
    text-align: center;

    .announce-date-cont {
      color: #9697bb;
      display: inline-block;
      text-align: center;

      & > h3.title-3 {
        font-size: 24px;
        font-weight: 600;

        @media screen and (min-width: 769px) {
          text-align: left;
        }
      }

      .month-cont {
        border-bottom: 1px solid #d9bd68;
        margin-bottom: 1rem;

        .counter {
          font-size: 10rem;
          font-weight: 200;
          line-height: 1;
        }

        .txt {
          font-size: 3.2rem;
          font-weight: 700;
          text-transform: uppercase;
        }
      }

      .dw-cont {
        .days-cont,
        .week-cont {
          .counter {
            font-weight: 200;
            line-height: 1;
            font-size: 4rem;
          }

          .txt {
            font-weight: 700;
            text-transform: uppercase;
          }
        }

        .days-cont {
          border-right: 1px solid #d9bd68;
        }
      }
    }
  }
}
</style>

