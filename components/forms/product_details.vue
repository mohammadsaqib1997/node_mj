<template lang="pug">
  section.form
    b-field(label="Bank Name" :type="(validation.hasError('bk_name')) ? 'is-danger':''" :message="validation.firstError('bk_name')")
        b-input(type="text" v-model="bk_name" placeholder="Enter Bank Name")

    b-field(label="Account Number" :type="(validation.hasError('acc_number')) ? 'is-danger':''" :message="validation.firstError('acc_number')")
        b-input(type="text" v-model="acc_number" placeholder="Enter Account Number")

    b-field(label="Account Title" :type="(validation.hasError('acc_title')) ? 'is-danger':''" :message="validation.firstError('acc_title')")
        b-input(type="text" v-model="acc_title" placeholder="Enter Account Title")

    b-field(label="IBAN Number" :type="(validation.hasError('iban_num')) ? 'is-danger':''" :message="validation.firstError('iban_num')")
        b-input(type="text" v-model="iban_num" placeholder="Enter IBAN Number")

    b-field(label="Branch Code" :type="(validation.hasError('br_code')) ? 'is-danger':''" :message="validation.firstError('br_code')")
        b-input(type="text" v-model="br_code" placeholder="Enter Branch Code")
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  data() {
    return {
      bk_name: "",
      acc_number: "",
      acc_title: "",
      iban_num: "",
      br_code: ""
    };
  },
  validators: {
    bk_name: function(value) {
      return Validator.value(value)
        .minLength(3)
        .maxLength(50);
    },
    acc_number: function(value) {
      return Validator.value(value)
        .minLength(8)
        .maxLength(30);
    },
    acc_title: function(value) {
      return Validator.value(value)
        .minLength(3)
        .maxLength(35);
    },
    iban_num: function(value) {
      return Validator.value(value)
        .minLength(12)
        .maxLength(35);
    },
    br_code: function(value) {
      return Validator.value(value)
        .minLength(3)
        .maxLength(10);
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


