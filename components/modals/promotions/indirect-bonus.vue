
<template>
  <div class="main">
    <div class="flex-container l1">
      <div class="col-ord-1">
        <img src="~/assets/img/indirect_bonus_prm_2/directIndirectBonuses-graphic.png">
      </div>
    </div>

    <div class="flex-container l2">
      <div class="col-ord-1">
        <p class="content-cont">
          <span class="hl bold">For registered members</span>, Create minimum of 4 direct referrals till 31st March 2019 in order to get the indirect bonus accordingly.
          <br>
          <br>
          <span class="hl bold">For registrations after 28 February 2019</span>, create
          minimum 4 direct referrals in order to earn the indirect bonus within first 60 days of your registration.
          <br>
          <br>
          <span class="hl bold">Members who already have 4 direct members can</span>
          enjoy the bonus and rewards and can ignore this
          message.
        </p>
      </div>
    </div>
  </div>
</template>

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
      &:last-child {
        padding-bottom: 3rem;
      }
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
          // text-align: center;
          font-weight: 100;
        }
      }
    }
  }
}
</style>

