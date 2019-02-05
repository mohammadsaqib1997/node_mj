<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        .columns
          .column.info-cont.is-4
            h1.title-1 Contact
            p.txt-wrp 
              | TOGETHER WE FORM
              br
              | AN UNSHAKABLE ETHOS
              br
              | OF COLLABORATION.
              br
              | MJ SUPREME Elegantly doing business.
              br
              | Feel free to Contact us should you require any further information or Queries.

            .img-cont
              img(src="~/assets/img/support-img.png")
          .column.form-cont.is-6.is-offset-1
            form.form(@submit.prevent="contactSbt")
              p.error(v-if="err !== ''") {{ err }}
              p.success(v-if="suc !== ''") {{ suc }}
              b-field(grouped)
                b-field(label="Full Name" :type="(validation.hasError('form.full_name')) ? 'is-danger':''" :message="validation.firstError('form.full_name')" expanded)
                  b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="form.full_name")
                b-field(label="Email" :type="(validation.hasError('form.email')) ? 'is-danger':''" :message="validation.firstError('form.email')" expanded)
                  b-input(type="email" placeholder="Your Email" v-model="form.email")
                
              b-field(grouped)
                b-field(label="Contact No." :type="(validation.hasError('form.cont_number')) ? 'is-danger':''" :message="validation.firstError('form.cont_number')" expanded)
                  b-input(type="text" placeholder="Enter Contact Number" v-model="form.cont_number" v-mask="'92-###-###-####'")
                b-field(label="Subject" :type="(validation.hasError('form.subject')) ? 'is-danger':''" :message="validation.firstError('form.subject')" expanded)
                  b-input(type="text" placeholder="Subject" v-model="form.subject")

              b-field(label="Message" :type="(validation.hasError('form.message')) ? 'is-danger':''" :message="validation.firstError('form.message')")
                b-input(type="textarea" placeholder="Type your message here ..." v-model="form.message")

              b-field.captcha-cont(:type="(validation.hasError('form.captcha')) ? 'is-danger':''" :message="validation.firstError('form.captcha')")
                vueRecaptcha(ref="vue-captcha-ref" :sitekey="captcha_key" @verify="captchaTr" @expired="captchaExpTr")

              .btn-cont
                button.button.btn-des-1(type="submit") Submit

              b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
        hr
        h1.title-1.center SOCIALIZE WITH US
        ul.social_icons
          li.sc_icon
            a(href="https://www.facebook.com/mjsupremeofficial/" target="_blank")
              b-icon(icon="facebook-f" size="is-small" pack="fab")
          li.sc_icon
            a(href="https://www.instagram.com/mjsupremeofficial/" target="_blank")
              b-icon(icon="instagram" size="is-small" pack="fab")
          li.sc_icon
            a(href="https://twitter.com/MjSupreme5?lang=en" target="_blank")
              b-icon(icon="twitter" size="is-small" pack="fab")
          //- li.sc_icon
          //-   a(href="https://plus.google.com/b/110755905975639745647/110755905975639745647" target="_blank")
          //-     b-icon(icon="google-plus-g" size="is-small" pack="fab")
          li.sc_icon
            a(href="https://www.pinterest.com/mjsupremeofficial" target="_blank")
              b-icon(icon="pinterest-p" size="is-small" pack="fab")
          li.sc_icon
            a(href="https://www.youtube.com/channel/UC0rvk78JHBZ2rPEkgf2iJlg" target="_blank")
              b-icon(icon="youtube" size="is-small" pack="fab")
          li.sc_icon
            a(href="https://mjsupremeofficial.wixsite.com/home" target="_blank")
              b-icon(icon="wix" size="is-small" pack="fab")
</template>

<script>
import _ from "lodash";
import vueRecaptcha from "vue-recaptcha";
import { mask } from "vue-the-mask";
import mxn_vueCaptcha from "~/mixins/vue-captcha.js";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  mixins: [mxn_vueCaptcha],
  directives: {
    mask
  },
  data() {
    return {
      loading: false,
      suc: "",
      err: "",
      form: {
        full_name: "",
        email: "",
        cont_number: "",
        subject: "",
        message: ""
      }
    };
  },
  validators: {
    "form.full_name": function(value) {
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
    "form.email": function(value) {
      return Validator.value(value)
        .required()
        .email()
        .maxLength(100);
    },
    "form.cont_number": function(value) {
      return Validator.value(value)
        .required()
        .regex(
          /^\92-\d{3}-\d{3}-\d{4}$/,
          "Invalid Contact Number(e.g 92-000-000-0000)"
        );
    },
    "form.subject": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(50);
    },
    "form.message": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(250);
    },
    "form.captcha": function(value) {
      return Validator.value(value).required();
    }
  },
  methods: {
    contactSbt(e) {
      const self = this;
      self.suc = "";
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/email/contact", self.form)
            .then(res => {
              if (res.data.status === true) {
                self.resetForm();
                self.suc = "Thank Your For Contact Us.";
                setTimeout(function() {
                  self.suc = "";
                }, 5000);
              } else {
                self.err = res.data.message;
                if (res.data.err_code === "111") {
                  self.captchaExpTr();
                }
              }
            })
            .catch(err => {
              console.log(err);
              self.err = "Server Request Error!";
            });
          $("html, body").animate(
            { scrollTop: $(".form-cont").offset().top },
            500
          );
          self.loading = false;
        }
      });
    },
    resetForm() {
      this.form = {
        captcha: null,
        full_name: "",
        email: "",
        cont_number: "",
        subject: "",
        message: ""
      };
      this.captchaExpTr();
      this.validation.reset();
    }
  }
};
</script>

<style scoped lang="scss">
hr {
  margin: 3rem auto;
}
.sct-1 {
  .info-cont {
    .txt-wrp {
      margin-top: 2rem;
    }
    .img-cont {
      text-align: center;
      margin: 3rem auto;
    }
  }
  .form-cont {
    .form {
      position: relative;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 1px 15px #cccccc;
      padding: 2rem 1.5rem;
      .success,
      .error {
        font-size: 22px;
        font-weight: 400;
      }
      .field.is-grouped {
        &:not(:last-child) {
          margin-bottom: 0.5rem;
        }
      }
      .btn-cont {
        text-align: center;
      }
    }
  }
  .map-cont {
    min-height: 420px;
    height: 100%;
    box-shadow: 2px 2px 5px 3px #e2e2e2;
  }
  ul.social_icons {
    text-align: center;
    margin: 2rem auto;
    li.sc_icon {
      display: inline-block;
      margin: 0 1rem;
      a {
        box-shadow: 2px 2px 5px 3px #e2e2e2;
        background-color: #dabd67;
        height: 70px;
        width: 70px;
        display: block;
        text-align: center;
        line-height: 70px;
        border-radius: 100%;
        color: #f5f6f7;
        font-size: 2rem;
      }
    }
  }
}
</style>
