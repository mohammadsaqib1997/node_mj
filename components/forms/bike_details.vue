<template lang="pug">
  section#bikeFormCon.form
    h1 Product Details
    .block
      b-radio(v-model="form.sel_type" v-for="i in b_type_list" :native-value="i.code" :key="i.code") {{ i.name }}
      p.help.is-danger(v-if="validation.hasError('form.sel_type')") {{ validation.firstError('form.sel_type') }}
    b-field(label="Quantity Of Bikes" v-if="form.sel_type === 2" :type="(validation.hasError('form.num_of_bikes')) ? 'is-danger':''" :message="validation.firstError('form.num_of_bikes')")
        b-input(type="text" placeholder="Enter Quantity Of Bikes" v-model="form.num_of_bikes" v-mask="'###'")
    .block.mt-2
      b-radio(v-model="form.pur_type" v-for="i in p_type_list" :native-value="i.code" :key="i.code") {{ i.name }}
      p.help.is-danger(v-if="validation.hasError('form.pur_type')") {{ validation.firstError('form.pur_type') }}
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
      b_type_list: [
        { code: 1, name: "Individual" },
        { code: 2, name: "Reseller" }
      ],
      p_type_list: [
        { code: 1, name: "On Cash" },
        { code: 2, name: "On Installment" }
      ],
      form: {
        sel_type: 1,
        pur_type: 1,
        num_of_bikes: 5
      }
    };
  },
  validators: {
    "form.sel_type": function(value) {
      return Validator.value(value).required();
    },
    "form.pur_type": function(value) {
      return Validator.value(value).required();
    },
    "form.num_of_bikes": function(value) {
      return Validator.value(value).custom(() => {
        if (this.form.sel_type === 2) {
          if (value === "") {
            return "Required.";
          } else if (/^[0-9]*$/.test(value)) {
            if (value < 5) {
              return "Minimum number of bikes selected 5";
            } else if (value > 100) {
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
