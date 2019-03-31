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
          label="Zone"
          :type="(validation.hasError('form.sel_crct_id')) ? 'is-danger':''"
          :message="validation.firstError('form.sel_crct_id')"
        >
          <b-autocomplete
            :data="crct_list"
            v-model="ac_crct"
            field="name"
            expanded
            :keep-first="true"
            @select="option => form.sel_crct_id = option ? option.id : null"
            @input="loadCRCT"
            :loading="isFetching"
            placeholder="(example: Karachi, Sindh, Pakistan)"
          ></b-autocomplete>
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Branch"
          class="cus-des-1"
          :type="(validation.hasError('form.sel_brn_id')) ? 'is-danger':''"
          :message="validation.firstError('form.sel_brn_id')"
        >
          <b-select
            v-model="form.sel_brn_id"
            expanded
            :loading="isLoadingBrn"
            :disabled="isLoadingBrn"
          >
            <option value>Select Branch</option>
            <option v-for="(br, ind) in brn_list" :value="br.id" :key="ind">{{ br.name }}</option>
          </b-select>
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
      ac_crct: "",
      crct_list: [],
      brn_list: [],
      isFetching: false,
      isLoadingBrn: false,
      form: {
        full_name: "",
        email: "",
        password: "",
        cont_num: "",
        sel_crct_id: null,
        sel_brn_id: "",
        address: "",
        ref_code: ""
      }
    };
  },
  watch: {
    "form.sel_crct_id": function(val) {
      this.brn_list = [];
      this.form.sel_brn_id = "";
      if (val !== null) {
        this.loadBrnList(val);
      } else {
        this.isLoadingBrn = false;
      }
    }
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
    "form.cont_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(
          /^(03)+\d{2}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 0300-000-0000)"
        );
    },
    "form.sel_crct_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "form.sel_brn_id": function(value) {
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
    after_f_settle: _.debounce(
      function(cb) {
        cb();
      },
      500,
      false
    ),
    after_f_settle2: _.debounce(
      function(cb) {
        cb();
      },
      500,
      false
    ),
    loadCRCT(event) {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.form.sel_crct_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crct_list = [];

        if (!self.ac_crct.length) {
          self.crct_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(`/api/web/ac_crct_ls/${self.ac_crct}`)
          .then(({ data }) => {
            self.crct_list = data.result;
          })
          .catch(error => {
            self.crct_list = [];
            throw error;
          })
          .finally(() => {
            self.isFetching = false;
          });
      });
    },
    loadBrnList(crct_id) {
      const self = this;
      self.isLoadingBrn = true;
      self.after_f_settle2(function() {
        if (crct_id === null) {
          self.isLoadingBrn = false;
          return;
        }
        self.brn_list = [];
        self.$axios
          .get(`/api/web/ls_branch/${crct_id}`)
          .then(({ data }) => {
            self.brn_list = data.result;
          })
          .catch(error => {
            self.brn_list = [];
            throw error;
          })
          .finally(() => {
            self.isLoadingBrn = false;
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
  /deep/ {
    .select select option {
      color: #4a4a4a !important;
    }
  }
}
</style>
