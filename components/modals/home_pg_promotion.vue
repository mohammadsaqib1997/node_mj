<template>
  <b-modal class="promotion" :active.sync="modalAct" :canCancel="['x']">
    <div class="main">
      <img class="logo" src="/img/post-logo.png" alt="MJ Supreme">

      <div class="banner-img-cont">
        <div class="ribbon-cont">
          <img src="/img/banner-ribbon.png" alt="Mega Promotion">
        </div>
        <div class="img-cont">
          <img src="/img/onlyBike.png" alt="WIN a Bike">
        </div>
      </div>

      <div class="banner-content">
        <p>
          Contest begins from
          <span class="hl">8th</span> to
          <span class="hl">31st</span> December
        </p>
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
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal]
};
</script>

<style lang="scss" scoped>
.promotion /deep/ {
  .modal-content {
    width: 820px;
  }
  .main {
    position: relative;
    background-image: url("/img/post-bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    & > .logo {
      width: 330px;
      position: relative;
      top: 42px;
      left: 295px;

      @media screen and (max-width: 820px) {
        top: 20px;
        width: 220px;
      }
    }

    & > .banner-img-cont {
      position: relative;
      width: 100%;
      .ribbon-cont {
        width: 35rem;
        position: relative;
        margin-left: 200px;
        top: 60px;
        img {
          position: relative;
          z-index: 1;
        }
        &:before {
          content: "";
          position: absolute;
          box-shadow: 0 0 53px 35px #1b1d29;
          width: 70%;
          height: 27%;
          top: 32%;
          left: 16%;
        }
        @media screen and (max-width: 820px) {
          width: 15rem;
          margin-left: 325px;
          top: 55px;
          &:before {
            box-shadow: 0 0 53px 25px #1b1d29;
            width: 66%;
            height: 0;
            top: 42%;
          }
        }
      }
      .img-cont {
        width: 35rem;
        position: relative;
        margin-top: -150px;
        margin-left: -100px;
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
        @media screen and (max-width: 820px) {
          width: 20rem;
          margin-top: -35px;
          margin-left: 150px;
          &:before {
            width: 35%;
            height: 35%;
            left: 32%;
            top: 33%;
          }
        }
      }
    }

    & > .banner-content {
      width: 250px;
      position: relative;
      margin-right: 60px;
      margin-left: auto;
      margin-top: -310px;
      p {
        color: #b5b5bc;
        font-size: 24px;
        margin-bottom: 1rem;
        font-weight: 400;
        .hl {
          color: #d3b867;
          font-weight: 500;
        }
      }

      @media screen and (max-width: 820px) {
        width: 245px;
        margin: 0 auto;
        margin-top: 0;
        text-align: center;
        p {
          font-size: 16px;
        }
      }
    }

    & > .terms-cont {
      margin-top: 5rem;
      min-height: 4rem;
      @media screen and (min-width: 821px) {
        display: flex;
        & > div {
          flex-grow: 1;
          &:first-child {
            text-align: right;
            border-right: 2px solid #d3b867;
          }
        }
      }
      & > div {
        padding: 0 1rem;
      }

      p {
        color: #b5b5bc;
        font-size: 14px;
        font-weight: 400;
      }
      @media screen and (max-width: 820px) {
        width: 245px;
        text-align: center;
        padding-bottom: 2rem;
        margin: 0 auto;
        margin-top: 3rem;
        & > div {
          &:first-child {
            border-bottom: 2px solid #d3b867;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>