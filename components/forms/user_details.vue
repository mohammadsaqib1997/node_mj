<template lang="pug">
  section.form
    b-field(label="Full Name" :type="(validation.hasError('form.full_name')) ? 'is-danger':''" :message="validation.firstError('form.full_name')")
        b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="form.full_name")

    b-field(label="Email" :type="(validation.hasError('form.email')) ? 'is-danger':''" :message="validation.firstError('form.email')")
        b-input(type="email" placeholder="(example: shabir@gmail.com)" v-model="form.email")

    b-field(label="Password" :type="(validation.hasError('form.password')) ? 'is-danger':''" :message="validation.firstError('form.password')")
        b-input(type="password" placeholder="******" v-model="form.password")

    b-field(label="CNIC" :type="(validation.hasError('form.cnic_num')) ? 'is-danger':''" :message="validation.firstError('form.cnic_num')")
        b-input(type="text" placeholder="xxxxx-xxxxxxx-x" v-model="form.cnic_num" v-mask="'#####-#######-#'")

    b-field(label="Contact Number" :type="(validation.hasError('form.cont_num')) ? 'is-danger':''" :message="validation.firstError('form.cont_num')")
        b-input(type="text" placeholder="92-xxx-xxx-xxxx" v-model="form.cont_num" v-mask="'92-###-###-####'")

    b-field(label="Address" :type="(validation.hasError('form.address')) ? 'is-danger':''" :message="validation.firstError('form.address')")
        b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="form.address")

    b-field(label="Referral Code" :type="(validation.hasError('form.ref_code')) ? 'is-danger':''" :message="validation.firstError('form.ref_code')")
        b-input(type="text" placeholder="Enter member ID" v-model="form.ref_code")
</template>

<script>
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  directives: {
    mask
  },
  data() {
    return {
      form: {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        cont_num: "",
        address: "",
        ref_code: ""
      }
    };
  },
  validators: {
    "form.full_name": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(50);
    },
    "form.email": {
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
    },
    "form.password": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "form.cnic_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(/^\d{5}-\d{7}-\d$/, "Invalid NIC Number(e.g 12345-1234567-1)");
    },
    "form.cont_num": {
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
    },
    "form.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "form.ref_code": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        let validator = Validator.value(value)
          .digit()
          .length(9);
        if (validator.hasImmediateError()) {
          return validator;
        } else {
          if (!Validator.isEmpty(value)) {
            return validator.custom(() => {
              return self.$axios
                .post("/api/web/check_ref_id", {
                  id: value
                })
                .then(res => {
                  if (res.data.count < 1) {
                    return "Invalid referral id.";
                  }
                });
            });
          } else {
            return validator;
          }
        }
      }
    }
  },
  methods: {
    validate: function() {
      return this.$validate().then(
        function(success) {
          if (success) {
            return "Success";
          }
        }.bind(this)
      );
    }
  }
};
</script>

