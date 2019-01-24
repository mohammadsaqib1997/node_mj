<template>
  <tr>
    <th>{{ ind }}</th>
    <td>
      <b-field
        :type="(validation.hasError('f_data.name')) ? 'is-danger':''"
        :message="validation.firstError('f_data.name')"
      >
        <b-input type="text" placeholder="Enter Name" v-model="f_data.name"></b-input>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.blood_rel')) ? 'is-danger':''"
        :message="validation.firstError('f_data.blood_rel')"
      >
        <b-input type="text" placeholder="Enter Blood Relation" v-model="f_data.blood_rel"></b-input>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.cnic_numb')) ? 'is-danger':''"
        :message="validation.firstError('f_data.cnic_numb')"
      >
        <b-input
          type="tel"
          placeholder="Enter CNIC"
          v-mask="'#####-#######-#'"
          v-model="f_data.cnic_numb"
        ></b-input>
      </b-field>
    </td>
    <td>
      <b-field
        :type="(validation.hasError('f_data.contact_numb')) ? 'is-danger':''"
        :message="validation.firstError('f_data.contact_numb')"
      >
        <b-input
          type="tel"
          placeholder="Enter Contact Number"
          v-mask="'03##-###-####'"
          v-model="f_data.contact_numb"
        ></b-input>
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
    },
    upd_data: {
      default: () => {
        return {};
      },
      type: Object
    }
  },
  mounted() {
    if (this.upd_data != null) {
      this.setRowData(this.upd_data);
    }
  },
  watch: {
    upd_data: function(val) {
      if (val != null) {
        this.setRowData(val);
      }
    }
  },
  data() {
    return {
      f_data: {
        name: "",
        blood_rel: "",
        cnic_numb: "",
        contact_numb: ""
      }
    };
  },
  validators: {
    "f_data.name": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
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
    "f_data.blood_rel": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
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
    "f_data.cnic_numb": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .regex(/^\d{5}-\d{7}-\d$/, "Invalid NIC Number(e.g 12345-1234567-1)");
    },
    "f_data.contact_numb": function(value) {
      if (this.emptyCheck()) {
        this.reset();
        return false;
      }
      return Validator.value(value)
        .required()
        .regex(
          /^(03)+\d{2}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 0300-000-0000)"
        );
    }
  },
  methods: {
    emptyCheck() {
      return (
        this.f_data.name === "" &&
        this.f_data.blood_rel === "" &&
        this.f_data.cnic_numb === "" &&
        this.f_data.contact_numb === ""
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
      this.f_data = {
        name: "",
        blood_rel: "",
        cnic_numb: "",
        contact_numb: ""
      };
      this.reset();
    },
    setRowData: async function(data) {
      const self = this;
      if (data) {
        self.f_data = {
          name: data.name,
          blood_rel: data.blood_rel,
          cnic_numb: data.cnic_numb,
          contact_numb: data.contact_numb
        };
      }
    }
  }
};
</script>

