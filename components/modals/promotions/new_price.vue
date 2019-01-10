<template>
  <div class="main">
    <div class="flex-container">
      <div class="col-ord-1">
        <img src="~/assets/img/prm_ass_2/ribbon.png">
      </div>
    </div>

    <div class="full-container">
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
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  background-color: #3b3f57;

  /deep/ {
    &:before {
      content: "";
      position: absolute;
      background-image: url("/img/prm-ass-2/popup-bg.jpg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .content-cont {
      color: #bdbdc3;
      font-size: 16px;
      text-align: center;
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
        padding: 0 10px;

        &.col-ord-1 {
          img {
            display: block;
            margin: 0 auto;
          }
        }
      }
    }

    .full-container {
      position: relative;
      padding-bottom: 1rem;
      .content-cont {
        padding: 15px;
        font-size: 24px;
        font-weight: 400;
        max-width: 530px;
        margin: 0 auto;
      }

      .field {
        margin-top: 2rem;
        margin-bottom: 2rem;
        .control {
          text-align: center;
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
          }
        }
      }
    }
  }
}
</style>

