<template>
  <b-modal class="md-info" :active="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Edit Partner</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="update">
            <b-field
              label="Full Name"
              :type="(validation.hasError('f_data.full_name')) ? 'is-danger':''"
              :message="validation.firstError('f_data.full_name')"
            >
              <b-input type="text" placeholder="(example: Shabir Ahmed)" v-model="f_data.full_name"></b-input>
            </b-field>

            <b-field
              label="Address"
              :type="(validation.hasError('f_data.address')) ? 'is-danger':''"
              :message="validation.firstError('f_data.address')"
            >
              <b-input
                type="text"
                placeholder="House No. #, Street Name, Area, City, Province, Country"
                v-model="f_data.address"
              ></b-input>
            </b-field>

            <b-field
              label="Contact"
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

            <b-field
              label="Email"
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

            <b-field
              label="City"
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

            <b-field
              label="Discount Percent"
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

            <b-field
              label="Discount Products"
              :type="(validation.hasError('f_data.disc_prds')) ? 'is-danger':''"
              :message="validation.firstError('f_data.disc_prds')"
            >
              <div class="columns is-variable is-1 is-multiline" style="margin-bottom:0;">
                <div class="column is-6" v-for="n in 4" :key="n">
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

            <div class="field">
              <label class="label">Logo</label>
              <div class="img-cont" v-if="loaded_img_url !== null">
                <img :src="loaded_img_url">
              </div>
              <b-upload v-model="sel_file" @input="changeImg($event)">
                <a class="button btn-upload">{{ file_name !== '' ? file_name : 'UPLOAD' }}</a>
              </b-upload>
              <a
                class="button btn-upload"
                v-if="load_img !== null && sel_file.length < 1"
                @click.prevent="tglRemove"
              >{{ logo_remove === true ? 'Reset Logo': 'Remove Logo' }}</a>
              <a
                v-if="sel_file.length > 0"
                @click.prevent="clearSelect"
                class="clear-selection"
              >Clear Selection</a>
              <p
                v-if="logo_remove === true"
                class="control has-text-danger"
              >Remove Logo required to update form.</p>
            </div>

            <div class="d-flex">
              <button class="button btn-des-1" type="submit">
                <b-icon icon="edit" style="margin-top: 2px;"></b-icon>&nbsp;&nbsp;&nbsp;&nbsp;Update Partner
              </button>
              <button
                class="button btn-des-1 dark"
                type="button"
                @click.prevent="modalAct=false;"
              >Cancel</button>
            </div>
          </form>

          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import mxn_modal from "~/mixins/modal.js";
import _ from "lodash";
import { mask } from "vue-the-mask";
import maskPercent from "~/directives/mask-percent.js";
import mxn_cityAC from "~/mixins/city-ac.js";
export default {
  mixins: [mxn_modal, mxn_cityAC],
  directives: {
    mask,
    maskPercent
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  watch: {
    modalAct: function(val) {
      if (val === false) {
        this.closedMD();
      }
    }
  },
  data() {
    return {
      loading: true,
      sel_file: [],
      file_name: "",
      load_data: {},
      load_img: null,
      loaded_img_url: null,
      logo_remove: false,
      f_data: {
        logo: null,
        full_name: "",
        email: "",
        discount: "",
        disc_prds: [],
        cont_num: "",
        address: "",
        city: ""
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
        if (self.validation.isTouched("f_data.email")) {
          let validator = Validator.value(value)
            .required()
            .email()
            .maxLength(100);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (value !== self.load_data.email) {
                return self.$axios
                  .post("/api/partner/check_email", {
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
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/partner/full_info/" + self.id)
        .then(res => {
          self.load_data = res.data.result;
          this.ac_city = res.data.result.city;
          self.f_data = {
            logo: res.data.result.logo,
            full_name: res.data.result.full_name,
            email: res.data.result.email,
            discount: res.data.result.discount + "%",
            disc_prds: res.data.result.disc_prds
              ? res.data.result.disc_prds.split("|")
              : [],
            cont_num: res.data.result.cont_num,
            address: res.data.result.address,
            city: res.data.result.city
          };
        })
        .catch(err => {
          console.log(err);
        });
      if (self.f_data.logo !== null) {
        await self
          .$axios({
            url: "/api/partner/logo/" + self.f_data.logo,
            method: "GET",
            responseType: "blob"
          })
          .then(res => {
            let c_img_url = window.URL.createObjectURL(new Blob([res.data]));
            self.loaded_img_url = c_img_url;
            self.load_img = c_img_url;
          })
          .catch(err => {
            self.loaded_img_url = null;
          });
      }
      self.loading = false;
    },
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
          self.logo_remove = false;
          self.f_data.logo = file;
          self.file_name = file.name;
          let reader = new FileReader();
          reader.onload = e => {
            self.loaded_img_url = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      } else {
        self.sel_file = [];
        self.file_name = "";
        self.loaded_img_url = self.load_img !== null ? self.load_img : null;
        self.$toast.open({
          duration: 3000,
          message: msg,
          position: "is-bottom",
          type: "is-danger"
        });
      }
    },
    clearSelect() {
      this.sel_file = [];
      this.f_data.logo = null;
      this.file_name = "";
      this.loaded_img_url = this.load_img !== null ? this.load_img : null;
    },
    tglRemove() {
      this.logo_remove = !this.logo_remove;
      if (this.logo_remove === true) {
        this.loaded_img_url = null;
        this.f_data.logo = null;
      } else {
        this.loaded_img_url = this.load_img;
      }
    },
    update: function() {
      const self = this;
      self.loading = true;
      self.$validate().then(function(success) {
        if (success) {
          let form_data = new FormData();

          if (
            typeof self.f_data.logo === "string" ||
            (self.load_data.logo !== null &&
              self.f_data.logo === null &&
              self.logo_remove !== true)
          ) {
          } else if (
            typeof self.f_data.logo !== "string" &&
            self.f_data.logo === null
          ) {
            if (self.logo_remove === true) {
              form_data.append("logo_remove", self.load_data.logo);
            } else {
            }
          } else {
            form_data.append("logo", self.f_data.logo);
            form_data.append("logo_remove", self.load_data.logo);
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
          form_data.append("update_id", self.id);

          let config = {
            headers: { "content-type": "multipart/form-data" }
          };
          self.$axios
            .post("/api/partner/update", form_data, config)
            .then(res => {
              self.modalAct = false;
              self.$emit("updated", true);
              self.loading = false;
              self.$toast.open({
                duration: 3000,
                message: "Successfully Update Partner.",
                position: "is-bottom",
                type: "is-success"
              });
            })
            .catch(err => {
              console.log(err);
              self.loading = false;
              self.$toast.open({
                duration: 3000,
                message: "Server Error.",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        } else {
          self.loading = false;
        }
      });
    },
    closedMD: function() {
      this.file_name = "";
      this.logo_remove = false;
      this.loaded_img_url = null;
      this.sel_file = [];
      this.load_data = {};
      this.load_img = null;
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
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.md-info /deep/ {
  .section {
    min-height: 200px;

    .form {
      .field {
        .label {
          font-size: 18px;
          line-height: 18px;
          color: #828282;
        }

        .img-cont {
          max-width: 150px;
        }
      }

      .btn-upload {
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
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

    .d-flex {
      @media screen and (min-width: 426px) {
        display: flex;
        justify-content: center;
      }

      & > .button {
        @media screen and (max-width: 425px) {
          width: 100%;
        }

        &:last-child {
          @media screen and (min-width: 426px) {
            margin-left: 1rem;
          }
        }
      }
    }
  }
}
</style>