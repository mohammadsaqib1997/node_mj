<template lang="pug">
  .wrapper
    .logo
      img(src="~/assets/img/logo-footer.png")
    .section
      form.form(v-on:submit.prevent="submit")
        p.error(v-if="form.err !== ''") {{ form.err }}
        p.success(v-if="form.suc !== ''") {{ form.suc }}
        b-field(label="Enter your E-mail or MJ-ID below to reset your password." :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')")
          b-input(type="text" placeholder="(eg: abc@example.com or 000000000)" v-model="email")

        b-field.has-text-centered.my-2(:addons="false")
          button.button.btn-des-1(type="submit") Send
          a.link(@click.prevent="$store.commit('isForgotPasswordSet', false)") Login Account!
        b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  data() {
    return {
      email: "",
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
            .post("/api/email/forgot-password", {
              email: self.email
            })
            .then(res => {
              if (res.data.status === true) {
                self.email = "";
                self.validation.reset();
                self.form.suc =
                  "Successfully new password token sent to your e-mail. Please check your e-mail address.";
                setTimeout(() => {
                  self.form.suc = "";
                }, 5000);
              } else {
                self.form.err = res.data.message;
              }
            })
            .catch(err => {
              console.log(err);
              self.form.err = "Server Request Error!";
            });
          self.form.loading = false;
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
    .form {
      .link {
        display: block;
        margin-top: 10px;
        text-transform: uppercase;
        font-size: 13px;
        text-decoration: underline;
        color: gray;
      }
    }
  }
}
</style>
