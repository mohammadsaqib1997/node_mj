<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header">
        <h1>Add New Partner</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="submit">
            <p class="error" v-if="form.err !== ''">{{ form.err }}</p>
            <p class="success" v-if="form.suc !== ''">{{ form.suc }}</p>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Full Name</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.full_name')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.full_name')"
                >
                  <b-input
                    type="text"
                    placeholder="(example: Shabir Ahmed)"
                    v-model="f_data.full_name"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Address</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.address')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.address')"
                >
                  <b-input
                    type="text"
                    placeholder="House No. #, Street Name, Area, City, Province, Country"
                    v-model="f_data.address"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Contact</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.cont_num')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.cont_num')"
                >
                  <b-input
                    type="tel"
                    placeholder="92-xxx-xxx-xxxx"
                    v-model="f_data.cont_num"
                    v-mask="'92-###-###-####'"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Email</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.email')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.email')"
                >
                  <b-input
                    type="email"
                    placeholder="user@domain.com"
                    v-model="f_data.email"
                    :loading="validation.isValidating('f_data.email')"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>City</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.city')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.city')"
                >
                  <b-autocomplete
                    placeholder="Enter City Name"
                    ref="autocomplete"
                    v-model="ac_city"
                    :data="filteredCityArray"
                    @select="option => f_data.city = option"
                    :keep-first="true"
                    :open-on-focus="true"
                  >
                    <template slot="empty">
                      No
                      results for {{ac_city}}
                    </template>
                  </b-autocomplete>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Discount Percent</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.discount')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.discount')"
                >
                  <b-input
                    type="text"
                    placeholder="(example: 20%)"
                    v-model="f_data.discount"
                    v-mask-percent
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Discount Products</label>
              </div>
              <div class="column">
                <b-field
                  :type="(validation.hasError('f_data.disc_prds')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.disc_prds')"
                >
                  <div class="columns is-variable is-1 is-multiline" style="margin-bottom:0;">
                    <div class="column" v-for="n in 4" :key="n">
                      <b-field :type="(validation.hasError('f_data.disc_prds')) ? 'is-danger':''">
                        <b-input
                          type="text"
                          :placeholder="'Product '+ (n)"
                          v-model="f_data.disc_prds[n-1]"
                        ></b-input>
                      </b-field>
                    </div>
                  </div>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3">
                <label>Upload Logo</label>
              </div>
              <div class="column">
                <b-upload v-model="sel_file" @input="changeImg($event)">
                  <a class="button btn-upload">{{ file_name !== '' ? file_name : 'UPLOAD' }}</a>
                </b-upload>
                <a
                  v-if="f_data.logo !== null"
                  @click.prevent="f_data.logo=null;sel_file=[]"
                  class="clear-selection"
                >Clear Selection</a>
              </div>
            </div>

            <div class="columns is-variable is-1">
              <div class="column is-3"></div>
              <div class="column">
                <button class="button btn-des-1" type="submit">
                  <b-icon icon="plus-circle" style="margin-top: 2px;"></b-icon>&nbsp;&nbsp;&nbsp;&nbsp;Add Partner
                </button>
              </div>
            </div>
          </form>

          <b-loading :is-full-page="false" :active="form.loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import { mask } from "vue-the-mask";
import maskPercent from "~/directives/mask-percent.js";
import mxn_cityAC from "~/mixins/city-ac.js";
export default {
  layout: "admin_layout",
  mixins: [mxn_cityAC],
  directives: {
    mask,
    maskPercent
  },
  watch: {
    "f_data.logo": function(val) {
      if (val !== null) {
        this.file_name = val.name;
      } else {
        this.file_name = "";
      }
    }
  },
  data() {
    return {
      sel_file: [],
      file_name: "",
      f_data: {
        logo: null,
        full_name: "",
        email: "",
        discount: "",
        disc_prds: [],
        cont_num: "",
        address: "",
        city: ""
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
    "f_data.address": function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(100);
    },
    "f_data.cont_num": function(value) {
      return Validator.value(value)
        .required()
        .regex(
          /^\92-\d{3}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 92-000-000-0000)"
        );
    },
    "f_data.email": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (
          self.form.submitted === true ||
          self.validation.isTouched("f_data.email")
        ) {
          let validator = Validator.value(value)
            .required()
            .email()
            .maxLength(100);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              return self.$axios
                .post("/api/partner/check_email", {
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
    "f_data.city": function(value) {
      return Validator.value(value).required();
    },
    "f_data.discount": function(value) {
      return Validator.value(value)
        .required()
        .regex(/^(0|[1-9][0-9]?|100)%$/, "Invalid Percentage(e.g 20%)");
    },
    "f_data.disc_prds": function(value) {
      return Validator.value(value).custom(function() {
        let chk_lng = _.filter(value, function(item) {
          return item && item !== "";
        });
        if (chk_lng.length < 1) {
          return "Minimum entered one product.";
        }

        let chk_txt = _.filter(chk_lng, function(item) {
          return !/^[a-zA-Z0-9 .]*$/.test(item);
        });
        if (chk_txt.length > 0) {
          return "Invalid characters used.";
        }
      });
    }
  },
  methods: {
    changeImg(file) {
      const self = this;
      let is_err = false;
      let msg = "";
      if (file.type === "image/png" || file.type === "image/jpeg") {
        if (file.size > 5000000) {
          is_err = true;
          msg = "Maximum file upload size 5mb.";
        }
      } else {
        is_err = true;
        msg = "Invalid Type. Allowed Types(PNG, JPG).";
      }

      if (!is_err) {
        if (file) {
          self.f_data.logo = file;
        }
      } else {
        self.profile_img_url = null;
        self.$toast.open({
          duration: 3000,
          message: msg,
          position: "is-bottom",
          type: "is-danger"
        });
      }
    },
    submit() {
      const self = this;
      self.form.loading = true;
      self.form.submitted = true;
      self.form.suc = "";
      self.form.err = "";
      self.$validate().then(function(success) {
        if (success) {
          let form_data = new FormData();
          if (self.f_data.logo !== null) {
            form_data.append("logo", self.f_data.logo);
          }

          let disc_prds = _.filter(self.f_data.disc_prds, function(item) {
            return item && item !== "";
          }).join("|");

          form_data.append("address", self.f_data.address);
          form_data.append("city", self.f_data.city);
          form_data.append("cont_num", self.f_data.cont_num);
          form_data.append("discount", self.f_data.discount.replace("%", ""));
          form_data.append("disc_prds", disc_prds);
          form_data.append("email", self.f_data.email);
          form_data.append("full_name", self.f_data.full_name);

          let config = {
            headers: { "content-type": "multipart/form-data" }
          };
          self.$axios
            .post("/api/partner/add", form_data, config)
            .then(res => {
              self.reset();
              self.form.loading = false;
              self.form.suc = "Successfully Partner Added.";
              setTimeout(() => (self.form.suc = ""), 2000);
            })
            .catch(err => {
              console.log(err);
              self.form.loading = false;
              self.form.err = "Server Error!";
              $(".main-content").animate({ scrollTop: 20 }, 500);
            });
        } else {
          self.form.loading = false;
        }
      });
    },
    reset: function() {
      this.form.submitted = false;
      this.ac_city = "";
      this.f_data = {
        logo: null,
        full_name: "",
        email: "",
        discount: "",
        disc_prds: [],
        cont_num: "",
        address: "",
        city: ""
      };
      $(".main-content").animate({ scrollTop: 20 }, 500);
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper /deep/ {
  .btn-upload {
    border-radius: 0;
    height: 100%;
    max-height: 3rem;
    padding: 10px 20px;
    border-color: transparent;
    background-color: #3d3e59;
    color: #d3c05c !important;
    font-weight: 400;
    &:hover {
      background-color: #28293c;
    }
  }
  .clear-selection {
    font-size: 13px;
    text-decoration: underline;
    color: #3d3e59;
    margin-left: 10px;
  }
}
</style>
