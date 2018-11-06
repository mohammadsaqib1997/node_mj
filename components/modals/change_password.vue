<template>
  <b-modal class="change_password" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Change Password</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="update()">
            <p v-if="err !== ''" class="error">{{ err }}</p>
            <b-field label="Current Password" :type="(validation.hasError('f_data.cur_pass')) ? 'is-danger':''"
              :message="validation.firstError('f_data.cur_pass')">
              <b-input type="password" placeholder="Current password." v-model="f_data.cur_pass"
                autocomplete="off"></b-input>
            </b-field>

            <b-field label="New Password" :type="(validation.hasError('f_data.pass')) ? 'is-danger':''" :message="validation.firstError('f_data.pass')">
              <b-input type="password" placeholder="Enter new password." v-model="f_data.pass"
                autocomplete="off"></b-input>
            </b-field>

            <b-field label="Re-type Password" :type="(validation.hasError('f_data.re_pass')) ? 'is-danger':''"
              :message="validation.firstError('f_data.re_pass')">
              <b-input type="password" placeholder="Re-type password." v-model="f_data.re_pass"
                autocomplete="off"></b-input>
            </b-field>

            <div class="d-flex">
              <button class="button btn-des-1" type="submit">
                <b-icon icon="shield-alt"></b-icon>
                &nbsp;&nbsp;&nbsp;&nbsp;Update
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
    <pinVerMD :md_act="pin_ver_md_act" @closed="pin_ver_md_act=false" @verified="secure=true;update()"></pinVerMD>
  </b-modal>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import { mask } from "vue-the-mask";
import mxn_modal from "~/mixins/modal.js";
import pinVerMD from "~/components/modals/pincode-verify.vue";
export default {
  mixins: [mxn_modal],
  components: {
    pinVerMD
  },
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
  async mounted() {
    this.loading = true;
    await this.$store.dispatch("pincode/loadPin");
    this.loading = false;
  },
  computed: {
    is_pin_active: function() {
      return this.$store.state.pincode.is_pin_active;
    },
    is_last_pin: function() {
      return this.$store.state.pincode.is_last_pin;
    }
  },
  data() {
    return {
      loading: false,
      submitted: false,
      pin_ver_md_act: false,
      secure: false,
      err: "",
      f_data: {
        pass: "",
        re_pass: "",
        cur_pass: ""
      }
    };
  },
  validators: {
    "f_data.cur_pass": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "f_data.pass": function(value) {
      const self = this;
      return Validator.value(value)
        .required()
        .required()
        .minLength(6)
        .maxLength(35)
        .custom(function() {
          if (value === self.f_data.cur_pass) {
            return "Enter new password!";
          }
        });
    },
    "f_data.re_pass, f_data.pass": function(repeat, new_pass) {
      if (this.submitted || this.validation.isTouched("f_data.re_pass")) {
        return Validator.value(repeat)
          .required()
          .match(new_pass);
      }
    }
  },
  methods: {
    update() {
      const self = this;
      self.err = "";
      self.submitted = true;
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;

          if (
            self.secure !== true &&
            (self.is_pin_active === true || self.is_last_pin === true)
          ) {
            self.loading = false;
            self.pin_ver_md_act = true;
            return;
          }
          let params = {
            cur_pass: self.f_data.cur_pass,
            pass: self.f_data.pass
          };

          if (self.secure === true) {
            params["secure"] = true;
          }

          await self.$axios
            .post("/api/profile/update_password", params)
            .then(async res => {
              if (res.data.status === true) {
                self.resetData();
                self.modalAct = false;
                self.$toast.open({
                  duration: 3000,
                  message: "Successfully Change Your Password!",
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
      this.err = "";
      this.secure = false;
      this.submitted = false;
      this.f_data = {
        pass: "",
        re_pass: "",
        cur_pass: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.change_password /deep/ {
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