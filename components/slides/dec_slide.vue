<template>
  <div class="container">
    <div class="sld-main">
      <div class="banner-img-cont">
        <div class="ribbon-cont">
          <img src="/img/banner-ribbon.png" alt="Mega Promotion">
        </div>
        <div class="img-cont">
          <img src="/img/onlyBike.png" alt="WIN a Bike">
        </div>
      </div>
      <img class="logo" src="/img/post-logo.png" alt="MJ Supreme">
      <div class="sld-content cont-1">
        <p>
          Contest begins from
          <span class="hl">8th</span> to
          <span class="hl">31st</span> December
        </p>
      </div>
      <div class="sld-content cont-2">
        <p>
          Just sponser
          <span class="hl">5 direct referrals</span> from your referral ID and increase your chances to get rewarded.
        </p>
      </div>
      <div class="terms-cont">
        <div>
          <p>Terms and conditions apply</p>
        </div>
        <div>
          <p>Lucky Draw to be held on 15th January 2019 in Karachi.</p>
          <p>Related details will be posted on website & social media soon.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  /deep/ {
    .sld-main {
      position: relative;

      & > .banner-img-cont {
        .ribbon-cont {
          position: absolute;
          width: 50rem;
          top: 105px;
          left: 275px;
          img {
            position: relative;
            z-index: 1;
          }
          &:before {
            content: "";
            position: absolute;
            box-shadow: 0 0 53px 35px #1b1d29;
            width: 72%;
            height: 35%;
            top: 30%;
            left: 15%;
          }
          @media screen and (max-width: 768px) {
            width: 12rem;
            top: 100px;
            left: 15px;
            &:before {
              box-shadow: 0 0 53px 25px #1b1d29;
              width: 66%;
              height: 0;
              top: 42%;
            }
          }
          @media screen and (min-width: 769px) and (max-width: 1024px) {
            width: 20rem;
            top: 100px;
            left: 85px;
            &:before {
              box-shadow: 0 0 53px 25px #1b1d29;
              width: 66%;
              height: 0;
              top: 42%;
            }
          }
          @media screen and (min-width: 1025px) and (max-width: 1526px) {
            width: 35rem;
            top: 100px;
            left: 125px;
            &:before {
              box-shadow: 0 0 53px 25px #1b1d29;
              width: 66%;
              height: 0;
              top: 42%;
            }
          }
        }
        .img-cont {
          position: absolute;
          width: 35rem;
          top: -55px;
          left: -135px;
          img {
            position: relative;
            z-index: 1;
          }
          &:before {
            content: "";
            position: absolute;
            box-shadow: 0 0 53px 50px #171923;
            width: 50%;
            height: 50%;
            transform: rotate(45deg);
            left: 25%;
            top: 25%;
          }
          @media screen and (max-width: 768px) {
            width: 14rem;
            left: -120px;
            top: 70px;
            &:before {
              width: 35%;
              height: 35%;
              left: 32%;
              top: 33%;
            }
          }
          @media screen and (min-width: 769px) and (max-width: 1024px) {
            width: 20rem;
            left: -90px;
            top: 70px;
            &:before {
              width: 40%;
              height: 40%;
              left: 30%;
              top: 31%;
            }
          }
          @media screen and (min-width: 1025px) and (max-width: 1526px) {
            width: 30rem;
            left: -155px;
            top: 30px;
            &:before {
              width: 40%;
              height: 40%;
              left: 30%;
              top: 31%;
            }
          }
        }
      }

      & > .logo {
        position: absolute;
        right: -70px;
        top: 155px;
        width: 22rem;
        @media screen and (max-width: 768px) {
          position: relative;
          right: auto;
          top: 12px;
          margin: 0 auto;
          width: 12rem;
        }
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          position: relative;
          right: auto;
          top: 20px;
          margin-left: auto;
          margin-right: 0;
          width: 14rem;
        }
        @media screen and (min-width: 1025px) and (max-width: 1526px) {
          position: absolute;
          right: auto;
          left: 43rem;
          top: 140px;
          width: 15rem;
        }
      }

      & > .sld-content {
        &.cont-1 {
          position: absolute;
          top: 45px;
          left: 22rem;
          @media screen and (max-width: 425px) {
            position: relative;
            left: auto;
            width: 150px;
            text-align: right;
            margin-left: auto;
            margin-right: -10px;
            top: 245px;
            p {
              font-size: 16px;
            }
          }
          @media screen and (min-width: 426px) and (max-width: 768px) {
            top: 210px;
            left: 125px;
            p {
              font-size: 20px;
            }
          }
          @media screen and (min-width: 769px) and (max-width: 1024px) {
            top: 210px;
            left: 350px;
          }
          @media screen and (min-width: 1025px) and (max-width: 1526px) {
            top: 50px;
            left: 12rem;
          }
        }
        &.cont-2 {
          position: absolute;
          width: 30rem;
          top: 298px;
          left: 26rem;
          p {
            font-size: 24px;
          }
          @media screen and (max-width: 425px) {
            position: relative;
            left: auto;
            width: 150px;
            text-align: right;
            margin-left: auto;
            margin-right: -10px;
            top: 255px;
            p {
              font-size: 16px;
            }
          }
          @media screen and (min-width: 426px) and (max-width: 768px) {
            top: 300px;
            left: 125px;
            width: auto;
            p {
              font-size: 20px;
            }
          }
          @media screen and (min-width: 769px) and (max-width: 1024px) {
            top: 345px;
            left: 350px;
            width: auto;
          }
          @media screen and (min-width: 1025px) and (max-width: 1526px) {
            top: 260px;
            left: 22rem;
          }
        }
        p {
          color: #b5b5bc;
          font-size: 28px;
          font-weight: 400;
          .hl {
            color: #d3b867;
            font-weight: 500;
          }
        }
      }

      & > .terms-cont {
        position: absolute;
        right: -100px;
        top: 340px;
        border-left: 2px solid #d3b867;
        min-height: 115px;
        & > div {
          padding: 0 1rem;
          &:first-child {
            p {
              color: #d3b867;
              font-size: 14px;
              margin-bottom: 12px;
            }
          }
        }

        p {
          color: #b5b5bc;
          font-size: 16px;
          font-weight: 400;
        }
        @media screen and (max-width: 425px) {
          position: relative;
          right: auto;
          top: 285px;
          width: 225px;
          left: -65px;
          p {
            font-size: 12px;
          }
          & > div {
            &:first-child {
              p {
                font-size: 12px;
              }
            }
          }
        }
        @media screen and (min-width: 426px) and (max-width: 768px) {
          position: relative;
          right: auto;
          top: 490px;
          width: auto;
          left: -65px;
        }
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          position: relative;
          right: auto;
          top: 375px;
          width: 365px;
          left: -65px;
        }
        @media screen and (min-width: 1025px) and (max-width: 1526px) {
          position: relative;
          right: auto;
          top: 438px;
          width: 475px;
          margin-left: auto;
          margin-right: 0;
        }
      }
    }
  }
}
</style>

