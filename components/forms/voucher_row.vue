<template>
  <tr>
    <td>{{ ind }}</td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.sel_subs_id')) ? 'is-danger':''"
        :message="validation.firstError('f_data.sel_subs_id')"
      >
        <b-autocomplete
          type="text"
          placeholder="Enter subsidiary name"
          :data="list_subs"
          field="name"
          v-model="ac_subs"
          :keep-first="true"
          @select="option => f_data.sel_subs_id = option ? option.id : null"
          @input="loadSubs"
          :loading="isFetching"
        >
          <template v-if="!isFetching" slot="empty">No results for {{ac_subs}}</template>
        </b-autocomplete>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.particular')) ? 'is-danger':''"
        :message="validation.firstError('f_data.particular')"
      >
        <b-input type="text" placeholder="Enter particulars" v-model="f_data.particular"></b-input>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.debit')) ? 'is-danger':''"
        :message="validation.firstError('f_data.debit')"
      >
        <b-input type="tel" placeholder="Enter debit" v-mask="'#######'" v-model="f_data.debit"></b-input>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.credit')) ? 'is-danger':''"
        :message="validation.firstError('f_data.credit')"
      >
        <b-input type="tel" placeholder="Enter credit" v-mask="'#######'" v-model="f_data.credit"></b-input>
      </b-field>
    </td>
  </tr>
</template>

<script>
import _ from "lodash";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  directives: {
    mask
  },
  props: {
    ind: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      ac_subs: "",
      list_subs: [],
      isFetching: false,
      f_data: {
        sel_subs_id: null,
        particular: "",
        credit: "",
        debit: ""
      }
    };
  },
  validators: {
    "f_data.sel_subs_id": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .maxLength(11);
    },
    "f_data.particular": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(250)
        .custom(() => {
          if (/[^a-zA-Z0-9\.\?\!\"\'\s- ]/.test(value)) {
            return "Invalid character use.";
          }
        });
    },
    "f_data.debit": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(1000000, "Maximum amount add 1000000!");
    },
    "f_data.credit": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(1000000, "Maximum amount add 1000000!");
    }
  },
  methods: {
    loadSubs: _.debounce(function() {
      if (this.f_data.sel_subs_id !== null) {
        return;
      }
      this.isFetching = true;
      this.list_subs = [];

      if (!this.ac_subs.length) {
        this.list_subs = [];
        this.isFetching = false;
        return;
      }
      this.$axios
        .get(`/api/c_subsidiary/subs/${this.ac_subs}`)
        .then(({ data }) => {
          this.list_subs = data.result;
        })
        .catch(error => {
          this.list_subs = [];
          throw error;
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500),

    blurAC() {
      this.list_subs = [];
      if (!this.f_data.sel_subs_id) {
        this.ac_subs = "";
      }
    },
    emptyCheck() {
      return (
        this.f_data.sel_subs_id === null &&
        this.f_data.particular === "" &&
        this.f_data.debit === "" &&
        this.f_data.credit === ""
      );
    },
    validate: function() {
      return this.$validate().then(
        function(success) {
          if (success) {
            if (!this.emptyCheck()) {
              return this.f_data;
            } else {
              return { empty: true };
            }
          } else {
            return { required: true };
          }
        }.bind(this)
      );
    },
    reset: function() {
      this.validation.reset();
    },
    rowDataReset: function() {
      this.ac_subs = "";
      this.f_data = {
        sel_subs_id: null,
        particular: "",
        credit: "",
        debit: ""
      };
      this.reset();
    }
  }
};
</script>

