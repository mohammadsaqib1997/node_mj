<template>
  <div class="token-cont">
    <div class="wrapper">
      <div class="logo">
        <nuxt-link to="/">
          <img src="~/assets/img/logo-footer.png" alt="MJ SUPREME">
        </nuxt-link>
      </div>
      <div class="section">
        <h1 :class="{title: true, 'has-text-success':status===1, 'has-text-danger':status===2}">{{ prc_title }}</h1>
        <form v-if="type === 1" class="form" @submit.prevent="updatePass">
          <b-field :type="(validation.hasError('f_data.new_pass')) ? 'is-danger':''" :message="validation.firstError('f_data.new_pass')">
            <b-input type="password" placeholder="Enter New Password" v-model="f_data.new_pass" autocomplete="off"></b-input>
          </b-field>
          <b-field :type="(validation.hasError('f_data.pass')) ? 'is-danger':''" :message="validation.firstError('f_data.pass')">
            <b-input type="password" placeholder="Re-Type Password" v-model="f_data.pass" autocomplete="off"></b-input>
          </b-field>
          <b-field>
            <p class="control has-text-centered">
              <button class="button btn-des-1">Change</button>
            </p>
          </b-field>
        </form>
        <nuxt-link v-if="(status===1 || status===2) && loading == false && type === 0" to="/" class="button">Go To Home</nuxt-link>
        <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "simple",
  async mounted() {
    const self = this;
    self.loading = true;
    self.prc_title = "Verifying Token...";
    self.status = 0;
    self.type = 0;

    let token = self.$route.params.token;
    if (typeof token !== "undefined") {
      await self.$axios
        .get("/api/verify-token/check/" + token)
        .then(res => {
          if (res.data.status === true) {
            if (res.data.type === 0) {
              self.prc_title = "Your email is successfully verified.";
              self.status = 1;
              self.type = 0;
              self.loading = false;
              self.timeOutInterval = setTimeout(function() {
                self.$router.push("/");
              }, 5000);
            } else if (res.data.type === 1) {
              self.prc_title = "New Password";
              self.type = 1;
              self.loading = false;
            } else if (res.data.type === 2) {
              self.prc_title = "Your pincode is successfully verified.";
              self.status = 1;
              self.type = 0;
              self.loading = false;
              self.timeOutInterval = setTimeout(function() {
                self.$router.push("/");
              }, 5000);
            } else {
              self.prc_title = "Your token is successfully verified.";
              self.status = 1;
              self.type = 0;
              self.loading = false;
              self.timeOutInterval = setTimeout(function() {
                self.$router.push("/");
              }, 5000);
            }
          } else {
            self.prc_title = res.data.message;
            self.status = 2;
            self.loading = false;
            self.timeOutInterval = setTimeout(function() {
              self.$router.push("/");
            }, 5000);
          }
        })
        .catch(err => {
          console.log(err);
          self.prc_title = "Request Error!";
          self.status = 2;
          self.loading = false;
          self.timeOutInterval = setTimeout(function() {
            self.$router.push("/");
          }, 5000);
        });
    } else {
      self.prc_title = "Invalid Token!";
      self.status = 2;
      self.loading = false;
      self.timeOutInterval = setTimeout(function() {
        self.$router.push("/");
      }, 5000);
    }
  },
  destroyed() {
    if (this.timeOutInterval !== null) {
      clearTimeout(this.timeOutInterval);
    }
  },
  data() {
    return {
      timeOutInterval: null,
      prc_title: "Verifying Token...",
      status: 0,
      type: 0,
      loading: false,
      f_data: {
        new_pass: "",
        pass: "",
        submitted: false
      }
    };
  },
  validators: {
    "f_data.new_pass": function(value) {
      const self = this;
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(35);
    },
    "f_data.pass, f_data.new_pass": function(con_pass, password) {
      if (this.f_data.submitted || this.validation.isTouched("f_data.pass")) {
        return Validator.value(con_pass)
          .required()
          .match(password);
      }
    }
  },
  methods: {
    updatePass() {
      const self = this;
      let token = self.$route.params.token;
      self.f_data.submitted = true;

      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/verify-token/change-pass", {
              token,
              password: self.f_data.new_pass
            })
            .then(res => {
              if (res.data.status === true) {
                self.prc_title = "Successfully Change Your Password.";
                self.status = 1;
                self.type = 0;
                self.loading = false;
                setTimeout(function() {
                  self.$router.push("/");
                }, 5000);
              } else {
                self.prc_title = res.data.message;
                self.status = 2;
                self.type = 1;
                self.loading = false;
              }
            })
            .catch(err => {
              console.log(err);
              self.prc_title = "Server Request Error!";
              self.status = 2;
              self.type = 1;
              self.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.token-cont {
  padding: 1rem 0;
  /deep/ {
    .form {
      .help {
        text-align: right;
      }
      .control.has-icons-right .icon.is-right {
        top: 10px;
      }
      .input {
        background-color: #f5f6f7;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        border: 1px solid transparent;
        font-size: 15px;
        color: #3b3f57;
        padding: 16px 35px 16px 20px;
        height: auto;
        &:focus {
          -webkit-box-shadow: 0 0 2px 0 #d9bd68;
          -moz-box-shadow: 0 0 2px 0 #d9bd68;
          box-shadow: 0 0 2px 0 #d9bd68;
          background-color: #ffffff;
        }
        &.is-danger {
          border: 1px solid #ff3860 !important;
          &:focus {
            -webkit-box-shadow: 0 0 2px 0 #ff3860;
            -moz-box-shadow: 0 0 2px 0 #ff3860;
            box-shadow: 0 0 2px 0 #ff3860;
            background-color: #ffffff;
          }
        }
      }
      .btn-des-1 {
        color: #ffffff !important;
        margin: 0.5rem;
        background-color: #ea2378;
        border-radius: 0;
        border: none;
        padding: 1rem 2rem;
        min-height: 3.6rem;
        height: auto;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 14px;
        position: relative;
        -webkit-box-shadow: 0 2px 20px 2px #ccc;
        -moz-box-shadow: 0 2px 20px 2px #ccc;
        box-shadow: 0 2px 20px 2px #ccc;
        &:after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 5px;
          background-color: #c52566;
          bottom: 0;
        }
        &:hover {
          background-color: #c52566;
        }
      }
    }
    .wrapper {
      background-color: white;
      box-shadow: 0 6px 15px 6px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
      border: 1px solid #d9bd68;
      max-width: 450px;
      margin: 0 2rem;
      overflow: auto;
      max-height: calc(100vh - 40px);
      .logo {
        text-align: center;
        padding: 20px;
        margin-bottom: 1rem;
        border-bottom: 2px solid #ebeced;
        &::after {
          content: " ";
          display: block;
          width: 50px;
          height: 2px;
          background: #d9bd68;
          position: relative;
          bottom: -22px;
          margin: 0 auto;
        }
      }
      .section {
        position: relative;
        text-align: center;
        padding: 1rem 2rem 2rem;
        > .title {
          color: #d9bd68;
          font-weight: 100;
        }
        > .button {
          border: 2px solid #d9bd68;
          background-color: #2f3048;
          color: #d9bd68;
          font-weight: 400;
          font-size: 16px;
          border-radius: 0;
          text-transform: uppercase;
          &:focus {
            box-shadow: 0 0 1px 1px rgba(217, 189, 104, 0.3);
          }
        }
        @media screen and (min-width: 425px) {
          min-width: 400px;
        }
      }
    }
  }
}
</style>

