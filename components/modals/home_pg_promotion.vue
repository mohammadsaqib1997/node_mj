<template>
  <b-modal class="promotion" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Mega Promotion</h1>
      </div>
      <div class="body">
        <div class="section">
          <div class="d-flex">
            <button
              class="button btn-des-1 dark"
              type="button"
              @click.prevent="modalAct=false;"
            >Close</button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal],
  data() {
    return {
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.promotion /deep/ {
  .d-flex {
    @media screen and (min-width: 426px) {
      display: flex;
      justify-content: flex-end;
    }

    & > .button {
      margin-top: 0;
      @media screen and (max-width: 425px) {
        width: 100%;
      }

      &:last-child {
        @media screen and (min-width: 426px) {
          margin-left: 1rem;
        }
      }
    }
  }

  & > .section {
    min-height: 200px;
  }
  .section {
    .btns-cont {
      justify-content: center;

      & > .btn-des-1:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}
</style>