<template>
  <b-modal class="pincode_verify" :active.sync="modalAct" :canCancel="['x']">
    <div class="box main-box">
      <div class="header">
        <h1>
          <img v-if="type === 0" src="~/assets/img/payment_opt/MeezanBank.png">
          <img v-if="type === 1" src="~/assets/img/payment_opt/jazzCash.png">
          <img v-if="type === 2" src="~/assets/img/payment_opt/easyPaisa.png">
          Account Information
        </h1>
      </div>
      <div class="body">
        <div class="section">
          <p>
            <b>Name:</b> Syed Javaid Hassan
            <br>
            <template v-if="type === 0">
              <b>Bank:</b> Meezan Bank Ltd.
              <br>
              <b>Account Number:</b> 01040100202501
            </template>
            <template v-else>
              <b>Number:</b> 03008232618
            </template>
          </p>
          <br>
          <p>
            <b>Note:</b> After payment, mail us at info@mj-supreme.com or whatsapp us the invoice after logging into your account.
          </p>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal],
  props: {
    type: {
      required: true,
      type: Number
    }
  }
};
</script>

<style lang="scss" scoped>
$primary: #3b3f58;
$txt-color: #d9bd68;
$accent: #8d93ae;
.pincode_verify /deep/ {
  > .modal-content {
    max-width: 460px !important;
    width: 100%;
  }
  .main-box {
    padding: 0;
    overflow: hidden;
    background-color: $primary;

    & > .header {
      padding: 10px 20px;
      border-bottom: 3px solid #dcdcdc;
      position: relative;
      align-items: center;
      margin-bottom: 0;

      h1 {
        margin-bottom: 0;
        margin-right: auto;
        font-family: serif;
        font-size: 24px;
        color: $accent;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        img {
          margin-right: 1rem;
        }
      }

      @media screen and (max-width: 768px) {
        padding: 10px 20px;
      }

      &:after {
        content: " ";
        position: absolute;
        width: 5rem;
        height: 3px;
        background-color: $txt-color;
        left: 0;
        top: 100%;
      }
    }

    .body {
      .section {
        position: relative;
        padding: 2rem;

        p {
          color: $accent;
          &:first-child {
            font-size: 20px;
            color: #d9bd68;
          }
        }
      }
    }
  }

  .section {
    min-height: 200px;
  }
}
</style>