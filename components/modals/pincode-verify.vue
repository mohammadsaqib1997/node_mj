<template>
  <b-modal class="pincode_verify" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Verification PinCode</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="verify()">
            <p v-if="err !== ''" class="error">{{ err }}</p>
            <b-field label="Enter Pin Code" :type="(validation.hasError('f_data.pin')) ? 'is-danger':''"
              :message="validation.firstError('f_data.pin')">
              <b-input type="password" placeholder="Pin Code" v-model="f_data.pin" v-mask="'######'"
                autocomplete="off"></b-input>
            </b-field>

            <div class="d-flex">
              <button class="button btn-des-1" type="submit">
                <b-icon icon="shield-alt"></b-icon>
                &nbsp;&nbsp;&nbsp;&nbsp;Verify
              </button>
              <button class="button btn-des-1 dark" type="button" @click.prevent="modalAct=false;">
                Cancel
              </button>
            </div>
          </form>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import { mask } from "vue-the-mask";
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal],
  directives: {
    mask
  },
  watch: {
    modalAct: function(val) {
      if (val === false) {
        this.resetData();
      }
    }
  },
  data() {
    return {
      loading: false,
      err: "",
      f_data: {
        pin: ""
      }
    };
  },
  validators: {
    "f_data.pin": function(value) {
      const self = this;
      return Validator.value(value)
        .required()
        .digit()
        .length(6, "Enter 6 digit pin code!");
    }
  },
  methods: {
    verify() {
      const self = this;
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/profile/verify_pin", {
              pin: self.f_data.pin
            })
            .then(async res => {
              if (res.data.status === true) {
                self.modalAct = false;
                self.$emit("verified", true);
              } else {
                self.err = res.data.message;
              }
            })
            .catch(err => {
              console.log(err);
              self.err = "Server Error!";
            });
          self.loading = false;
        }
      });
    },
    resetData() {
      this.err = "";
      this.f_data = {
        pin: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.pincode_verify /deep/ {
  > .modal-content {
    width: 460px;
  }
  .form {
    label {
      font-weight: 300;
      line-height: normal;
      font-size: 18px;
    }
  }

  .d-flex {
    @media screen and (min-width: 426px) {
      display: flex;
      justify-content: center;
    }

    & > .button {
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

  .section {
    min-height: 200px;

    .btns-cont {
      justify-content: center;

      & > .btn-des-1:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}
</style>