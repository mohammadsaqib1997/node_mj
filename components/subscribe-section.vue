<template>
  <div class="section subscribe" :class="{ 'is-simple': simple }">
    <div class="container">
      <div class="columns sbs-cont is-variable is-7">
        <div class="column is-narrow">
          <img src="~/assets/img/sbs-email.png">
        </div>
        <div class="column is-6">
          <h1 class="title-1">Subscribe</h1>
          <p class="txt">Subscribe to our newsletter for latest updates on up-coming products, special offers and
            exculives insights to get more out of your membership.</p>
        </div>
        <div class="column is-4 form">
          <b-field grouped>
            <b-field expanded :type="(validation.hasError('email')) ? 'is-danger':''" :message="validation.firstError('email')">
              <b-input type="email" v-model="email" placeholder="Enter E-mail" :loading="validation.isValidating('email')"></b-input>
            </b-field>
            <p class="control">
              <button class="button btn-des-1" @click.prevent="subscribe">Subscribe Now</button>
            </p>
          </b-field>

        </div>
      </div>
    </div>
    <b-loading :active="loading"></b-loading>
  </div>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  props: {
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      submitted: false,
      email: ""
    };
  },
  validators: {
    email: {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        if (self.submitted || self.validation.isTouched("email")) {
          let validator = Validator.value(value)
            .required()
            .email()
            .maxLength(100);
          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              return self.$axios
                .post("/api/email/subs_email", {
                  email: value
                })
                .then(res => {
                  if (res.data.count > 0) {
                    return "This email is already subscribed.";
                  }
                });
            });
          }
        }
      }
    }
  },
  methods: {
    subscribe() {
      const self = this;
      self.loading = true;
      self.submitted = true;
      self.$validate().then(function(success) {
        if (success) {
          self.$axios
            .post("/api/email/subscribe", {
              email: self.email
            })
            .then(res => {
              self.loading = false;
              self.email = "";
              self.submitted = false;
              self.validation.reset();
              self.$toast.open({
                duration: 3000,
                message: "Successfully Subscribed.",
                position: "is-bottom",
                type: "is-success"
              });
            })
            .catch(err => {
              self.loading = false;
              console.log(err);
              self.$toast.open({
                duration: 3000,
                message: "Server Error!",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        } else {
          self.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.subscribe {
  background-color: white;
  position: relative;

  &.is-simple {
    box-shadow: 0 -2px 15px -4px #e6e6e6;
  }

  &:not(.is-simple) {
    margin-top: 3rem;

    &:before {
      content: " ";
      position: absolute;
      top: -30px;
      left: 0;
      right: 0;
      background-color: white;
      height: 4rem;
      transform: rotate(-2deg);
      box-shadow: 0 -3px 10px -3px rgba(204, 204, 204, 0.3);
    }
  }

  @media screen and (min-width: 769px) {
    padding-bottom: 5rem;
  }

  /deep/ {
    .form {
      .btn-des-1 {
        margin-top: 0;
        min-height: 0;
        padding: 17px 25px;
      }
    }
  }

  .sbs-cont {
    align-items: center;

    h1.title-1 {
      font-size: 32px;
      padding-bottom: 6px;
    }

    p.txt {
      margin-top: 1rem;
      font-size: 16px;
      padding-right: 8rem;
      color: #4c4c4c;
    }

    .sbs-btn {
      background-color: #db3279;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 16px;
      padding: 10px 34px;
      height: auto;
      border: none;
      border-bottom: 4px solid #ba2b67;

      &:focus {
        box-shadow: 0 0 5px 1px rgba(219, 50, 121, 0.5);
      }
    }
  }
}
</style>