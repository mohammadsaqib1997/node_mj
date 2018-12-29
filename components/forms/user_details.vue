<template>
  <div class="section form">
    <div class="columns is-variable is-1">
      <div class="column">
        <b-field
          label="Full Name"
          :type="(validation.hasError('form.full_name')) ? 'is-danger':''"
          :message="validation.firstError('form.full_name')"
        >
          <b-input type="text" placeholder="(example: Shabir Ahmed)" v-model="form.full_name"></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Password"
          :type="(validation.hasError('form.password')) ? 'is-danger':''"
          :message="validation.firstError('form.password')"
        >
          <b-input type="password" placeholder="******" v-model="form.password"></b-input>
        </b-field>
      </div>
    </div>
    <div class="columns is-variable is-1">
      <div class="column">
        <b-field
          label="Email"
          :type="(validation.hasError('form.email')) ? 'is-danger':''"
          :message="validation.firstError('form.email')"
        >
          <b-input
            type="email"
            placeholder="(example: shabir@gmail.com)"
            v-model="form.email"
            :loading="validation.isValidating('form.email')"
          ></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Contact Number"
          :type="(validation.hasError('form.cont_num')) ? 'is-danger':''"
          :message="validation.firstError('form.cont_num')"
        >
          <b-input
            type="tel"
            placeholder="03xx-xxx-xxxx"
            v-model="form.cont_num"
            v-mask="'03##-###-####'"
          ></b-input>
        </b-field>
      </div>
    </div>
    <div class="columns is-variable is-1">
      <div class="column">
        <b-field
          label="Branch Name"
          :type="(validation.hasError('form.sel_crzb_id')) ? 'is-danger':''"
          :message="validation.firstError('form.sel_crzb_id')"
        >
          <b-autocomplete
            :data="crzb_list"
            v-model="ac_crzb"
            field="name"
            expanded
            :keep-first="true"
            @select="option => form.sel_crzb_id = option ? option.id : null"
            @input="loadCRZB"
            :loading="isFetching"
            placeholder="(example: Baldia Town)"
          ></b-autocomplete>
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="CNIC"
          :type="(validation.hasError('form.cnic_num')) ? 'is-danger':''"
          :message="validation.firstError('form.cnic_num')"
        >
          <b-input
            type="text"
            placeholder="xxxxx-xxxxxxx-x"
            v-model="form.cnic_num"
            v-mask="'#####-#######-#'"
          ></b-input>
        </b-field>
      </div>
    </div>
    <div class="columns is-variable is-1">
      <div class="column">
        <b-field
          label="Referral Code"
          :type="(validation.hasError('form.ref_code')) ? 'is-danger':''"
          :message="validation.firstError('form.ref_code')"
        >
          <b-input
            type="text"
            placeholder="Enter member ID"
            v-model="form.ref_code"
            :loading="validation.isValidating('form.ref_code')"
          ></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field label="Referral Name">
          <b-input type="text" placeholder="Name" :value="ref_name" readonly></b-input>
        </b-field>
      </div>
    </div>
  </div>

  <!-- //- section.form
  //-   b-field(label="Full Name" :type="(validation.hasError('form.full_name')) ? 'is-danger':''" :message="validation.firstError('form.full_name')")
  //-       b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="form.full_name")

  //-   b-field(label="Email" :type="(validation.hasError('form.email')) ? 'is-danger':''" :message="validation.firstError('form.email')")
  //-       b-input(type="email" placeholder="(example: shabir@gmail.com)" v-model="form.email" :loading="validation.isValidating('form.email')")

  //-   b-field(label="Password" :type="(validation.hasError('form.password')) ? 'is-danger':''" :message="validation.firstError('form.password')")
  //-       b-input(type="password" placeholder="******" v-model="form.password")

  //-   b-field(label="CNIC" :type="(validation.hasError('form.cnic_num')) ? 'is-danger':''" :message="validation.firstError('form.cnic_num')")
  //-       b-input(type="text" placeholder="xxxxx-xxxxxxx-x" v-model="form.cnic_num" v-mask="'#####-#######-#'")

  //-   b-field(label="Contact Number" :type="(validation.hasError('form.cont_num')) ? 'is-danger':''" :message="validation.firstError('form.cont_num')")
  //-       b-input(type="text" placeholder="92-xxx-xxx-xxxx" v-model="form.cont_num" v-mask="'92-###-###-####'")

  //-   b-field(label="Address" :type="(validation.hasError('form.address')) ? 'is-danger':''" :message="validation.firstError('form.address')")
  //-       b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="form.address")
    
  //-   b-field(label="City" :type="(validation.hasError('form.city')) ? 'is-danger':''" :message="validation.firstError('form.city')")
  //-     b-autocomplete(placeholder="Enter City Name" ref="autocomplete" v-model="ac_city" :data="filteredCityArray" @select="option => form.city = option" :keep-first="true" :open-on-focus="true")
  //-       template(slot="empty") No results for {{ac_city}}
        
  //-   .columns
  //-     .column
  //-       b-field(label="Referral Code" :type="(validation.hasError('form.ref_code')) ? 'is-danger':''" :message="validation.firstError('form.ref_code')")
  //-         b-input(type="text" placeholder="Enter member ID" v-model="form.ref_code" :loading="validation.isValidating('form.ref_code')")
  //-     .column
  //-       b-field(label="Referral Name")
  //-         b-input(type="text" placeholder="Name" :value="ref_name" readonly)-->
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
  data() {
    return {
      ref_name: "",
      ac_crzb: "",
      crzb_list: [],
      isFetching: false,
      form: {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        cont_num: "",
        sel_crzb_id: null,
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
    "form.cont_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(
          /^(03)+\d{2}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 0300-000-0000)"
        );
    },
    "form.sel_crzb_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "form.ref_code": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        self.ref_name = "";
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
                  } else {
                    self.ref_name = res.data.user.full_name;
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
    after_f_settle: _.debounce(function(cb) {
      cb();
    }, 500),
    loadCRZB(event) {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.form.sel_crzb_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crzb_list = [];

        if (!self.ac_crzb.length) {
          self.crzb_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(`/api/web/ac_branch/${self.ac_crzb}`)
          .then(({ data }) => {
            self.crzb_list = data.result;
          })
          .catch(error => {
            self.crzb_list = [];
            throw error;
          })
          .finally(() => {
            self.isFetching = false;
          });
      });
    },
    validate: function() {
      return this.$validate().then(
        function(success) {
          if (success) {
            return this.form;
          }
        }.bind(this)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  padding: 0;
}
</style>
