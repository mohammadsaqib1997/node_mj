<template>
  <div class="main-cont">
    <div class="m-l">
      <div class="columns is-variable is-5 l1">
        <div class="column">
          <img class="img1" src="~/assets/img/prm_ass_3/digram.png">
        </div>
        <div class="column">
          <img src="~/assets/img/prm_ass_3/ribbon2.png">
        </div>
        <div class="column">
          <p class="content-cont w1">
            Complete
            <span class="hl bold">
              150 direct or
              indirect
            </span> team members
            to
            <span class="bold">win!</span>
          </p>
          <div class="columns is-gapless l1-l2">
            <div class="column is-12">
              <div class="l1-l2-l1">
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
            <div class="column l-btn">
              <b-field>
                <p class="control">
                  <nuxt-link to="/signup" class="button">Apply Now</nuxt-link>
                </p>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <div class="columns l2">
        <div class="column">
          <p class="content-cont">
            <span class="bold">
              <a href="#" @click.prevent="$emit('popup_open', true)">
                <span class="hl">*</span> Terms & conditions apply.
              </a>
            </span>
          </p>
        </div>
        <div class="column">
          <p class="content-cont">
            <span class="bold">
              For further information mail us at:
              <span class="hl">info@mj-supreme.com</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main-cont {
  height: 100%;
  /deep/ {
    .content-cont {
      color: #ffffff;
      font-size: 16px;
      text-align: left;
      font-weight: 400;
      a {
        color: inherit;
      }
      .hl {
        color: #d8bb62;
        font-weight: 700;
      }
      .bold {
        font-weight: 700;
      }
    }
    .m-l {
      width: 100%;
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      .l1 {
        align-items: center;
        margin-top: 0;
        @media screen and (max-width: 900px) {
          flex-wrap: wrap;
          display: flex;
          > :nth-child(1) {
            order: 3;
            img {
              margin: 0 auto;
              width: 300px;
              min-width: 178px;
              @media screen and (min-width: 701px) {
                min-width: 300px;
              }
            }
          }
          > :nth-child(2) {
            order: 1;
            flex-basis: auto;
            width: 100%;
            img {
              margin: 0 auto;
            }
          }
          > :nth-child(3) {
            order: 2;
          }
        }
        .img1 {
          padding: 10px;
        }
        .content-cont {
          font-size: 26px;
          @media screen and (max-width: 700px) {
            margin: 0 auto;
            text-align: center;
          }
          &.w1 {
            max-width: 280px;
          }
        }
        .l1-l2-l1 {
          margin-top: 30px;
          table {
            @media screen and (max-width: 700px) {
              margin: 0 auto;
            }
            td {
              vertical-align: middle;
              color: #ffffff;
              font-weight: 600;
              font-size: 26px;
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
        .l1-l2 {
          align-items: flex-end;
          @media screen and (max-width: 1471px) {
            flex-wrap: wrap;
          }
        }
        .l-btn {
          @media screen and (min-width: 1472px) {
            margin-left: -85px;
          }
          @media screen and (max-width: 1471px) {
            margin-top: 2rem;
          }

          .field {
            .control {
              @media screen and (max-width: 768px) {
                text-align: center;
              }
              .button {
                background-color: transparent;
                color: #d8bb62;
                text-transform: uppercase;
                font-weight: 700;
                font-size: 20px;
                padding: 10px 40px;
                height: auto;
                border: 2px solid #d8bb62;
                box-shadow: -2px -2px 30px 0 #0000005c;
                transition: 200ms ease;
                &:focus {
                  box-shadow: 2px 2px 30px 0 #d8bb622e;
                }
                @media screen and (max-width: 580px) {
                  font-size: 15px;
                  padding: 5px 10px;
                }
              }
            }
          }
        }
      }

      .l2 {
        margin-top: 0;
        .content-cont {
          text-align: center;
        }
      }
    }
  }
}
</style>

