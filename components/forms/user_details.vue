<template lang="pug">
  section.form
    b-field(label="Full Name" :type="(validation.hasError('full_name')) ? 'is-danger':''" :message="validation.firstError('full_name')")
        b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="full_name")

    b-field(label="Email" :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')")
        b-input(type="email" placeholder="(example: shabir@gmail.com)" v-model="email")

    b-field(label="Password" :type="(validation.hasError('password')) ? 'is-danger':''" :message="validation.firstError('password')")
        b-input(type="password" placeholder="******" v-model="password")

    b-field(label="CNIC" :type="(validation.hasError('cnic_num')) ? 'is-danger':''" :message="validation.firstError('cnic_num')")
        b-input(type="text" placeholder="xxxxx-xxxxxxx-x" v-model="cnic_num")

    b-field(label="Contact Number" :type="(validation.hasError('cont_num')) ? 'is-danger':''" :message="validation.firstError('cont_num')")
        b-input(type="text" placeholder="92-xxx-xxx-xxxx" v-model="cont_num")

    b-field(label="Address" :type="(validation.hasError('address')) ? 'is-danger':''" :message="validation.firstError('address')")
        b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="address")

    b-field(label="Referral Code" :type="(validation.hasError('ref_code')) ? 'is-danger':''" :message="validation.firstError('ref_code')")
        b-input(type="text" placeholder="Enter member ID" v-model="ref_code")
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  data() {
    return {
      full_name: "",
      email: "",
      password: "",
      cnic_num: "",
      cont_num: "",
      address: "",
      ref_code: "",
    };
  },
  validators: {
    full_name: function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(50);
    },
    email: function(value) {
      return Validator.value(value)
        .required()
        .email()
        .maxLength(100);
    },
    password: function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    cnic_num: function(value) {
      return Validator.value(value)
        .required()
        .regex(/^\d{5}-\d{7}-\d$/, "Invalid NIC Number(e.g 12345-1234567-1)")
    },
    cont_num: function(value) {
      return Validator.value(value)
        .required()
        .regex(/^\92-\d{3}-\d{3}-\d{4}$/, "Invalid Contact Number(e.g 92-000-000-0000)")
    },
    address: function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100)
    },
    ref_code: function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .length(9)
    },
  },
  methods: {
      validate: function() {
        return this.$validate()
          .then(function(success) {
            if (success) {
              return "Success"
            }
          }.bind(this));
      }
  }
};
</script>

