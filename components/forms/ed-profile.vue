<template lang="pug">
  .section
      form#form.form(v-on:submit.prevent="update")

        b-field(label="ID")
          b-input(type="text" placeholder="992233557" readonly v-bind:value="user_asn_id")

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
          b-input(v-if="user_asn_id === ''" type="text" placeholder="000000000" v-model="f_data.ref_code" v-mask="'#########'" :loading="validation.isValidating('f_data.ref_code')")
          b-input(v-else type="text" placeholder="000000000" readonly v-bind:value="f_data.ref_code")

        b-field.cus-des-1(label="Status")
          b-input(type="text" placeholder="Approved/Suspended" readonly v-bind:value="(status == 0) ? 'Suspended':'Approved'")

        .d-flex
          button.button.btn-des-1(type="submit")
            b-icon(icon="edit" style="margin-top: 2px;")
            | &nbsp;&nbsp;&nbsp;&nbsp;Update Profile
          button.button.btn-des-1.dark(type="button" v-on:click.prevent="$emit('close_modal')") Cancel

        b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  computed: {
    profile: function() {
      return this.$store.state.profile.profile;
    },
    filteredCityArray() {
      return this.cities.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.ac_city.toLowerCase()) >= 0
        );
      });
    }
  },
  async mounted() {
    this.form.loading = true;
    await this.$store.dispatch("profile/loadProfile");
    this.setData(this.profile);
    let ct_data = await this.$axios.$get("/api/web/pk");
    this.cities = ct_data.cities;
    this.form.loading = false;
  },
  data() {
    return {
      prd_list: [],
      cities: [],
      ac_city: "",
      fet_m_data: null,
      user_asn_id: "",
      status: "",
      f_data: {
        full_name: "",
        email: "",
        password: "",
        cnic_num: "",
        dob: null,
        cont_num: "",
        address: "",
        city: "",
        ref_code: ""
      },
      form: {
        loading: false
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
    setData: function(data) {
      this.user_asn_id = data.user_asn_id === null ? "" : data.user_asn_id;
      this.ac_city = data.city;
      this.status = data.active_sts;
      this.f_data = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        cnic_num: data.cnic_num,
        dob: data.dob ? new Date(moment(data.dob)) : null,
        cont_num: data.contact_num,
        address: data.address,
        city: data.city,
        ref_code: data.ref_user_asn_id
      };
    },
    update: function() {
      const self = this;
      self.form.loading = true;
      self.$validate().then(async function(success) {
        if (success) {
          let is_err = false;
          let msg = "";

          let new_data = _.cloneDeep(self.f_data);

          new_data["dob"] = new_data["dob"]
            ? moment(new_data.dob).format("YYYY-MM-DD")
            : null;
          await self.$axios
            .post("/api/profile/update", {
              update_id: self.$store.state.user.data.user_id,
              data: new_data
            })
            .then(async res => {
              if (res.data.status !== false) {
                msg = "Successfully Profile Updated.";
                await self.$store.dispatch("profile/loadProfile");
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


