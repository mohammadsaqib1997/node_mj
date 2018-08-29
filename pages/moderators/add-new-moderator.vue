<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Add Moderator
      .body
        .section
          form#form.form(v-on:submit.prevent="submit")
            p.error(v-if="form.err !== ''") {{ form.err }}
            p.success(v-if="form.suc !== ''") {{ form.suc }}
            .columns.is-variable.is-1
              .column.is-3
                label Full Name
              .column
                b-field(:type="(validation.hasError('f_data.full_name')) ? 'is-danger':''" :message="validation.firstError('f_data.full_name')")
                  b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="f_data.full_name")
            .columns.is-variable.is-1
              .column.is-3
                label Email
              .column
                b-field(:type="(validation.hasError('f_data.email')) ? 'is-danger':''" :message="validation.firstError('f_data.email')")
                  b-input(type="text" placeholder="user@domain.com" v-model='f_data.email' :loading="validation.isValidating('f_data.email')")
            .columns.is-variable.is-1
              .column.is-3
                label Password
              .column
                b-field(:type="(validation.hasError('f_data.password')) ? 'is-danger':''" :message="validation.firstError('f_data.password')")
                  b-input(type="password" placeholder="******" v-model="f_data.password")
            .columns.is-variable.is-1
              .column.is-3
                label Re-Type Password
              .column
                b-field(:type="(validation.hasError('con_pass')) ? 'is-danger':''" :message="validation.firstError('con_pass')")
                  b-input(type="password" placeholder="******" v-model="con_pass")
            .columns.is-variable.is-1
              .column.is-3
                label CNIC
              .column
                b-field(:type="(validation.hasError('f_data.cnic_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cnic_num')")
                  b-input(type="tel" placeholder="xxxxx-xxxxxxx-x" v-model="f_data.cnic_num" v-mask="'#####-#######-#'")
            .columns.is-variable.is-1
              .column.is-3
                label Contact Number
              .column
                b-field(:type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cont_num')")
                  b-input(type="tel" placeholder="92-xxx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'92-###-###-####'")
            .columns.is-variable.is-1
              .column.is-3
                label Address
              .column
                b-field(:type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
                  b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")
            .columns.is-variable.is-1
              .column.is-3
                label Status
              .column
                b-field.cus-des-1(:type="(validation.hasError('f_data.status')) ? 'is-danger':''" :message="validation.firstError('f_data.status')")
                  b-select(v-model="f_data.status" expanded)
                    option(value="") Active/Suspended
                    option(v-for="sts in sts_list" v-bind:value="sts.code") {{ sts.name }}

            .columns.is-variable.is-1
              .column.is-3
              .column
                button.button.btn-des-1(type="submit")
                  b-icon(icon="plus-circle" style="margin-top: 2px;")
                  | &nbsp;&nbsp;&nbsp;&nbsp;Add Moderator
          b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  data() {
    return {
      sts_list: [{ code: 1, name: "Active" }, { code: 0, name: "Suspended" }],
      con_pass: "",
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
        loading: false,
        submitted: false
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
          if (/[^a-zA-Z ]/.test(value)) {
            return "Invalid character use.";
          }
        });
    },
    "f_data.email": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (
          self.form.submitted ||
          self.validation.isTouched("f_data.email")
        ) {
          let validator = Validator.value(value)
            .required()
            .email()
            .maxLength(100);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              return self.$axios
                .post("/api/web/check_email", {
                  email: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This email is already in use.";
                  }
                });
            });
          }
        }
      }
    },
    "f_data.password": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "con_pass, f_data.password": function(con_pass, password) {
      if (this.form.submitted || this.validation.isTouched("con_pass")) {
        return Validator.value(con_pass)
          .required()
          .match(password);
      }
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
        if (
          self.form.submitted ||
          self.validation.isTouched("f_data.cont_num")
        ) {
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
              return self.$axios
                .post("/api/web/check_cont_num", {
                  cont_num: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This Contact Number is already in use.";
                  }
                });
            });
          }
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
    submit: function() {
      const self = this;
      self.form.submitted = true;
      self.form.loading = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          self.$axios
            .post("/api/moderator/add", {
              email: self.f_data.email,
              password: self.f_data.password,
              full_name: self.f_data.full_name,
              contact_num: self.f_data.cont_num,
              cnic_num: self.f_data.cnic_num,
              address: self.f_data.address,
              active_sts: self.f_data.status
            })
            .then(res => {
              self.reset();
              self.form.loading = false;
              self.form.suc = "Successfully Moderator Added.";
              setTimeout(() => (self.form.suc = ""), 2000);
            })
            .catch(err => {
              console.log(err);
              self.form.loading = false;
              self.form.err = "DB Error!";
            });
        } else {
          self.form.loading = false;
        }
      });
    },
    reset: function() {
      this.con_pass = "";
      this.f_data = {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        cont_num: "",
        address: "",
        status: ""
      };
      $(".main-content").animate({ scrollTop: 20 }, 500);
      setTimeout(() => this.validation.reset(), 100);
    }
  }
};
</script>
