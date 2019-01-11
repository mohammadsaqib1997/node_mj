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
          b-input(type="tel" placeholder="03xx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'03##-###-####'")

        b-field(label="Mailing Address" :type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
          b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country" v-model="f_data.address")

        b-field(label="Branch" :type="(validation.hasError('f_data.sel_crzb_id')) ? 'is-danger':''" :message="validation.firstError('f_data.sel_crzb_id')")
          b-input(v-if="is_paid_user === true && fet_m_data.crzb_id !== null" type="text" placeholder="(example: Baldia Town)" readonly v-bind:value="ac_crzb")
          b-autocomplete(v-else :data="crzb_list" v-model="ac_crzb" field="name" expanded :keep-first="true" @select="option => f_data.sel_crzb_id = option ? option.id : null" @input="loadCRZB" :loading="isFetching" placeholder="(example: Baldia Town)")
          
        b-field.cus-des-1(label="Franchise" :type="(validation.hasError('f_data.franchise')) ? 'is-danger':''" :message="validation.firstError('f_data.franchise')")
          b-input(v-if="is_paid_user === true && fet_m_data.fr_id !== null" type="text" placeholder="Select Franchise" readonly v-bind:value="fet_m_data.fr_name")
          b-select(v-else v-model="f_data.franchise" :loading="isLoadingFrc" :disabled="isLoadingFrc" expanded)
            option(value="") Select Franchise
            option(v-for="(fr, ind) in frc_list" :value="fr.id" :key="ind") {{ fr.name }}
        
        b-field(label="Referral ID" :type="(validation.hasError('f_data.ref_code')) ? 'is-danger':''" :message="validation.firstError('f_data.ref_code')")
          b-input(v-if="is_paid_user === true" type="text" placeholder="000000000" readonly v-bind:value="f_data.ref_code")
          b-input(v-else type="text" placeholder="000000000" v-model="f_data.ref_code")

        b-field.cus-des-1(label="Status" :type="(validation.hasError('f_data.status')) ? 'is-danger':''" :message="validation.firstError('f_data.status')")
          b-select(v-model="f_data.status" expanded)
            option(value="") Approved/Suspended
            option(v-for="sts in sts_list" v-bind:value="sts.code") {{ sts.name }}
              
        b-field.cus-des-1(label="Product" :type="(validation.hasError('prd_data.prd')) ? 'is-danger':''" :message="validation.firstError('prd_data.prd')")
          b-input(v-if="is_paid_user === true" type="text" placeholder="Select Product" readonly v-bind:value="getPrdName(prd_data.prd)")
          b-select(v-else v-model="prd_data.prd" expanded)
            option(value="") Select Product
            option(v-for="prd in prd_list" v-bind:value="prd.id") {{ prd.name }}

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
import _ from "lodash";
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
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
    this.fet_m_data = load_data.data[0];
    this.prd_list = list_pds.data;
    this.setFData(load_data.data[0]);
    this.form.loading = false;
  },
  data() {
    return {
      modalAct: false,
      is_paid_user: false,
      prd_list: [],
      sts_list: [{ code: 1, name: "Approved" }, { code: 0, name: "Suspended" }],
      fet_m_data: null,
      ac_crzb: "",
      crzb_list: [],
      frc_list: [],
      isFetching: false,
      isLoadingFrc: false,
      is_auto_crzb: false,
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
        sel_crzb_id: null,
        franchise: ""
      },
      prd_data: {
        prd: ""
      },
      form: {
        suc: "",
        err: "",
        loading: false
      }
    };
  },
  watch: {
    "f_data.sel_crzb_id": function(val) {
      this.frc_list = [];
      if (this.validation.isTouched("f_data.sel_crzb_id")) {
        this.f_data.franchise = "";
      }
      if (val !== null) {
        this.loadFrnList(val);
      } else {
        this.isLoadingFrc = false;
      }
    }
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
    "f_data.sel_crzb_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "f_data.franchise": function(value) {
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
    loadCRZB(event) {
      const self = this;
      self.isFetching = true;
      if (self.is_auto_crzb && event !== self.fet_m_data.crzb_ac_name) {
        self.f_data.sel_crzb_id = null;
        self.is_auto_crzb = false;
      }
      self.after_f_settle(function() {
        if (self.f_data.sel_crzb_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crzb_list = [];

        if (self.ac_crzb === null || !self.ac_crzb.length) {
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
    getPrdName(f_id) {
      return _.get(_.find(this.prd_list, { id: f_id }), "name", null);
    },
    setFData: function(data) {
      this.is_paid_user = data.is_paid_m === 1 ? true : false;
      this.is_auto_crzb = true;
      this.f_data = {
        user_asn_id: data.user_asn_id === null ? "" : data.user_asn_id,
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        cnic_num: data.cnic_num,
        dob: data.dob ? new Date(moment(data.dob)) : null,
        cont_num: data.contact_num,
        address: data.address,
        ref_code: data.ref_user_asn_id,
        status: data.active_sts,
        sel_crzb_id: data.crzb_id,
        franchise: data.fr_id ? data.fr_id : ""
      };
      this.prd_data = {
        prd: data.product_id ? data.product_id : ""
      };
      this.ac_crzb = data.crzb_ac_name;
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
            ref_user_asn_id:
              self.f_data.ref_code !== "" ? self.f_data.ref_code : null,
            active_sts: self.f_data.status
          };

          if (self.f_data.email !== self.fet_m_data.email) {
            mem_data["email_v_sts"] = 0;
          }

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
              ext_data: {
                product_id: self.prd_data.prd,
                crzb_id: self.f_data.sel_crzb_id,
                fr_id: self.f_data.franchise
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


