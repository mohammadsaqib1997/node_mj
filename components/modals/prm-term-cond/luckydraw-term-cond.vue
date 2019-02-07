<template>
  <b-modal class="md-main" :active.sync="modalAct" :canCancel="['x']">
    <div class="box main-box">
      <div class="header">
        <h1>Terms & Conditions</h1>
      </div>
      <div class="body">
        <div class="section">
          <div class="p-cont">
            <ol>
              <li>Lucky draw will be held after the day ends. After completion next lucky draw will be held accordingly.</li>
              <li>There will be multiple lucky draws for every 5 members against the products.</li>
              <li>Lucky draw is automatic computer generated winners that will be updated automatically every day.</li>
              <li>Every person with cash membership is automatically entered in the system.</li>
              <li>Update your profile and bank details completely with your email approval.</li>
              <li>Payments will be made on your bank details within 7 days of the announcement of winners.</li>
              <li>MJ Supreme reserves the right to change these terms and conditions whenever required.</li>
            </ol>
          </div>
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
$primary: #3b3f58;
$txt-color: #d9bd68;
$accent: #8d93ae;
.md-main /deep/ {
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

        .p-cont {
          font-size: 18px;
          color: #b9bcca;
          padding: 0 15px;
          text-align: justify;
          li {
            margin-bottom: 0.5rem;
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