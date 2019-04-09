<template>
  <div class="main">
    <div class="flex-container l1">
      <div class="col-ord-1">
        <img src="~/assets/img/prm_ass_3/ribbon.png">
      </div>
    </div>

    <div class="flex-container l2">
      <div class="col-ord-1">
        <div class="columns is-gapless">
          <div class="column is-narrow">
            <p class="content-cont w1">
              Complete
              <span class="hl bold">
                150 direct or
                indirect
              </span> team members
              to
              <span class="bold">win!</span>
            </p>
            <div class="l2-l1">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <img src="~/assets/img/prm_ass_3/ummra-icon.png">
                    </td>
                    <td>Umra Package</td>
                  </tr>
                  <tr>
                    <td colspan="2" class="or">OR</td>
                  </tr>
                  <tr>
                    <td>
                      <img src="~/assets/img/prm_ass_3/cash-icon.png">
                    </td>
                    <td>100,000 Cash</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="column"></div>
          <div class="column is-6 img1">
            <img src="~/assets/img/prm_ass_3/digram.png">
          </div>
        </div>
      </div>
    </div>

    <div class="flex-container l3">
      <div class="col-ord-1">
        <p class="content-cont">
          <span class="bold">
            <a href="#" @click.prevent="md_act=true">
              <span class="hl">*</span> Terms & conditions apply.
            </a>
            <br>For further information mail us at:
            <span class="hl">info@mj-supreme.com</span>
          </span>
        </p>
      </div>
    </div>

    <mdPromTermCond :md_act="md_act" @closed="md_act=false"></mdPromTermCond>
  </div>
</template>

<script>
import mdPromTermCond from "~/components/modals/prm-term-cond/term-cond.vue";
export default {
  components: {
    mdPromTermCond
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
  /deep/ {
    .content-cont {
      color: #ffffff;
      font-size: 16px;
      text-align: left;
      font-weight: 400;
      .hl {
        color: #d8bb62;
        font-weight: 700;
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
        @media screen and (min-width: 769px) {
          justify-content: flex-start;
        }
        .col-ord-1 {
          max-width: 500px;
          width: 100%;
          flex-grow: 0;
          flex-basis: auto;
          flex-shrink: 0;
          @media screen and (min-width: 769px) {
            padding: 0px 0 0 50px;
          }
        }
      }
      &.l2 {
        margin-top: 45px;
        @media screen and (max-width: 768px) {
          margin-top: 25px;
        }
        > .col-ord-1 {
          @media screen and (min-width: 769px) {
            padding: 0 50px;
          }
        }

        .content-cont {
          font-size: 24px;
          @media screen and (max-width: 768px) {
            margin: 0 auto;
            text-align: center;
          }
          &.w1 {
            max-width: 260px;
          }
        }

        .img1 {
          @media screen and (min-width: 769px) {
            margin-top: -85px;
          }
          @media screen and (max-width: 768px) {
            margin-top: 3rem;
          }
        }

        .l2-l1 {
          margin-top: 30px;
          @media screen and (max-width: 768px) {
            margin: 30px auto 0;
          }
          table {
            td {
              vertical-align: middle;
              color: #ffffff;
              font-weight: 600;
              font-size: 20px;
              &:nth-child(2) {
                padding-left: 20px;
              }
              &.or {
                position: relative;
                text-align: center;
                &::before,
                &::after {
                  content: "";
                  position: absolute;
                  height: 2px;
                  background-color: #494d6c;
                  top: 50%;
                }
                &::before {
                  left: 0;
                  right: 70%;
                }
                &::after {
                  left: 70%;
                  right: 0;
                }
              }
              img {
                width: 40px;
              }
            }
          }
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

