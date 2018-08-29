<template lang="pug">
    .section
        form#form.form(v-on:submit.prevent="update")
            p.error(v-if="form.err !== ''") {{ form.err }}
            p.success(v-if="form.suc !== ''") {{ form.suc }}

            b-field(label="Full Name" :type="(validation.hasError('f_data.full_name')) ? 'is-danger':''" :message="validation.firstError('f_data.full_name')")
                b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="f_data.full_name")

            b-field(label="Email" :type="(validation.hasError('f_data.email')) ? 'is-danger':''" :message="validation.firstError('f_data.email')")
                b-input(type="email" placeholder="user@domain.com" v-model='f_data.email' :loading="validation.isValidating('f_data.email')")

            b-field(label="Change Password" :type="(validation.hasError('f_data.password')) ? 'is-danger':''" :message="validation.firstError('f_data.password')")
                b-input(type="password" password-reveal placeholder="******" v-model="f_data.password")

            b-field(label="CNIC" :type="(validation.hasError('f_data.cnic_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cnic_num')")
                b-input(type="tel" placeholder="xxxxx-xxxxxxx-x" v-model="f_data.cnic_num" v-mask="'#####-#######-#'")

            b-field(label="Contact Number" :type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cont_num')")
                b-input(type="tel" placeholder="92-xxx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'92-###-###-####'")

            b-field(label="Address" :type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
                b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")

            b-field.cus-des-1(label="Status" :type="(validation.hasError('f_data.status')) ? 'is-danger':''" :message="validation.firstError('f_data.status')")
                b-select(v-model="f_data.status" expanded)
                    option(value="") Active/Suspended
                    option(v-for="sts in sts_list" v-bind:value="sts.code") {{ sts.name }}

            .d-flex
                button.button.btn-des-1(type="submit")
                    b-icon(icon="edit" style="margin-top: 2px;")
                    | &nbsp;&nbsp;&nbsp;&nbsp;Edit Moderator
                button.button.btn-des-1(type="button" v-on:click.prevent="$store.commit('edModModal/setModalActive', false)") Cancel

            b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  props: {
    edit_id: {
      type: String,
      default: null
    }
  },
  async mounted() {
    this.form.loading = true;
    const load_data = await this.$axios.$get("/api/moderator/" + this.edit_id);
    this.setFData(load_data.data[0]);
    this.form.loading = false;
  },
  data() {
    return {
      sts_list: [{ code: 1, name: "Active" }, { code: 0, name: "Suspended" }],
      update_id: null,
      v_email: null,
      v_contact_num: null,
      f_data: {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        cont_num: "",
        address: "",
        status: ""
      },
      form: {
        suc: "",
        err: "",
        loading: false
      }
    };
  },
  validators: {
    "f_data.full_name": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(50)
        .custom(() => {
          if (/[^a-zA-Z0-9 ]/.test(value)) {
            return "Invalid character use.";
          }
        });
    },
    "f_data.email": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        let validator = Validator.value(value)
          .required()
          .email()
          .maxLength(100);
        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (value !== self.v_email) {
              return self.$axios
                .post("/api/web/check_email", {
                  email: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This email is already in use.";
                  }
                });
            }
          });
        }
      }
    },
    "f_data.password": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "f_data.cnic_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(/^\d{5}-\d{7}-\d$/, "Invalid NIC Number(e.g 12345-1234567-1)");
    },
    "f_data.cont_num": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        let validator = Validator.value(value)
          .required()
          .regex(
            /^\92-\d{3}-\d{3}-\d{4}$/,
            "Invalid Contact Number(e.g 92-000-000-0000)"
          );
        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (value !== self.v_contact_num) {
              return self.$axios
                .post("/api/web/check_cont_num", {
                  cont_num: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This Contact Number is already in use.";
                  }
                });
            }
          });
        }
      }
    },
    "f_data.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "f_data.status": function(value) {
      return Validator.value(value).required();
    }
  },
  directives: {
    mask
  },
  methods: {
    setFData: function(data) {
      this.update_id = data.id;
      this.v_email = data.email;
      this.v_contact_num = data.contact_num;
      this.f_data = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        cnic_num: data.cnic_num,
        cont_num: data.contact_num,
        address: data.address,
        status: data.active_sts
      };
    },
    update: function() {
      const self = this;
      self.form.loading = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          self.$axios
            .post("/api/moderator/update", {
              update_id: self.update_id,
              data: {
                email: self.f_data.email,
                password: self.f_data.password,
                full_name: self.f_data.full_name,
                contact_num: self.f_data.cont_num,
                cnic_num: self.f_data.cnic_num,
                address: self.f_data.address,
                active_sts: self.f_data.status
              }
            })
            .then(res => {
              self.v_email = self.f_data.email;
              self.v_contact_num = self.f_data.cont_num;
              $("#ed-moderator-con").animate({ scrollTop: 0 }, 500);
              self.form.loading = false;
              self.form.suc = "Successfully Moderator Updated.";
              setTimeout(() => (self.form.suc = ""), 2000);
            })
            .catch(err => {
              $("#ed-moderator-con").animate({ scrollTop: 0 }, 500);
              console.log(err);
              self.form.loading = false;
              self.form.err = "DB Error!";
            });
        } else {
          self.form.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="sass">
.section
    padding: 3rem
    & /deep/
        .form
            .field
                .label
                    font-size: 18px
                    line-height: 18px
                    color: #828282
                .control
                    &>.icon.is-right.is-clickable
                        right: 8px;
                        color: #d9bd68 !important;
            .d-flex
                @media screen and (min-width: 426px)
                    display: flex
                    justify-content: center
                &> .button
                    @media screen and (max-width: 425px)
                        width: 100%

                    &:last-child
                        @media screen and (min-width: 426px)
                            margin-left: 1rem
</style>


