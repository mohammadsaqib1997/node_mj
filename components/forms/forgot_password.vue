<template lang="pug">
  .wrapper
    .logo
      img(src="~/assets/img/logo-footer.png")
    .section
      form.form(v-on:submit.prevent="submit")
        p.error(v-if="form.err !== ''") {{ form.err }}
        p.success(v-if="form.suc !== ''") {{ form.suc }}
        b-field(label="Enter your e-mail address below to reset your password." :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')")
          b-input(type="text" placeholder="(example: abc@example.com)" v-model="email")

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
        .email()
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
          setTimeout(() => {
            self.form.loading = false;
            self.email = "";
            self.validation.reset()
            self.form.suc = "Successfully change your password. Please check your email address.";
            setTimeout(() => {
              self.form.suc = ""
            }, 2000);
          }, 1500);
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.wrapper
    .logo
        text-align: center
        padding: 20px
        margin-bottom: 1rem
        border-bottom: 2px solid #ebeced
        &:after
            content: ' '
            display: block
            width: 50px
            height: 2px
            background: #d9bd68
            position: relative
            bottom: -22px
            margin: 0 auto
    .section
        position: relative
        padding: 1.5rem 4rem 0
        .form
            .link
                display: block
                margin-top: 10px
                text-transform: uppercase
                font-size: 13px
                text-decoration: underline
                color: gray
                
</style>
