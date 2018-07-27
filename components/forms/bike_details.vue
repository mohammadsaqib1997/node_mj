<template lang="pug">
  section#bikeFormCon.form
    h1 Product Details
    .block
      b-radio(v-model="sel_type" native-value="individual") Individual
      b-radio(v-model="sel_type" native-value="reseller") Reseller
      p.help.is-danger(v-if="validation.hasError('sel_type')") {{ validation.firstError('sel_type') }}
    b-field(label="Quantity Of Bikes" v-if="sel_type === 'reseller'" :type="(validation.hasError('num_of_bikes')) ? 'is-danger':''" :message="validation.firstError('num_of_bikes')")
        b-input(type="text" placeholder="Enter Quantity Of Bikes" v-model="num_of_bikes")
    .block.mt-2
      b-radio(v-model="pur_type" native-value="on_cash") On Cash
      b-radio(v-model="pur_type" native-value="on_installment") On Installment
      p.help.is-danger(v-if="validation.hasError('pur_type')") {{ validation.firstError('pur_type') }}
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  data() {
    return {
      sel_type: "individual",
      pur_type: "on_cash",
      num_of_bikes: 5
    };
  },
  validators: {
    sel_type: function(value) {
      return Validator.value(value).required();
    },
    pur_type: function(value) {
      return Validator.value(value).required();
    },
    num_of_bikes: function(value) {
      return Validator.value(value).custom(() => {
        if (this.sel_type === "reseller") {
          if (value === "") {
            return "Required.";
          } else if (!/^[0-9]*$/.test(value)) {
            return "Must be a digit.";
          }else if (/^[0-9]*$/.test(value)) {
            if(value < 5) {
              return "Minimum number of bikes selected 5";
            }else if (value > 100) {
              return "Maximum number of bikes selected 100";
            }
          }
        }
      });
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

<style scoped lang="sass">
  .block
    margin-bottom: .8rem
    .b-radio.radio + .radio
      margin-left: 2rem

  .mt-2
    margin-top: 2rem
</style>
