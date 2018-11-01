<template>
  <b-modal class="add_pincode" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>{{ is_pin === true ? 'Change':'Add' }} PinCode</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="is_pin === false ? addPin():updatePin()">
            <p v-if="err !== ''" class="error">{{ err }}</p>
            <b-field v-if="is_pin === true" label="Old Pin Code" :type="(validation.hasError('f_data.old_pin')) ? 'is-danger':''"
              :message="validation.firstError('f_data.old_pin')">
              <b-input type="password" placeholder="Old pin code." v-model="f_data.old_pin" v-mask="'######'"
                autocomplete="off"></b-input>
            </b-field>

            <b-field label="New Pin Code" :type="(validation.hasError('f_data.pin')) ? 'is-danger':''" :message="validation.firstError('f_data.pin')">
              <b-input type="password" placeholder="Enter 6 digits pin code." v-model="f_data.pin" v-mask="'######'"
                autocomplete="off"></b-input>
            </b-field>

            <b-field v-if="is_pin === false" label="Re-type Pin Code" :type="(validation.hasError('f_data.re_pin')) ? 'is-danger':''"
              :message="validation.firstError('f_data.re_pin')">
              <b-input type="password" placeholder="Re-type pin code." v-model="f_data.re_pin" v-mask="'######'"
                autocomplete="off"></b-input>
            </b-field>

            <b-field label="Current Password" :type="(validation.hasError('f_data.cur_pass')) ? 'is-danger':''"
              :message="validation.firstError('f_data.cur_pass')">
              <b-input type="password" placeholder="Enter current password." v-model="f_data.cur_pass" autocomplete="off"></b-input>
            </b-field>

            <div class="d-flex">
              <button class="button btn-des-1" type="submit">
                <b-icon icon="shield-alt"></b-icon>
                &nbsp;&nbsp;&nbsp;&nbsp;{{ is_pin === true ? 'Update':'Save' }}
              </button>
              <button class="button btn-des-1 dark" type="button" @click.prevent="modalAct=false;">
                Close
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
  computed: {
    is_pin: function() {
      return this.$store.state.pincode.is_pincode;
    }
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
      submitted: false,
      err: "",
      f_data: {
        pin: "",
        re_pin: "",
        cur_pass: "",
        old_pin: ""
      }
    };
  },
  validators: {
    "f_data.old_pin": function(value) {
      if (this.is_pin === true) {
        return Validator.value(value)
          .required()
          .digit()
          .length(6, "Enter 6 digit old pin code!");
      }
    },
    "f_data.pin": function(value) {
      const self = this;
      return Validator.value(value)
        .required()
        .digit()
        .length(6, "Enter 6 digit pin code!")
        .custom(function() {
          if (value === self.f_data.old_pin) {
            return "Enter new pin code!";
          }
        });
    },
    "f_data.re_pin, f_data.pin": function(repeat, pin) {
      if (this.is_pin === false) {
        if (this.submitted || this.validation.isTouched("f_data.re_pin")) {
          return Validator.value(repeat)
            .required()
            .match(pin);
        }
      }
    },
    "f_data.cur_pass": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$store.dispatch("pincode/loadPin");
      self.loading = false;
    },
    addPin() {
      const self = this;
      self.err = "";
      self.submitted = true;
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/profile/add_pincode", {
              pin: self.f_data.pin,
              password: self.f_data.cur_pass
            })
            .then(async res => {
              if (res.data.status === true) {
                await self.$store.dispatch("pincode/loadPin");
                self.resetData();
                self.modalAct = false;
                self.$toast.open({
                  duration: 3000,
                  message: "Successfully Add Your Pin Code!",
                  position: "is-bottom",
                  type: "is-success"
                });
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
    updatePin() {
      const self = this;
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/profile/update_pincode", {
              old_pin: self.f_data.old_pin,
              pin: self.f_data.pin,
              password: self.f_data.cur_pass
            })
            .then(async res => {
              if (res.data.status === true) {
                await self.$store.dispatch("pincode/loadPin");
                self.resetData();
                self.modalAct = false;
                self.$toast.open({
                  duration: 3000,
                  message: "Successfully Change Your Pin Code!",
                  position: "is-bottom",
                  type: "is-success"
                });
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
      this.submitted = false;
      this.f_data = {
        pin: "",
        re_pin: "",
        cur_pass: "",
        old_pin: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.add_pincode /deep/ {
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