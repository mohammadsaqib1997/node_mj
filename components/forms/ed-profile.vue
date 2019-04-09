<template lang="pug">
  .section
    form#form.form(v-on:submit.prevent='update')
      b-field(label='ID')
        b-input(type='text', placeholder='992233557', readonly='readonly', v-bind:value='user_asn_id')

      b-field(label='Full Name', :type="(validation.hasError('f_data.full_name')) ? 'is-danger':''", :message="validation.firstError('f_data.full_name')")
        b-input(type='text', placeholder='(example: Shabir Ahmed)', v-model='f_data.full_name')

      b-field(label='Email', :type="(validation.hasError('f_data.email')) ? 'is-danger':''", :message="validation.firstError('f_data.email')")
        b-input(type='email', placeholder='user@domain.com', v-model='f_data.email', :loading="validation.isValidating('f_data.email')")

      b-field(label='CNIC', :type="(validation.hasError('f_data.cnic_num')) ? 'is-danger':''", :message="validation.firstError('f_data.cnic_num')")
        b-input(type='tel', placeholder='xxxxx-xxxxxxx-x', v-model='f_data.cnic_num', v-mask="'#####-#######-#'")

      b-field(label='DOB', :type="(validation.hasError('f_data.dob')) ? 'is-danger':''", :message="validation.firstError('f_data.dob')")
        b-datepicker(placeholder='DD/MM/YYYY', v-model='f_data.dob', expanded='expanded')

      b-field(label='Contact Number', :type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''", :message="validation.firstError('f_data.cont_num')")
        b-input(type='tel', placeholder="03xx-xxx-xxxx" v-model="f_data.cont_num" v-mask="'03##-###-####'")

      b-field(label='Mailing Address', :type="(validation.hasError('f_data.address')) ? 'is-danger':''", :message="validation.firstError('f_data.address')")
        b-input(type='text', placeholder='House No. #, Street Name, Area, City, Province, Country', v-model='f_data.address')

      template(v-if="user_asn_id === '' || profile.crzb_id === null")
        b-field(label="Zone" :type="(validation.hasError('f_data.sel_crct_id')) ? 'is-danger':''" :message="validation.firstError('f_data.sel_crct_id')")
          b-autocomplete(:data="crct_list" v-model="ac_crct" field="name" expanded :keep-first="true" @select="option => f_data.sel_crct_id = option ? option.id : null" @input="loadCRCT" :loading="isFetching" placeholder="(example: Karachi, Sindh, Pakistan)")

        b-field(label="Branch" class="cus-des-1" :type="(validation.hasError('f_data.sel_brn_id')) ? 'is-danger':''" :message="validation.firstError('f_data.sel_brn_id')")
          b-select(v-model="f_data.sel_brn_id" expanded :loading="isLoadingBrn" :disabled="isLoadingBrn")
            option(value="") Select Branch
            option(v-for="(br, ind) in brn_list" :value="br.id" :key="ind") {{ br.name }}

      b-field(v-else label="Branch")
        b-input(type="text" placeholder="Select Branch" readonly v-bind:value="profile.crzb_name")

      b-field(label='Referral ID', :type="(validation.hasError('f_data.ref_code')) ? 'is-danger':''", :message="validation.firstError('f_data.ref_code')")
        b-input(v-if="user_asn_id === ''", type='text', placeholder='000000000', v-model='f_data.ref_code', v-mask="'#########'", :loading="validation.isValidating('f_data.ref_code')")
        b-input(v-else='v-else', type='text', placeholder='000000000', readonly='readonly', v-bind:value='f_data.ref_code')

      b-field.cus-des-1(label='Status')
        b-input(type='text', placeholder='Approved/Suspended', readonly='readonly', v-bind:value="(status == 0) ? 'Suspended':'Approved'")
        
      .d-flex
        button.button.btn-des-1(type='submit')
          b-icon(icon='edit', style='margin-top: 2px;')
          | &nbsp;&nbsp;&nbsp;&nbsp;Update Profile
        button.button.btn-des-1.dark(type='button', v-on:click.prevent="$emit('close_modal')") Cancel
      b-loading(:is-full-page='false', :active='form.loading', :can-cancel='false')
    pinVerMD(:md_act="pin_ver_md_act" @closed="pin_ver_md_act=false" @verified="secure=true;update()")
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import pinVerMD from "~/components/modals/pincode-verify.vue";
export default {
  components: {
    pinVerMD
  },
  computed: {
    profile: function() {
      return this.$store.state.profile.profile;
    },
    is_pin_active: function() {
      return this.$store.state.pincode.is_pin_active;
    },
    is_last_pin: function() {
      return this.$store.state.pincode.is_last_pin;
    }
  },
  async mounted() {
    this.form.loading = true;
    await this.$store.dispatch("profile/loadProfile");
    await this.$store.dispatch("pincode/loadPin");
    this.setData(this.profile);
    this.form.loading = false;
  },
  data() {
    return {
      pin_ver_md_act: false,
      prd_list: [],
      user_asn_id: "",
      status: "",
      secure: false,
      ac_crct: "",
      crct_list: [],
      brn_list: [],
      isLoadingBrn: false,
      isFetching: false,
      is_auto_crct: false,
      f_data: {
        full_name: "",
        email: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        ref_code: "",
        sel_crct_id: null,
        sel_brn_id: ""
      },
      form: {
        loading: false
      }
    };
  },
  watch: {
    "f_data.sel_crct_id": function(val) {
      this.brn_list = [];
      if (this.validation.isTouched("f_data.sel_crct_id")) {
        this.f_data.sel_brn_id = "";
      }
      if (val !== null) {
        this.loadBrnList(val);
      } else {
        this.isLoadingBrn = false;
      }
    }
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
        let validator = Validator.value(value)
          .required()
          .email()
          .maxLength(100);
        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (value !== self.profile.email) {
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
        if (self.user_asn_id === "") {
          let validator = Validator.value(value)
            .digit()
            .length(9);
          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (!Validator.isEmpty(value)) {
                return self.$axios
                  .post("/api/web/check_ref_id", {
                    id: value
                  })
                  .then(res => {
                    if (res.data.count < 1) {
                      return "Invalid referral id.";
                    }
                  });
              }
            });
          }
        }
      }
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
    loadCRCT(event) {
      const self = this;
      self.isFetching = true;
      if (self.is_auto_crct && event !== self.profile.crct_name) {
        self.f_data.sel_crct_id = null;
        self.is_auto_crct = false;
      }
      self.after_f_settle(function() {
        if (self.f_data.sel_crct_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crct_list = [];

        if (self.ac_crct === null || !self.ac_crct.length) {
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
    setData: function(data) {
      this.user_asn_id = data.user_asn_id === null ? "" : data.user_asn_id;
      this.status = data.active_sts;
      this.is_auto_crct = true;
      this.f_data = {
        full_name: data.full_name,
        email: data.email,
        cnic_num: data.cnic_num,
        dob: data.dob ? new Date(moment(data.dob)) : null,
        cont_num: data.contact_num,
        address: data.address,
        ref_code: data.ref_user_asn_id,
        sel_crct_id: data.crct_id,
        sel_brn_id: data.crzb_id ? data.crzb_id : ""
      };
      this.ac_crct = data.crct_name;
    },
    update: function() {
      const self = this;
      self.form.loading = true;
      self.$validate().then(async function(success) {
        if (success) {
          let is_err = false;
          let msg = "";

          let new_data = _.cloneDeep(self.f_data);

          if (
            new_data.email !== self.profile.email ||
            new_data.cont_num !== self.profile.contact_num
          ) {
            if (
              self.secure !== true &&
              (self.is_pin_active === true || self.is_last_pin === true)
            ) {
              self.form.loading = false;
              self.pin_ver_md_act = true;
              return;
            }
          }

          if (self.secure === true) {
            new_data["secure"] = true;
          }

          new_data["dob"] = new_data["dob"]
            ? moment(new_data.dob).format("YYYY-MM-DD")
            : null;
          await self.$axios
            .post("/api/profile/update", {
              update_id: self.$store.state.user.data.user_id,
              data: new_data,
              ext_data: {
                crct_id: self.f_data.sel_crct_id,
                crzb_id: self.f_data.sel_brn_id
              }
            })
            .then(async res => {
              if (res.data.status !== false) {
                self.secure = false;
                msg = "Successfully Profile Updated.";
                await self.$store.dispatch("profile/loadProfile");
                await self.$store.dispatch("checkUserEmail");
                self.$emit("close_modal");
              } else {
                is_err = true;
                msg = res.data.message;
              }
            })
            .catch(err => {
              $("#ed-prof-con").animate({ scrollTop: 0 }, 500);
              console.log(err);
              is_err = true;
              msg = "DB Error!";
            });

          self.form.loading = false;
          self.$toast.open({
            duration: 3000,
            message: msg,
            position: "is-bottom",
            type: is_err ? "is-danger" : "is-success"
          });
        } else {
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


