<template lang="pug">
  .container.admin-login
    .wrapper
      .logo
        nuxt-link(to="/")
          img(src="~/assets/img/logo-footer.png")
      .section
        form.form(v-on:submit.prevent="submit")
          p.error(v-if="form.err !== ''") {{ form.err }}
          p.success(v-if="form.suc !== ''") {{ form.suc }}
          b-field(label="Email" :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')")
            b-input(type="text" placeholder="example@app.com" v-model="email")

          b-field(label="Password" :addons="false" :type="(validation.hasError('password')) ? 'is-danger':''" :message="validation.firstError('password')")
            //- a.control.fp_link(@click.prevent="$store.commit('isForgotPasswordSet', true)") Forgot ?
            b-input(type="password" placeholder="******" v-model="password")

          b-field.has-text-centered
            button.button.btn-des-1(type="submit") Login
          b-loading(:is-full-page="true" :active="form.loading" :can-cancel="false")
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "simple",
  mounted() {
    $("html").addClass("is-clipped");
  },
  destroyed() {
    $("html").removeClass("is-clipped");
  },
  data() {
    return {
      email: "",
      password: "",
      form: {
        err: "",
        suc: "",
        loading: false
      }
    };
  },
  validators: {
    email: function(value) {
      return Validator.value(value)
        .required()
        .email()
        .maxLength(100);
    },
    password: function(value) {
      return Validator.value(value)
        .required()
        .minLength(6)
        .maxLength(50);
    }
  },
  methods: {
    async submit(sendRoute) {
      const self = this;
      self.form.loading = false;
      self.form.err = "";
      self.form.suc = "";

      await self.$validate().then(async succ => {
        if (succ) {
          self.form.loading = true;
          await self.$axios
            .post("/api/web/admin/login", {
              email: self.email,
              password: self.password
            })
            .then(res => {
              if (res.data.status) {
                self.form.suc = "Successfully Login!";
                self.$store.dispatch("login", {
                  token: res.data.token,
                  data: res.data.user
                });
                setTimeout(() => {
                  self.form.loading = false;
                  self.$store.commit("loginModalActiveSet", false);
                  self.$router.push("/dashboard");
                }, 1500);
              } else {
                self.form.loading = false;
                self.form.err = res.data.message;
              }
            })
            .catch(err => {
              self.form.loading = false;
              self.form.err = err.message;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-des-1 {
  color: #fff !important;
  margin: 0.5rem;
  background-color: #ea2378;
  border-radius: 0;
  border: none;
  padding: 1rem 2rem;
  min-height: 3.6rem;
  height: auto;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  position: relative;
  -webkit-box-shadow: 0 2px 20px 2px #ccc;
  -moz-box-shadow: 0 2px 20px 2px #ccc;
  box-shadow: 0 2px 20px 2px #ccc;
  &::after {
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
.admin-login {
  padding: 1rem 0;
  /deep/ {
    .wrapper {
      background-color: white;
      box-shadow: 0 6px 15px 6px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
      border: 1px solid #d9bd68;
      max-width: 450px;
      margin: 0 auto;
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
        padding: 1.5rem 4rem;
        .form {
          .control.has-icons-right .icon.is-right {
            top: 10px;
          }
          .error,
          .success {
            font-size: 18px;
            text-align: center;
            margin-bottom: 1rem;
            font-weight: 100;
          }
          .error {
            color: #ff3860;
          }
          .success {
            color: #23d160;
          }
          .field {
            position: relative;
            .fp_link {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 14px;
              text-decoration: underline;
              color: #989898;
            }
          }
          .label {
            font-weight: 100;
            line-height: inherit;
            font-size: inherit;
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
            &:active,
            &:focus {
              -webkit-box-shadow: 0 0 2px 0 #d9bd68;
              -moz-box-shadow: 0 0 2px 0 #d9bd68;
              box-shadow: 0 0 2px 0 #d9bd68;
              background-color: #fff;
            }
            &.is-danger {
              border: 1px solid #ff3860 !important;
              &:active,
              &:focus {
                -webkit-box-shadow: 0 0 2px 0 #ff3860;
                -moz-box-shadow: 0 0 2px 0 #ff3860;
                box-shadow: 0 0 2px 0 #ff3860;
                background-color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>


