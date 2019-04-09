<template lang="pug">
  .add-new-mem-comp-admin
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Add Members
      .body
        .section
          form.form(v-on:submit.prevent="submit")
            p.error(v-if="form.err !== ''") {{ form.err }}
            p.success(v-if="form.suc !== ''") {{ form.suc }}
            .columns.is-variable.is-1
              .column.is-3
                label ID
              .column
                b-field(:type="(validation.hasError('f_data.user_asn_id')) ? 'is-danger':''" :message="validation.firstError('f_data.user_asn_id')")
                  b-input(type="text" placeholder="992233557" v-model="f_data.user_asn_id" :loading="validation.isValidating('f_data.user_asn_id')")
            .columns.is-variable.is-1
              .column.is-3
                label Full Name
              .column
                b-field(:type="(validation.hasError('f_data.full_name')) ? 'is-danger':''" :message="validation.firstError('f_data.full_name')")
                  b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="f_data.full_name")
            .columns.is-variable.is-1
              .column.is-3
                label Email
              .column
                b-field(:type="(validation.hasError('f_data.email')) ? 'is-danger':''" :message="validation.firstError('f_data.email')")
                  b-input(type="email" placeholder="user@domain.com" v-model='f_data.email' :loading="validation.isValidating('f_data.email')")
            .columns.is-variable.is-1
              .column.is-3
                label Password
              .column
                b-field(:type="(validation.hasError('f_data.password')) ? 'is-danger':''" :message="validation.firstError('f_data.password')")
                  b-input(type="password" placeholder="******" v-model="f_data.password")
            .columns.is-variable.is-1
              .column.is-3
                label Re-Type Password
              .column
                b-field(:type="(validation.hasError('con_pass')) ? 'is-danger':''" :message="validation.firstError('con_pass')")
                  b-input(type="password" placeholder="******" v-model="con_pass")
            .columns.is-variable.is-1
              .column.is-3
                label CNIC
              .column
                b-field(:type="(validation.hasError('f_data.cnic_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cnic_num')")
                  b-input(type="tel" placeholder="xxxxx-xxxxxxx-x" v-model="f_data.cnic_num" v-mask="'#####-#######-#'")
            .columns.is-variable.is-1
              .column.is-3
                label Date Of Birth
              .column
                b-field(:type="(validation.hasError('f_data.dob')) ? 'is-danger':''" :message="validation.firstError('f_data.dob')")
                  b-datepicker(placeholder="DD/MM/YYYY" v-model="f_data.dob" expanded)
            .columns.is-variable.is-1
              .column.is-3
                label Contact Number
              .column
                b-field(:type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cont_num')")
                  b-input(type="tel" placeholder="03xx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'03##-###-####'")
            .columns.is-variable.is-1
              .column.is-3
                label Mailing Address
              .column
                b-field(:type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
                  b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")
            .columns.is-variable.is-1
              .column.is-3
                label Zone
              .column
                b-field(:type="(validation.hasError('f_data.sel_crct_id')) ? 'is-danger':''" :message="validation.firstError('f_data.sel_crct_id')")
                  b-autocomplete(:data="crct_list" v-model="ac_crct" field="name" expanded :keep-first="true" @select="option => f_data.sel_crct_id = option ? option.id : null" @input="loadCRCT" :loading="isFetching" placeholder="(example: Karachi, Sindh, Pakistan)")
            .columns.is-variable.is-1
              .column.is-3
                label Branch
              .column
                b-field(class="cus-des-1" :type="(validation.hasError('f_data.sel_brn_id')) ? 'is-danger':''" :message="validation.firstError('f_data.sel_brn_id')")
                  b-select(v-model="f_data.sel_brn_id" expanded :loading="isLoadingBrn" :disabled="isLoadingBrn")
                    option(value="") Select Branch
                    option(v-for="(br, ind) in brn_list" :value="br.id" :key="ind") {{ br.name }}
            .columns.is-variable.is-1
              .column.is-3
                label Referral ID
              .column
                b-field(:type="(validation.hasError('f_data.ref_code')) ? 'is-danger':''" :message="validation.firstError('f_data.ref_code')")
                  b-input(type="text" placeholder="000000000" v-model="f_data.ref_code" :loading="validation.isValidating('f_data.ref_code')")
              .column
                b-field
                  b-input(type="text" placeholder="Referral Name" readonly v-bind:value="ref_name")
            .columns.is-variable.is-1
              .column.is-3
                label Status
              .column
                b-field.cus-des-1(:type="(validation.hasError('f_data.status')) ? 'is-danger':''" :message="validation.firstError('f_data.status')")
                  b-select(v-model="f_data.status" expanded)
                    option(value="") Approved/Suspended
                    option(v-for="sts in sts_list" v-bind:value="sts.code") {{ sts.name }}
            .columns.is-variable.is-1
              .column.is-3
                label Product
              .column
                b-field.cus-des-1(:type="(validation.hasError('prd_data.prd')) ? 'is-danger':''" :message="validation.firstError('prd_data.prd')")
                  b-select(v-model="prd_data.prd" expanded)
                    option(value="") Select Product
                    option(v-for="prd in prd_list" v-bind:value="prd.id") {{ prd.name }}

            .columns.is-variable.is-1
              .column.is-3
              .column
                button.button.btn-des-1(type="submit")
                  b-icon(icon="plus-circle" style="margin-top: 2px;")
                  | &nbsp;&nbsp;&nbsp;&nbsp;Add Member
          b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
    b-modal.confirm_modal(:active="modalAct" :canCancel="false")
      .box.main-box
        .header.columns.is-gapless
          .column
              h1 Confirmation
        .body
          .section
            .show-info
              label Yau are assign the manual user id so please confirm it this is paid user?
            button.button.btn-des-1(@click.prevent="modalAct=false")
              | No
            button.button.btn-des-1(@click.prevent="modalAct=false;is_paid_user=true;submit();" style="margin-left:10px")
              | Yes

</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import mxn_cityAC from "~/mixins/city-ac.js";
export default {
  mixins: [mxn_cityAC],
  async mounted() {
    this.form.loading = true;
    const list_pds = await this.$axios.$get("/api/product/");
    this.prd_list = list_pds.data;
    this.form.loading = false;
  },
  data() {
    return {
      modalAct: false,
      is_paid_user: false,
      prd_list: [],
      sts_list: [{ code: 1, name: "Approved" }, { code: 0, name: "Suspended" }],
      ref_name: "",
      con_pass: "",
      ac_crct: "",
      crct_list: [],
      brn_list: [],
      isLoadingBrn: false,
      isFetching: false,
      f_data: {
        user_asn_id: "",
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        ref_code: "",
        status: "",
        sel_crct_id: null,
        sel_brn_id: ""
      },
      prd_data: {
        prd: ""
      },
      form: {
        suc: "",
        err: "",
        loading: true,
        submitted: false
      }
    };
  },
  watch: {
    "f_data.sel_crct_id": function(val) {
      this.brn_list = [];
      this.f_data.sel_brn_id = "";
      if (val !== null) {
        this.loadBrnList(val);
      } else {
        this.isLoadingBrn = false;
      }
    }
  },
  validators: {
    "f_data.user_asn_id": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (
          self.form.submitted ||
          self.validation.isTouched("f_data.user_asn_id")
        ) {
          let validator = Validator.value(value)
            .digit()
            .length(9);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (!Validator.isEmpty(value)) {
                return self.$axios
                  .post("/api/member/mjIdCheck", {
                    id: value
                  })
                  .then(res => {
                    if (res.data.count > 0) {
                      return "This id is already in use.";
                    }
                  });
              }
            });
          }
        }
      }
    },
    "f_data.full_name": function(value) {
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
    "f_data.email": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (self.form.submitted || self.validation.isTouched("f_data.email")) {
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
      }
    },
    "f_data.password": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "con_pass, f_data.password": function(con_pass, password) {
      if (this.form.submitted || this.validation.isTouched("con_pass")) {
        return Validator.value(con_pass)
          .required()
          .match(password);
      }
    },
    "f_data.cnic_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(/^\d{5}-\d{7}-\d$/, "Invalid NIC Number(e.g 12345-1234567-1)");
    },
    "f_data.dob": function(value) {
      return Validator.value(value).required();
    },
    "f_data.cont_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(
          /^(03)+\d{2}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 0300-000-0000)"
        );
    },
    "f_data.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "f_data.sel_crct_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "f_data.sel_brn_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "f_data.ref_code": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        self.ref_name = "";
        if (
          self.form.submitted ||
          self.validation.isTouched("f_data.ref_code")
        ) {
          let validator = Validator.value(value)
            .digit()
            .length(9);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (!Validator.isEmpty(value)) {
                if (value !== self.f_data.user_asn_id) {
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
                } else {
                  return "Invalid referral id.";
                }
              }
            });
          }
        }
      }
    },
    "f_data.status": function(value) {
      return Validator.value(value).required();
    },
    "prd_data.prd": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    }
  },
  directives: {
    mask
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
    loadCRCT(event) {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.f_data.sel_crct_id !== null) {
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
    submit: async function() {
      const self = this;
      self.form.submitted = true;
      self.form.loading = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          if (
            !Validator.isEmpty(self.f_data.user_asn_id) &&
            self.is_paid_user === false
          ) {
            self.modalAct = true;
            self.form.loading = false;
            return;
          }

          let mem_data = {
            full_name: self.f_data.full_name,
            email: self.f_data.email,
            password: self.f_data.password,
            cnic_num: self.f_data.cnic_num,
            dob: moment(self.f_data.dob).format("YYYY-MM-DD"),
            contact_num: self.f_data.cont_num,
            address: self.f_data.address,
            ref_user_asn_id:
              self.f_data.ref_code !== "" ? self.f_data.ref_code : null,
            active_sts: self.f_data.status
          };
          if (self.is_paid_user === true) {
            mem_data["is_paid_m"] = 1;
            mem_data["user_asn_id"] = self.f_data.user_asn_id;
          }

          self.$axios
            .post("/api/member/add", {
              member_data: mem_data,
              ext_data: {
                prd_id: self.prd_data.prd,
                crct_id: self.f_data.sel_crct_id,
                crzb_id: self.f_data.sel_brn_id
              }
            })
            .then(res => {
              self.reset();
              self.form.loading = false;
              self.form.suc = "Successfully Member Added.";
              setTimeout(() => (self.form.suc = ""), 2000);
            })
            .catch(err => {
              console.log(err);
              self.form.loading = false;
              self.form.err = "DB Error!";
            });
        } else {
          self.form.loading = false;
        }
      });
    },
    reset: function() {
      this.con_pass = "";
      this.ref_name = "";
      this.is_paid_user = false;
      this.form.submitted = false;
      this.ac_crct = "";
      this.f_data = {
        user_asn_id: "",
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        ref_code: "",
        status: "",
        sel_crct_id: null
      };
      this.prd_data = {
        prd: ""
      };
      this.validation.reset();
      $(".main-content").animate({ scrollTop: 20 }, 500);

      //setTimeout(() => , 100);
    }
  }
};
</script>


