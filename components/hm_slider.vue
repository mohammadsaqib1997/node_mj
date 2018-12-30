<template>
  <div class="section">
    <div id="slider-hm" class="slider-cont">
      <div class="item sld-2" v-if="diff_sec_check > 0">
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
      </div>

      <div class="item sld-1">
        <div class="container">
          <div class="columns is-gapless">
            <div class="column is-5-desktop">
              <h1 class="title-1 lt">Discount Card</h1>
              <p
                class="cnt"
              >A marketing product in which we provide discounts in different outlets along with complete solution of house hold to the people of Pakistan.</p>
              <nuxt-link class="button btn" to="/about-us">More Info</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    jQuery(function() {
      $("#slider-hm").slick({
        prevArrow: `<button type="button" class="slick-prev-cus"></button>`,
        nextArrow: `<button type="button" class="slick-next-cus"></button>`,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnFocus: false
      });
    });
  },
  computed: {
    diff_sec_check: function() {
      return this.$store.state["timer-counter"]["diffInSec"];
    }
  },
  watch: {
    diff_sec_check: function(val) {
      const self = this;
      if (val < 2) {
        self.$store.commit("pageLoadingSet", true);
        setTimeout(function() {
          self.$store.commit("pageLoadingSet", false);
        }, 1500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.section {
  padding: 0;

  /deep/ {
    p.cnt {
      color: #c5c5c7;
      padding: 3rem 5rem 3rem 0;
      font-size: 18px;
      @media screen and (max-width: 425px) {
        font-size: 14px;
        padding: 1rem 0;
      }
    }

    .button.btn {
      background-color: transparent;
      border: 1px solid #d9bd68;
      color: #d9bd68;
      padding: 8px 2rem;
      height: auto;
      @media screen and (max-width: 425px) {
        padding: 5px 12px;
        font-size: 15px;
      }
    }

    .slider-cont {
      .slick-arrow {
        width: 25px;
        height: 70px;
        cursor: pointer;
        position: absolute;
        top: 40%;
        z-index: 9;
        border: none;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        padding: 0;

        &:focus {
          outline: none;
        }

        &.slick-prev-cus {
          left: 2rem;
          background-image: url(/img/sld-prev-btn.png);
        }
        &.slick-next-cus {
          right: 2rem;
          background-image: url(/img/sld-next-btn.png);
        }

        @media screen and (max-width: 425px) {
          height: 35px;
          top: 45%;
          &.slick-prev-cus {
            left: 1rem;
          }
          &.slick-next-cus {
            right: 1rem;
          }
        }
      }

      .sld-1 {
        background-image: url("/img/hm-img-1.jpg");
        padding: 3rem 0 5rem;
        @media screen and (max-width: 1087px) {
          padding: 3rem 5rem;
        }
      }

      .sld-2 {
        position: relative;
        overflow: hidden;
        background-image: url("/img/banner-bg.png");
        @media screen and (max-width: 1087px) {
          padding: 1rem 5rem;
        }
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
        @media screen and (max-width: 425px) {
          height: 700px;
        }
        @media screen and (min-width: 426px) and (max-width: 768px) {
          height: 700px !important;
        }
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          height: 600px !important;
        }
        @media screen and (min-width: 1025px) and (max-width: 1526px) {
          height: 550px !important;
        }
      }

      .item {
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        &:focus {
          outline: none;
        }
        @media screen and (min-width: 1280px) {
          height: 445px;
        }
      }
    }
  }
}
</style>


