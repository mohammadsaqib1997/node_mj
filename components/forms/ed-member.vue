<template lang="pug">
  .section
      form#form.form(v-on:submit.prevent="update")
        p.error(v-if="form.err !== ''") {{ form.err }}
        p.success(v-if="form.suc !== ''") {{ form.suc }}

        b-field(label="ID" :type="(validation.hasError('f_data.user_asn_id')) ? 'is-danger':''" :message="validation.firstError('f_data.user_asn_id')")
          b-input(v-if="is_paid_user === true" type="text" placeholder="992233557" readonly v-bind:value="f_data.user_asn_id")
          b-input(v-else type="text" placeholder="992233557" v-model="f_data.user_asn_id" :loading="validation.isValidating('f_data.user_asn_id')")

        b-field(label="Full Name" :type="(validation.hasError('f_data.full_name')) ? 'is-danger':''" :message="validation.firstError('f_data.full_name')")
          b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="f_data.full_name")

        b-field(label="Email" :type="(validation.hasError('f_data.email')) ? 'is-danger':''" :message="validation.firstError('f_data.email')")
          b-input(type="email" placeholder="user@domain.com" v-model='f_data.email' :loading="validation.isValidating('f_data.email')")

        b-field(label="Change Password" :type="(validation.hasError('f_data.password')) ? 'is-danger':''" :message="validation.firstError('f_data.password')")
          b-input(type="password" password-reveal placeholder="******" v-model="f_data.password")

        b-field(label="CNIC" :type="(validation.hasError('f_data.cnic_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cnic_num')")
          b-input(type="tel" placeholder="xxxxx-xxxxxxx-x" v-model="f_data.cnic_num" v-mask="'#####-#######-#'")

        b-field(label="DOB" :type="(validation.hasError('f_data.dob')) ? 'is-danger':''" :message="validation.firstError('f_data.dob')")
          b-datepicker(placeholder="DD/MM/YYYY" v-model="f_data.dob" expanded)

        b-field(label="Contact Number" :type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''" :message="validation.firstError('f_data.cont_num')")
          b-input(type="tel" placeholder="92-xxx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'92-###-###-####'")

        b-field(label="Address" :type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
          b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")

        b-field(label="City" :type="(validation.hasError('f_data.city')) ? 'is-danger':''" :message="validation.firstError('f_data.city')")
          b-autocomplete(placeholder="Enter City Name" ref="autocomplete" v-model="ac_city" :data="filteredCityArray" @select="option => f_data.city = option" :keep-first="true" :open-on-focus="true")
            template(slot="empty") No results for {{ac_city}}
          
        b-field(label="Referral ID" :type="(validation.hasError('f_data.ref_code')) ? 'is-danger':''" :message="validation.firstError('f_data.ref_code')")
          b-input(v-if="is_paid_user === true" type="text" placeholder="000000000" readonly v-bind:value="f_data.ref_code")
          b-input(v-else type="text" placeholder="000000000" v-model="f_data.ref_code")

        b-field.cus-des-1(label="Status" :type="(validation.hasError('f_data.status')) ? 'is-danger':''" :message="validation.firstError('f_data.status')")
          b-select(v-model="f_data.status" expanded)
            option(value="") Approved/Suspended
            option(v-for="sts in sts_list" v-bind:value="sts.code") {{ sts.name }}
              
        b-field.cus-des-1(label="Product" :type="(validation.hasError('prd_data.prd')) ? 'is-danger':''" :message="validation.firstError('prd_data.prd')")
          b-select(v-model="prd_data.prd" expanded)
            option(value="") Select Product
            option(v-for="prd in prd_list" v-bind:value="prd.id") {{ prd.name }}
          
        template(v-if="prd_data.prd === 2")
          .field
            b-radio(v-for="bt in b_type_list" v-model="prd_data.b_type" :native-value="bt.code" :key="bt.code") {{ bt.name }}
          b-field(v-if="prd_data.b_type === 2" label="Quantity Of Bikes" :type="(validation.hasError('prd_data.qnt_bikes')) ? 'is-danger':''" :message="validation.firstError('prd_data.qnt_bikes')")
            b-input(type="tel" placeholder="Quantity Of Bikes" v-model="prd_data.qnt_bikes" v-mask="'###'")
          .field
            b-radio(v-for="pt in p_type_list" v-model="prd_data.p_type" :native-value="pt.code" :key="pt.code") {{ pt.name }}

        .d-flex
          button.button.btn-des-1(type="submit")
            b-icon(icon="edit" style="margin-top: 2px;")
            | &nbsp;&nbsp;&nbsp;&nbsp;Update Member
          button.button.btn-des-1.dark(type="button" v-on:click.prevent="$store.commit('edMemModal/setModalActive', false)") Cancel

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
              button.button.btn-des-1(@click.prevent="modalAct=false;is_paid_user=true;update();" style="margin-left:10px")
                | Yes
</template>

<script>
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import mxn_cityAC from "~/mixins/city-ac.js";
export default {
  mixins: [mxn_cityAC],
  props: {
    edit_id: {
      type: Number,
      default: null
    }
  },
  async mounted() {
    this.form.loading = true;
    const list_pds = await this.$axios.$get("/api/product/");
    const load_data = await this.$axios.$get("/api/member/" + this.edit_id);
    this.fet_m_data = load_data.data[0].m;
    this.setFData(load_data.data[0].m);
    this.setPrdData(load_data.data[0].upd);
    this.prd_list = list_pds.data;
    this.form.loading = false;
  },
  data() {
    return {
      modalAct: false,
      is_paid_user: false,
      prd_list: [],
      b_type_list: [
        { code: 1, name: "Individual" },
        { code: 2, name: "Reseller" }
      ],
      p_type_list: [
        { code: 1, name: "On Cash" },
        { code: 2, name: "On Installment" }
      ],
      sts_list: [{ code: 1, name: "Approved" }, { code: 0, name: "Suspended" }],
      fet_m_data: null,
      f_data: {
        user_asn_id: "",
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        city: "",
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
        loading: false
      }
    };
  },
  validators: {
    "f_data.user_asn_id": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        let validator = Validator.value(value)
          .digit()
          .length(9);

        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (
              !Validator.isEmpty(value) &&
              self.fet_m_data.user_asn_id !== value
            ) {
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
    },
    "f_data.full_name": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(50)
        .custom(() => {
          if (/[^a-zA-Z0-9. ]/.test(value)) {
            return "Invalid character use.";
          }
        });
    },
    "f_data.email": {
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
            if (value !== self.fet_m_data.email) {
              return self.$axios
                .post("/api/web/check_email", {
                  email: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This email is already in use.";
                  }
                });
            }
          });
        }
      }
    },
    "f_data.password": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
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
    "f_data.city": function(value) {
      return Validator.value(value).required();
    },
    "f_data.ref_code": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        let validator = Validator.value(value)
          .digit()
          .length(9);

        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (
              !Validator.isEmpty(value) &&
              value !== self.fet_m_data.ref_user_asn_id
            ) {
              if (
                value !== self.f_data.user_asn_id &&
                value !== self.fet_m_data.user_asn_id
              ) {
                return self.$axios
                  .post("/api/web/check_ref_id", {
                    id: value
                  })
                  .then(res => {
                    if (res.data.count < 1) {
                      return "Invalid referral id.";
                    }
                  });
              } else {
                return "Invalid referral id.";
              }
            }
          });
        }
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
    setFData: function(data) {
      this.is_paid_user = data.is_paid_m === 1 ? true : false;
      this.ac_city = data.city !== null ? data.city : "";
      this.f_data = {
        user_asn_id: data.user_asn_id === null ? "" : data.user_asn_id,
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        cnic_num: data.cnic_num,
        dob: data.dob ? new Date(moment(data.dob)) : null,
        cont_num: data.contact_num,
        address: data.address,
        city: data.city,
        ref_code: data.ref_user_asn_id,
        status: data.active_sts
      };
    },
    setPrdData: function(data) {
      this.prd_data = {
        prd: data.product_id ? data.product_id : "",
        b_type: data.buyer_type ? data.buyer_type : 1,
        qnt_bikes: data.buyer_qty_prd ? data.buyer_qty_prd : 5,
        p_type: data.buyer_pay_type ? data.buyer_pay_type : 1
      };
    },
    update: function() {
      const self = this;
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
            city: self.f_data.city,
            ref_user_asn_id:
              self.f_data.ref_code !== "" ? self.f_data.ref_code : null,
            active_sts: self.f_data.status
          };

          if (self.is_paid_user === true && self.fet_m_data.is_paid_m === 0) {
            mem_data["user_asn_id"] = self.f_data.user_asn_id;
            mem_data["is_paid_m"] = 1;
            self.fet_m_data.user_asn_id = self.f_data.user_asn_id;
            self.fet_m_data.is_paid_m = 1;
          }

          self.$axios
            .post("/api/member/update", {
              update_id: self.fet_m_data.id,
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
              self.form.loading = false;
              self.$emit("update_member", true);
              self.$store.commit("edMemModal/setModalActive", false);
              self.$toast.open({
                duration: 3000,
                message: "Successfully Member Updated.",
                position: "is-bottom",
                type: "is-success"
              });
            })
            .catch(err => {
              $("#ed-member-con").animate({ scrollTop: 0 }, 500);
              console.log(err);
              self.form.loading = false;
              self.form.err = "DB Error!";
            });
        } else {
          $("#ed-member-con").animate({ scrollTop: 0 }, 500);
          self.form.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="sass">
.section
    padding: 3rem
    & /deep/

      .form
        .field
          .label
            font-size: 18px
            line-height: 18px
            color: #828282
          .control
            &>.icon.is-right.is-clickable
              right: 8px
              color: #d9bd68 !important
        .d-flex
          @media screen and (min-width: 426px)
            display: flex
            justify-content: center
          &> .button
            @media screen and (max-width: 425px)
              width: 100%

            &:last-child
              @media screen and (min-width: 426px)
                margin-left: 1rem
</style>


