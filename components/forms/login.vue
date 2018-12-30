<template lang="pug">
  .wrapper
    .logo
      img(src="~/assets/img/logo-footer.png")
    .section
      form.form(v-on:submit.prevent="submit")
        p.error(v-if="form.err !== ''") {{ form.err }}
        p.success(v-if="form.suc !== ''") {{ form.suc }}
        b-field(label="Email / MJ Supreme ID" :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')")
          b-input(type="text" placeholder="example@app.com/000010001" v-model="email")

        b-field(label="Password" :addons="false" :type="(validation.hasError('password')) ? 'is-danger':''" :message="validation.firstError('password')")
          a.control.fp_link(@click.prevent="$store.commit('isForgotPasswordSet', true)") Forgot ?
          b-input(type="password" placeholder="******" v-model="password")

        b-field.has-text-centered.my-2
          button.button.btn-des-1(type="submit") Login
        b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
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
            .post("/api/web/login", {
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
                  // if (res.data.user.is_paid === 1) {
                  //   self.$router.push("/dashboard");
                  // } else {
                  //   self.$router.push("/user/profile");
                  // }
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
.wrapper {
  .logo {
    text-align: center;
    padding: 20px;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ebeced;

    &:after {
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
    padding: 1.5rem 4rem 0;
  }
}
</style>
