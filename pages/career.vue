<template lang="pug">
  .wrapper
    section.section
      .container.main
        .columns
          .column.is-4
            h1.title-1 Career
            p.txt-wrp
              | With a collective experience spanning
              |  more than three decades and a solid
              |  reputation for excellence,
              |  we are uncompromising in our commitment
              |  to integrated solutions and Members Satisfaction. 
              |  If you would like to apply for a position,
              |  please Fill the form.

          #formCareerCon.column.is-6.is-offset-1
            .tab-des-1
              .tab-header
                .columns.is-gapless
                  .column
                    .t-emp.active
                      span START A PROSPEROUS CAREER WITH US

              .tab-body
                .tab-content.active
                  template(v-if="!submitted")
                    form.form(@submit.prevent="submitCareer")
                      p.error(v-if="err !== ''") {{ err }}
                      b-field(grouped)
                        b-field(label="Full Name" :type="(validation.hasError('form.full_name')) ? 'is-danger':''" :message="validation.firstError('form.full_name')" expanded)
                          b-input(type="text" placeholder="(example: Shabir Ahmed)" v-model="form.full_name")
                        b-field(label="Email" :type="(validation.hasError('form.email')) ? 'is-danger':''" :message="validation.firstError('form.email')" expanded)
                          b-input(type="email" placeholder="Your Email" v-model="form.email")
                        
                      b-field(grouped)
                        b-field(label="Contact No." :type="(validation.hasError('form.cont_number')) ? 'is-danger':''" :message="validation.firstError('form.cont_number')" expanded)
                          b-input(type="text" placeholder="Enter Contact Number" v-model="form.cont_number" v-mask="'92-###-###-####'")
                        b-field(label="Upload CV" :type="(validation.hasError('form.file')) ? 'is-danger':''" :message="validation.firstError('form.file')")
                          b-upload(@input="fileChange")
                            a.button.upld-btn
                              b-icon(icon="upload")
                              span {{ file_name !== null ? file_name: 'Click To Upload CV' }}

                      b-field.captcha-cont(:type="(validation.hasError('form.captcha')) ? 'is-danger':''" :message="validation.firstError('form.captcha')")
                        vueRecaptcha(ref="vue-captcha-ref" :sitekey="captcha_key" @verify="captchaTr" @expired="captchaExpTr")

                      .btn-cont
                        button.button.btn-des-1(type="submit") Submit

                      b-loading(:is-full-page="false" :active="loading" :can-cancel="false")

                  .confirmation-con(v-else)
                    //- .txt-content
                    //-   | Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    //-   | Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    //-   | when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    .img-heading
                      img(src="~/assets/img/checked.png")
                      h1 Your Application Successfully Submitted.
                

              //- .tab-footer
              //-   button.button.btn-des-1(@click.prevent="submitCareer")
              //-     | Submit
</template>

<script>
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
      err: "",
      loading: false,
      submitted: false,
      file_name: null,
      form: {
        full_name: "",
        email: "",
        cont_number: "",
        file: null
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
    "form.file": function(value) {
      return Validator.value(value).required();
    },
    "form.captcha": function(value) {
      return Validator.value(value).required();
    }
  },
  methods: {
    mimetype_check(file) {
      return (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/rtf" ||
        file.type === "text/plain" ||
        file.type === "image/photoshop" ||
        file.type === "image/x-photoshop" ||
        file.type === "image/psd" ||
        file.type === "application/photoshop" ||
        file.type === "application/psd" ||
        file.type === "zz-application/zz-winassoc-psd"
      );
    },
    fileChange(event) {
      this.form.file = null;
      this.file_name = null;
      if (this.mimetype_check(event[0])) {
        if (event[0].size <= 5000000) {
          this.form.file = event[0];
          this.file_name = event[0].name;
        } else {
          this.$toast.open({
            duration: 3000,
            message: "Maximum Upload File Size Is 5MB!",
            position: "is-bottom",
            type: "is-danger"
          });
        }
      } else {
        this.$toast.open({
          duration: 3000,
          message:
            "Invalid File Selected! Valid types: .pdf, .doc, .docx, .rtf, .txt, .jpeg, .png, .jpg, .psd",
          position: "is-bottom",
          type: "is-danger"
        });
      }
    },
    submitCareer() {
      const self = this;
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          let form_data = new FormData();
          form_data.append("full_name", self.form.full_name);
          form_data.append("email", self.form.email);
          form_data.append("cont_number", self.form.cont_number);
          form_data.append("captcha", self.form.captcha);
          form_data.append("cv", self.form.file, self.form.file.name);
          let config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };
          await self.$axios
            .post("/api/email/career", form_data, config)
            .then(res => {
              if (res.data.status === true) {
                self.resetForm();
                self.submitted = true;
                self.animateDiv('#formCareerCon')
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
        file: null
      };
      this.file_name = null;
      this.captchaExpTr();
      this.validation.reset();
    },
    animateDiv: function(divName) {
      $("html, body").animate({ scrollTop: $(divName).offset().top }, 500);
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  color: #393e50;
  .txt-wrp {
    margin-top: 2rem;
  }
  .form {
    .error {
      font-size: 22px;
      font-weight: 400;
    }
    .upld-btn {
      border-style: dashed;
      height: auto;
      padding: 14px 35px 14px 20px;
      width: 300px;
      color: #3b3f58;
      // max-width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      white-space: nowrap;
    }
  }
  .status_items {
    margin-top: 2rem;
    text-transform: uppercase;
    font-size: 15px;
    color: #828384;
    .item {
      position: relative;
      padding-left: 35px;
      padding-bottom: 50px;
      &:first-child {
        &:before {
          content: none;
        }
      }
      &:before {
        content: " ";
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: #dddfe0;
        left: 4.5px;
        bottom: calc(100% - 16px);
      }
      &:after {
        content: " ";
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #dddfe0;
        left: 0;
        top: 6px;
        border-radius: 100%;
      }
      &.complete {
        color: #2d2e30;
        &:after,
        &:before {
          background-color: #f3257f;
        }
      }
    }
  }
  .tab-des-1 {
    min-height: 100%;
    background-color: white;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 15px #cccccc;
    .tab-header {
      text-align: center;
      text-transform: uppercase;
      color: #9197b8;
      background-color: #3b3f58;
      border-radius: 5px 5px 0 0;
      .t-emp {
        position: relative;
        padding: 35px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 2px solid #9197b8;
        &.active {
          border-bottom: 2px solid #d9bd68;
          color: white;
        }
        &:before {
          content: " ";
          display: block;
          width: 100%;
          height: 50px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          margin-bottom: 12px;
        }
      }
      .t-emp {
        &.active {
          &:before {
            background-image: url("/img/emp-icon-active.png");
          }
        }
      }
    }
    .tab-body {
      .tab-content {
        display: none;
        padding: 25px;
        &.active {
          display: block;
        }
        .activation-con,
        .confirmation-con {
          h1 {
            text-transform: uppercase;
            font-size: 2rem;
            font-weight: 300;
          }
          @media screen and (min-width: 425px) {
            padding: 2rem;
            .img-heading {
              display: flex;
              justify-content: center;
              align-items: center;
              h1 {
                margin: 0 1.5rem;
              }
            }
          }
          @media screen and (max-width: 424px) {
            .img-heading {
              margin-top: 3rem;
              text-align: center;
              h1 {
                margin: 1rem 0;
              }
            }
          }
        }
      }
    }
    .tab-footer {
      padding: 2rem;
      text-align: center;
    }
  }
}
// .main
//   color: #393e50
//   .txt-wrp
//     margin-top: 2rem
//   .status_items
//       margin-top: 2rem
//       text-transform: uppercase
//       font-size: 15px
//       color: #828384
//       .item
//           position: relative
//           padding-left: 35px
//           padding-bottom: 50px
//           &:first-child
//               &:before
//                   content: none
//           &:before
//               content: ' '
//               position: absolute
//               width: 1px
//               height: 100%
//               background-color: #dddfe0
//               left: 4.5px
//               bottom: calc(100% - 16px)
//           &:after
//               content: ' '
//               position: absolute
//               width: 10px
//               height: 10px
//               background-color: #dddfe0
//               left: 0
//               top: 6px
//               border-radius: 100%

//           &.complete
//               color: #2d2e30
//               &:after, &:before
//                   background-color: #f3257f
// .tab-des-1
//   min-height: 100%
//   background-color: #ffffff
//   border-radius: 5px
//   position: relative
//   box-shadow: 0 1px 15px #ccc
//   .tab-header
//     text-align: center
//     text-transform: uppercase
//     color: #9197b8
//     background-color: #3b3f58
//     border-radius: 5px 5px 0 0
//     .t-emp
//       position: relative
//       padding: 35px
//       font-size: 14px
//       font-weight: bold
//       border-bottom: 2px solid #9197b8
//       &.active
//         border-bottom: 2px solid #d9bd68
//         color: #fff
//       &:before
//         content: ' '
//         display: block
//         width: 100%
//         height: 50px
//         background-repeat: no-repeat
//         background-position: center
//         background-size: contain
//         margin-bottom: 12px
//     .t-emp
//       &.active
//         &:before
//           background-image: url("/img/emp-icon-active.png")

//   .tab-body
//     .tab-content
//       display: none
//       padding: 25px
//       &.active
//         display: block
//       .activation-con, .confirmation-con
//         h1
//           text-transform: uppercase
//           font-size: 2rem
//           font-weight: 300
//         @media screen and (min-width: 425px)
//           padding: 2rem
//           .img-heading
//             display: flex
//             justify-content: center
//             align-items: center
//             margin-top: 6rem
//             h1
//               margin: 0 1.5rem
//         @media screen and (max-width: 424px)
//           .img-heading
//             margin-top: 3rem
//             text-align: center
//             h1
//               margin: 1rem 0
//   .tab-footer
//     padding: 2rem
//     text-align: center
</style>
