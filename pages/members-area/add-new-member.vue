<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Add Members
      .body
        .section
          form#form.form(v-on:submit.prevent="submit")
            p.error(v-if="form.err !== ''") {{ form.err }}
            p.success(v-if="form.suc !== ''") {{ form.suc }}
            .columns.is-variable.is-1
              .column.is-3
                label ID
              .column
                b-field(:type="(validation.hasError('f_data.id')) ? 'is-danger':''" :message="validation.firstError('f_data.id')")
                  b-input(type="text" placeholder="992233557" v-model="f_data.id" :loading="validation.isValidating('f_data.id')")
              .column
                b-field
                  b-input(type="text" placeholder="Generated Username" readonly v-bind:value="genusername")
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
                  b-input(type="email" placeholder="user@domain.com" v-model='f_data.email')
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
                b-field(:type="(validation.hasError('f_data.ref_code')) ? 'is-danger':''" :message="validation.firstError('f_data.ref_code')")
                  b-input(type="text" placeholder="000000000" v-model="f_data.ref_code")
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
</template>

<script>
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  computed: {
    genusername: function() {
      let full_name = this.f_data.full_name
        .toLowerCase()
        .split(" ")
        .join("");
      let id = this.f_data.id.slice(-9) && !isNaN(this.f_data.id.slice(-9)) ? parseInt(this.f_data.id.slice(-9)) : '';
      return full_name + id;
    }
  },
  async mounted() {
    this.form.loading = true;
    const list_pds = await this.$axios.$get("/api/product/");
    this.prd_list = list_pds.data;
    this.form.loading = false;
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
      prd_list: [],
      sts_list: [{ code: 1, name: "Approved" }, { code: 0, name: "Suspended" }],
      ref_name: "",
      con_pass: "",
      f_data: {
        id: "",
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        ref_code: "",
        status: ""
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
    "f_data.id": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        return Validator.value(value)
          .required()
          .digit()
          .length(9)
          .custom(() => {
            const self = this;
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
    "f_data.email": function(value) {
      return Validator.value(value)
        .required()
        .email()
        .maxLength(100);
      // .custom(() => {
      //   const self = this;
      //   if (!Validator.isEmpty(value)) {
      //     return self.$axios
      //       .post("/api/member/emailCheck", {
      //         email: value
      //       })
      //       .then(res => {
      //         if (res.data.count > 0) {
      //           return "This email is already in use.";
      //         }
      //       });
      //   }
      // });
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
          /^\92-\d{3}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 92-000-000-0000)"
        );
    },
    "f_data.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "f_data.ref_code": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        this.ref_name = "";
        return Validator.value(value)
          .digit()
          .length(9)
          .custom(() => {
            const self = this;
            if (!Validator.isEmpty(value)) {
              return self.$axios
                .post("/api/member/refIdCheck", {
                  id: value
                })
                .then(res => {
                  if (!res.data.status) {
                    return res.data.message;
                  } else {
                    self.ref_name = res.data.user.full_name;
                  }
                });
            }
          });
      }
    },
    "f_data.status": function(value) {
      return Validator.value(value).required();
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
    submit: function() {
      const self = this;
      self.form.submitted = true;
      self.form.loading = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          self.$axios
            .post("/api/member/add", {
              member_data: {
                user_asn_id: self.f_data.id,
                username: self.genusername,
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
              },
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
      this.f_data = {
        id: "",
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        ref_code: "",
        status: ""
      };
      this.prd_data = {
        prd: "",
        b_type: 1,
        qnt_bikes: 5,
        p_type: 1
      };
      $(".main-content").animate({ scrollTop: 20 }, 500);
      setTimeout(() => this.validation.reset(), 100);
    }
  }
};
</script>

