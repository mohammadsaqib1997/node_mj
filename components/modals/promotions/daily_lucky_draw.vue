
<template>
  <div class="main">
    <div class="flex-container l1">
      <div class="col-ord-1">
        <img src="~/assets/img/lucky_draw_prm_1/dailyLuckyDraw.png">
      </div>
    </div>

    <div class="flex-container l2">
      <div class="col-ord-1">
        <p class="content-cont">
          Purchase SIDC card or SIDC + Insurance card and get a chance
          to win
          <span
            class="hl bold"
          >DAILY</span> cash prizes.
          <span class="hl bold">Lucky draw</span> will be daily in between
          every
          <span class="hl bold">5 registrations</span>. There will be separate lucky draws
          for both products.
        </p>
      </div>
    </div>

    <div class="flex-container l3">
      <div class="col-ord-1">
        <p class="content-cont">
          <span class="bold">
            For further information mail us at:
            <span class="hl">info@mj-supreme.com</span>
            <br>
            <a href="#" @click.prevent="md_act=true">
              <span class="hl">*</span> Terms & conditions apply.
            </a>
          </span>
        </p>
      </div>
    </div>

    <mdLDTermCond :md_act="md_act" @closed="md_act=false"></mdLDTermCond>
  </div>
</template>

<script>
import mdLDTermCond from "~/components/modals/prm-term-cond/luckydraw-term-cond.vue";
export default {
  components: {
    mdLDTermCond
  },
  data() {
    return {
      md_act: false
    };
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  background-color: #3b3f57;
  /deep/ {
    &:before {
      content: "";
      position: absolute;
      background-image: url("/img/prm-ass-3/bg-pattern-popup.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .content-cont {
      color: #ffffff;
      font-size: 16px;
      text-align: left;
      font-weight: 400;
      .hl {
        color: #d8bb62;
        font-weight: 700;
        white-space: nowrap;
      }
      .bold {
        font-weight: 700;
      }
    }

    .flex-container {
      display: flex;
      justify-content: center;
      position: relative;
      @media screen and (max-width: 768px) {
        flex-wrap: wrap;
      }
      .col-ord-1 {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        text-align: center;
        padding: 0px 10px;

        img {
          display: block;
          margin: 0 auto;
        }
      }
      &.l1 {
        .col-ord-1 {
          padding: 20px;
          width: 100%;
          flex-grow: 0;
          flex-basis: auto;
          flex-shrink: 0;
          @media screen and (min-width: 769px) {
            padding: 30px 70px 20px;
          }
        }
      }
      &.l2 {
        > .col-ord-1 {
          @media screen and (min-width: 769px) {
            padding: 0 50px;
          }
        }
        .content-cont {
          font-size: 24px;
          text-align: center;
          font-weight: 100;
        }
      }

      &.l3 {
        padding: 45px 0 35px;
        > .col-ord-1 {
          @media screen and (min-width: 769px) {
            padding: 0 50px;
          }
        }
        .content-cont {
          text-align: center;
          a {
            color: inherit;
          }
          .bold {
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>

