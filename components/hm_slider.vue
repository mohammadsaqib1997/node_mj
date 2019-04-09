<template>
  <div class="section">
    <div id="slider-hm" class="slider-cont">
      <!-- <div class="item sld-2">
        <slideComp @popup_open="md_act=$event"></slideComp>
      </div> -->

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

    <mdPromTermCond :md_act="md_act" @closed="md_act=false"></mdPromTermCond>
  </div>
</template>

<script>
import mdPromTermCond from "~/components/modals/prm-term-cond/term-cond.vue";
import slideComp from "~/components/slides/mega_prm_20jan_31mar.vue";
export default {
  components: {
    slideComp,
    mdPromTermCond
  },
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
  data() {
    return {
      md_act: false
    };
  }
  // watch: {
  //   diff_sec_check: function(val) {
  //     const self = this;
  //     if (val < 2) {
  //       self.$store.commit("pageLoadingSet", true);
  //       setTimeout(function() {
  //         self.$store.commit("pageLoadingSet", false);
  //       }, 1500);
  //     }
  //   }
  // }
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
        background-image: url("/img/prm-ass-3/bg-pattern-banner.png");
        overflow: hidden;
        @media screen and (max-width: 1087px) {
          padding: 1rem 5rem;
        }

        @media screen and (min-width: 1055px) {
          height: 445px;
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


