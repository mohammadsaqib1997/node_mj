<template>
  <div class="container">
    <div class="sld-main">
      <div class="columns is-gapless">
        <div class="column is-5 v-center">
          <img class="ribbion" src="~/assets/img/prm_ass_2/ribbon.png">
        </div>
        <div class="column v-center">
          <div class="content-container">
            <p class="content-cont">
              New rates will be
              <span class="hl">9999/=</span>
              <br>which will be effective from
              <span class="bold">20th January 2019.</span>
              <br>Till then avail the
              <span class="hl">SIDC and Insurance card</span>
              <br>on the former price.
            </p>

            <b-field>
              <p class="control">
                <nuxt-link to="/signup" class="button">Apply Now</nuxt-link>
              </p>
            </b-field>
          </div>
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
  height: 100%;
  /deep/ {
    .sld-main {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;

      & > .columns {
        flex-grow: 1;
        width: 100%;
      }

      .v-center {
        display: flex;
        align-items: center;
      }

      .ribbion {
        @media screen and (max-width: 768px) {
          margin: 0 auto;
          max-width: 400px;
          width: 100%;
        }
      }

      .content-container {
        padding: 10px 50px;
        flex-grow: 1;
        width: 100%;
        @media screen and (max-width: 580px) {
          padding: 10px 0;
        }
        .content-cont {
          color: #bdbdc3;
          font-size: 34px;
          font-weight: 400;
          .hl {
            color: #d8bb62;
            white-space: nowrap;
            font-weight: 700;
          }
          .bold {
            white-space: nowrap;
            font-weight: 700;
          }
          @media screen and (max-width: 768px) {
            font-size: 26px;
            text-align: center;
          }
          @media screen and (max-width: 580px) {
            font-size: 20px;
            .hl,
            .bold {
              white-space: pre-wrap;
            }
          }
        }

        .field {
          margin-top: 2rem;
          margin-bottom: 2rem;
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
  }
}
</style>

