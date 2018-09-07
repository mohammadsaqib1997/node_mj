<template lang="pug">
  .add-new-mem-comp-member
    b-loading(v-if="pg_hdl.loading == true" :is-full-page="false" :active="pg_hdl.loading" :can-cancel="false")
    template(v-else)
      pgErrorComp(v-if="pg_hdl.error.statusCode > 0" :error="pg_hdl.error")
      .box.main-box(v-else)
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
                    b-input(type="password" placeholder="******" v-model="f_data.password" :loading="validation.isValidating('f_data.password')")
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
                    b-input(type="tel" placeholder="92-xxx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'92-###-###-####'")
              .columns.is-variable.is-1
                .column.is-3
                  label Address
                .column
                  b-field(:type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
                    b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")
              .columns.is-variable.is-1
                .column.is-3
                  label Referral ID
                .column
                  b-field
                    b-input(type="text" readonly placeholder="000000000" :value="ref_code")
              .columns.is-variable.is-1
                .column.is-3
                  label Product
                .column
                  b-field.cus-des-1(:type="(validation.hasError('prd_data.prd')) ? 'is-danger':''" :message="validation.firstError('prd_data.prd')")
                    b-select(v-model="prd_data.prd" expanded)
                      option(value="") Select Product
                      option(v-for="prd in prd_list" v-bind:value="prd.id") {{ prd.name }}
              template(v-if="prd_data.prd === 2")
                .columns.is-variable.is-1
                  .column.is-3
                    label Buyer Type
                  .column
                    b-radio(v-for="bt in b_type_list" v-model="prd_data.b_type" :native-value="bt.code" :key="bt.code") {{ bt.name }}
                  .column(v-if="prd_data.b_type === 2")
                    b-field.cus-des-1(:type="(validation.hasError('prd_data.qnt_bikes')) ? 'is-danger':''" :message="validation.firstError('prd_data.qnt_bikes')")
                      b-input(type="tel" placeholder="Quantity Of Bikes" v-model="prd_data.qnt_bikes" v-mask="'###'")
                .columns.is-variable.is-1
                  .column.is-3
                    label Payment Type
                  .column
                    b-radio(v-for="pt in p_type_list" v-model="prd_data.p_type" :native-value="pt.code" :key="pt.code") {{ pt.name }}

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
                    label If you want to add member then deduct Rs. 5000/- in your wallet.
                  button.button.btn-des-1(@click.prevent="modalAct=false")
                    | No
                  button.button.btn-des-1(@click.prevent="modalAct=false;is_confirm=true;submit();" style="margin-left:10px")
                    | Yes

</template>

<script>
import pgErrorComp from "~/layouts/error.vue";
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  components: {
    pgErrorComp
  },
  async mounted() {
    const self = this;
    self.pg_hdl.loading = true;
    await self.$axios
      .get("/api/member/user_id/" + self.$store.state.user.data.user_id)
      .then(res => {
        self.ref_code = res.data.user_asn_id;
      })
      .catch(err => {
        self.pg_hdl.error = {
          statusCode: 403,
          message: "Not permission on this page!"
        };
      });
    const list_pds = await this.$axios.$get("/api/product/");
    this.prd_list = list_pds.data;
    this.pg_hdl.loading = false;
  },
  data() {
    return {
      pg_hdl: {
        loading: true,
        error: {
          statusCode: 0,
          message: ""
        }
      },
      modalAct: false,
      is_confirm: false,
      b_type_list: [
        { code: 1, name: "Individual" },
        { code: 2, name: "Reseller" }
      ],
      p_type_list: [
        { code: 1, name: "On Cash" },
        { code: 2, name: "On Installment" }
      ],
      prd_list: [],
      ref_code: "",
      con_pass: "",
      f_data: {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: ""
      },
      prd_data: {
        prd: "",
        b_type: 1,
        qnt_bikes: 5,
        p_type: 1
      },
      form: {
        suc: "",
        err: "",
        loading: false,
        submitted: false
      }
    };
  },
  validators: {
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
    "f_data.password": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (
          self.form.submitted ||
          self.validation.isTouched("f_data.password")
        ) {
          let validator = Validator.value(value)
            .required()
            .minLength(6)
            .maxLength(35);
          if (validator.hasImmediateError()) {
            return validator;
          } else {
            if (self.f_data.email !== "") {
              return validator.custom(() => {
                return self.$axios
                  .post("/api/web/check_email_pass", {
                    email: self.f_data.email,
                    pass: value
                  })
                  .then(res => {
                    if (res.data.count > 0) {
                      return "This password already used in previous account.";
                    }
                  });
              });
            }else{
              return validator
            }
          }
        }
      }
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
          /^\92-\d{3}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 92-000-000-0000)"
        );
    },
    // {
    //   cache: false,
    //   debounce: 500,
    //   validator: function(value) {
    //     const self = this;
    //     if (
    //       self.form.submitted ||
    //       self.validation.isTouched("f_data.cont_num")
    //     ) {
    //       let validator = Validator.value(value)
    //         .required()
    //         .regex(
    //           /^\92-\d{3}-\d{3}-\d{4}$/,
    //           "Invalid Contact Number(e.g 92-000-000-0000)"
    //         );
    //       if (validator.hasImmediateError()) {
    //         return validator;
    //       } else {
    //         return validator.custom(() => {
    //           return self.$axios
    //             .post("/api/web/check_cont_num", {
    //               cont_num: value
    //             })
    //             .then(res => {
    //               if (res.data.count > 0) {
    //                 return "This Contact Number is already in use.";
    //               }
    //             });
    //         });
    //       }
    //     }
    //   }
    // },
    "f_data.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "prd_data.prd": function(value) {
      return Validator.value(value).required();
    },
    "prd_data.qnt_bikes": function(value) {
      const self = this;
      return Validator.value(value).custom(() => {
        if (self.prd_data.b_type === 2) {
          if (value === "") {
            return "Required.";
          } else if (!/^[0-9]*$/.test(value)) {
            return "Must be a digit.";
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
  directives: {
    mask
  },
  methods: {
    submit: async function() {
      const self = this;
      self.form.submitted = true;
      self.form.loading = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          if (self.is_confirm === false) {
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
            ref_user_asn_id: self.ref_code !== "" ? self.ref_code : null
          };

          self.$axios
            .post("/api/member/add_referral", {
              member_data: mem_data,
              prd_data: {
                product_id: self.prd_data.prd,
                buyer_type:
                  self.prd_data.prd === 1 ? null : self.prd_data.b_type,
                buyer_pay_type:
                  self.prd_data.prd === 1 ? null : self.prd_data.p_type,
                buyer_qty_prd:
                  self.prd_data.prd === 1 || self.prd_data.b_type !== 2
                    ? 0
                    : parseInt(self.prd_data.qnt_bikes)
              }
            })
            .then(res => {
              self.reset();
              self.form.loading = false;
              self.form.suc = "Successfully Member Added.";
              setTimeout(() => (self.form.suc = ""), 2000);
            })
            .catch(err => {
              self.form.loading = false;
              self.form.err =
                typeof err.response.data.throw_error !== "string"
                  ? "Server Error!"
                  : err.response.data.throw_error;
              $(".main-content").animate({ scrollTop: 20 }, 500);
            });
        } else {
          self.form.loading = false;
        }
      });
    },
    reset: function() {
      this.con_pass = "";
      this.form.submitted = false;
      this.f_data = {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: ""
      };
      this.prd_data = {
        prd: "",
        b_type: 1,
        qnt_bikes: 5,
        p_type: 1
      };
      $(".main-content").animate({ scrollTop: 20 }, 500);
      this.validation.reset();
    }
  }
};
</script>


