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
          class="cus-des-1"
          label="Franchise"
          :type="(validation.hasError('form.franchise')) ? 'is-danger':''"
          :message="validation.firstError('form.franchise')"
        >
          <b-select
            v-model="form.franchise"
            expanded
            :loading="isLoadingFrc"
            :disabled="isLoadingFrc"
          >
            <option value>Select Franchise</option>
            <option v-for="(fr, ind) in frc_list" :value="fr.id" :key="ind">{{ fr.name }}</option>
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
      ac_crzb: "",
      crzb_list: [],
      frc_list: [],
      isFetching: false,
      isLoadingFrc: false,
      form: {
        full_name: "",
        email: "",
        password: "",
        cont_num: "",
        sel_crzb_id: null,
        franchise: "",
        ref_code: ""
      }
    };
  },
  watch: {
    "form.sel_crzb_id": function(val) {
      this.frc_list = [];
      this.form.franchise = "";
      if (val !== null) {
        this.loadFrnList(val);
      } else {
        this.isLoadingFrc = false;
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
    "form.sel_crzb_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "form.franchise": function(value) {
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
    loadFrnList(crzb_id) {
      const self = this;
      self.isLoadingFrc = true;
      self.after_f_settle2(function() {
        if (crzb_id === null) {
          self.isLoadingFrc = false;
          return;
        }
        self.frc_list = [];
        self.$axios
          .get(`/api/web/ls_franchise/${crzb_id}`)
          .then(({ data }) => {
            self.frc_list = data.result;
          })
          .catch(error => {
            self.frc_list = [];
            throw error;
          })
          .finally(() => {
            self.isLoadingFrc = false;
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
