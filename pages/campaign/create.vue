<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Campaign Create</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="submit">
            <b-field grouped>
              <b-field
                expanded
                label="Campaign Start"
                :type="(validation.hasError('f_data.start_date')) ? 'is-danger':''"
                :message="validation.firstError('f_data.start_date')"
              >
                <b-datepicker
                  placeholder="Start Date"
                  :max-date="max_date"
                  v-model="f_data.start_date"
                ></b-datepicker>
              </b-field>
              <b-field
                expanded
                label="Campaign End"
                :type="(validation.hasError('f_data.end_date')) ? 'is-danger':''"
                :message="validation.firstError('f_data.end_date')"
              >
                <b-datepicker placeholder="End Date" :min-date="min_date" v-model="f_data.end_date"></b-datepicker>
              </b-field>
            </b-field>
            <b-field
              class="v-flex-center"
              label="Campaign Image"
              :type="(validation.hasError('f_data.img')) ? 'is-danger':''"
              :message="validation.firstError('f_data.img')"
            >
              <b-upload v-model="sel_file" @input="changeImg($event)">
                <a class="button btn-upload">{{ file_name !== '' ? file_name : 'UPLOAD' }}</a>
              </b-upload>
              <a
                v-if="f_data.img !== null"
                @click.prevent="f_data.img=null;sel_file=[];file_name=''"
                class="clear-selection"
              >Clear Selection</a>
            </b-field>
            <b-field>
              <p class="control">
                <button type="submit" class="button btn-des-1">Save</button>
              </p>
            </b-field>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  computed: {
    min_date: function() {
      if (this.f_data.start_date !== null) {
        return new Date(moment(this.f_data.start_date).add(1, "d"));
      } else {
        return null;
      }
    },
    max_date: function() {
      if (this.f_data.end_date !== null) {
        return new Date(moment(this.f_data.end_date).subtract(1, "d"));
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      sel_file: [],
      file_name: "",
      f_data: {
        start_date: null,
        end_date: null,
        img: null
      }
    };
  },
  validators: {
    "f_data.start_date": function(value) {
      return Validator.value(value).required();
    },
    "f_data.end_date": function(value) {
      return Validator.value(value).required();
    },
    "f_data.img": function(value) {
      return Validator.value(value).required();
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
          self.f_data.img = file;
          self.file_name = file.name;
        }
      } else {
        // self.profile_img_url = null;
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
      self.$validate().then(function(success) {
        if (success) {
          self.$toast.open({
            duration: 1000,
            message: "Successfully Submitted!",
            position: "is-bottom",
            type: "is-success"
          });
          self.reset();
          // let form_data = new FormData();
          // if (self.f_data.logo !== null) {
          //   form_data.append("logo", self.f_data.logo);
          // }

          // form_data.append("address", self.f_data.address);
          // form_data.append("city", self.f_data.city);
          // form_data.append("cont_num", self.f_data.cont_num);
          // form_data.append("discount", self.f_data.discount.replace("%", ""));
          // form_data.append("email", self.f_data.email);
          // form_data.append("full_name", self.f_data.full_name);

          // let config = {
          //   headers: { "content-type": "multipart/form-data" }
          // };
          // self.$axios
          //   .post("/api/partner/add", form_data, config)
          //   .then(res => {
          //     self.reset();
          //     self.form.loading = false;
          //     self.form.suc = "Successfully Partner Added.";
          //     setTimeout(() => (self.form.suc = ""), 2000);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //     self.form.loading = false;
          //     self.form.err = "Server Error!";
          //     $(".main-content").animate({ scrollTop: 20 }, 500);
          //   });
        }
      });
    },
    reset() {
      this.f_data = {
        start_date: null,
        end_date: null,
        img: null
      };
      this.file_name = "";
      this.sel_file = [];
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
