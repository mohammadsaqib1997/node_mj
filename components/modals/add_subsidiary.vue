<template>
  <b-modal class="add_subsidiary" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Subsidiary</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent>
            <p v-if="err !== ''" class="error">{{ err }}</p>

            <label>Add Subsidiary</label>
            <b-field grouped>
              <b-field
                class="cus-des-1"
                :type="(validation.hasError('f_data.sel_control')) ? 'is-danger':''"
                :message="validation.firstError('f_data.sel_control')"
                expanded
              >
                <b-select
                  placeholder="Select Controller"
                  @input="f_data.sel_control=$event"
                  expanded
                >
                  <option value="1">Controller 1</option>
                  <option value="2">Controller 2</option>
                </b-select>
              </b-field>

              <b-field
                :type="(validation.hasError('f_data.subs_name')) ? 'is-danger':''"
                :message="validation.firstError('f_data.subs_name')"
                expanded
              >
                <b-input
                  type="text"
                  placeholder="Subsidiary Name"
                  v-model="f_data.subs_name"
                  autocomplete="off"
                ></b-input>
              </b-field>

              <b-field>
                <p class="control">
                  <button class="button btn-des-1" type="submit">Add</button>
                </p>
              </b-field>
            </b-field>
          </form>
          <hr>
          
          <div class="d-flex">
            <button
              class="button btn-des-1 dark"
              type="button"
              @click.prevent="modalAct=false;"
            >Close</button>
          </div>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal],
  watch: {
    modalAct: function(val) {
      if (val === false) {
        this.resetData();
      }
    }
  },
  data() {
    return {
      modalAct: true,
      loading: false,
      submitted: false,
      err: "",
      f_data: {
        sel_control: "",
        subs_name: ""
      }
    };
  },
  validators: {
    // "f_data.old_pin": function(value) {
    //   if (this.is_pin === true) {
    //     return Validator.value(value)
    //       .required()
    //       .digit()
    //       .length(6, "Enter 6 digit old pin code!");
    //   }
    // },
    // "f_data.pin": function(value) {
    //   const self = this;
    //   return Validator.value(value)
    //     .required()
    //     .digit()
    //     .length(6, "Enter 6 digit pin code!")
    //     .custom(function() {
    //       if (value === self.f_data.old_pin) {
    //         return "Enter new pin code!";
    //       }
    //     });
    // },
    // "f_data.re_pin, f_data.pin": function(repeat, pin) {
    //   if (this.is_pin === false) {
    //     if (this.submitted || this.validation.isTouched("f_data.re_pin")) {
    //       return Validator.value(repeat)
    //         .required()
    //         .match(pin);
    //     }
    //   }
    // },
    // "f_data.cur_pass": function(value) {
    //   return Validator.value(value)
    //     .required()
    //     .minLength(6)
    //     .maxLength(35);
    // }
  },
  methods: {
    async loadData() {
      const self = this;
      // self.loading = true;
      // await self.$store.dispatch("pincode/loadPin");
      // self.loading = false;
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
.add_subsidiary /deep/ {
  .form {
    > label {
      font-weight: 300;
      line-height: normal;
      font-size: 18px;
      display: block;
      margin-bottom: 0.5rem;
    }
  }

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