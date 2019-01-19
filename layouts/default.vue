<template lang="pug">
  .bg-color
    template(v-if="$store.state.pageLoading === false")
      top-header
      navbar-comp
      nuxt
      footer-comp
      b-modal.login-modal(:active.sync="loginModalActive" v-on:close="modalCloseTr" :has-modal-card="true" :canCancel="['outside']")
        .modal-card
          section.modal-card-body
            login-form(v-if="!isForgotPass")
            forgot-pass-form(v-else)
</template>

<script>
import topHeader from "~/components/TopHeader.vue";
import navbarComp from "~/components/NavbarComp.vue";
import footerComp from "~/components/FooterComp.vue";
import loginForm from "~/components/forms/login.vue";
import forgotPassForm from "~/components/forms/forgot_password.vue";

export default {
  //comment-in-dev-start
  head: {
    script: [
      {
        src: "https://consent.cookiebot.com/uc.js",
        id: "Cookiebot",
        "data-cbid": "560ee249-27e9-4c7e-aba3-46dcedf5de68",
        type: "text/javascript",
        async: true
      }
    ]
  },
  //comment-in-dev-end
  components: {
    topHeader,
    navbarComp,
    footerComp,
    loginForm,
    forgotPassForm
  },
  computed: {
    loginRootActive: function() {
      return this.$store.state.loginModalActive;
    },
    isForgotPass: function() {
      return this.$store.state.isForgotPassword;
    }
  },
  data() {
    return {
      socket: null,
      loginModalActive: this.loginRootActive
    };
  },
  watch: {
    loginRootActive: function(val) {
      this.loginModalActive = val;
    },
    loginModalActive: function(val) {
      this.$store.commit("loginModalActiveSet", val);
    }
  },
  methods: {
    modalCloseTr() {
      this.$store.commit("isForgotPasswordSet", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-color {
  background-color: #f5f6f7;

  & /deep/ {
    hr {
      background-color: #cccccc;
      height: 1px;
    }

    h1.title-1 {
      color: #3d3e5a;
      font-size: 3rem;
      font-family: serif;
      font-weight: 600;
      text-transform: uppercase;
      padding-bottom: 1.5rem;
      position: relative;
      word-wrap: break-word;

      &:after {
        position: absolute;
        content: " ";
        background-color: #d9bd68;
        height: 4px;
        width: 50px;
        bottom: 0;
        left: 0;
      }

      &.lt {
        color: #fefefe;
      }

      &.center {
        text-align: center;

        &:after {
          left: 0;
          right: 0;
          margin: 0 auto;
        }
      }

      &.simple {
        &:after {
          content: none;
        }
      }

      @media screen and (max-width: 425px) {
        font-size: 30px;
      }
    }

    h2.title-2 {
      position: relative;
      color: #3d3e5a;
      font-size: 2.5rem;
      font-family: serif;
      font-weight: 100;
      text-transform: uppercase;
      overflow: hidden;

      &:after {
        content: " ";
        position: absolute;
        height: 1px;
        top: 30px;
        margin-left: 1rem;
        width: 100%;
        background-color: #cccccc;
      }
    }

    h3.title-3 {
      color: #3d3e5a;
      font-size: 1.8rem;
      font-family: serif;
      text-transform: uppercase;

      &.acnt {
        color: #d9bd68;
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

      &.dark {
        background-color: #3d3e59;
        color: #d3c05c !important;
        &:hover {
          background-color: #28293c;
        }
        &:not(.is-loading):after {
          background-color: #28293c;
        }
      }

      &:hover {
        background-color: #c52566;
      }

      &:focus {
        -webkit-box-shadow: 0 2px 20px 2px #ccc !important;
        -moz-box-shadow: 0 2px 20px 2px #ccc !important;
        box-shadow: 0 2px 20px 2px #ccc !important;
      }

      &:not(.is-loading):after {
        content: " ";
        position: absolute;
        width: 100%;
        height: 5px;
        background-color: #c52566;
        bottom: 0;
      }
    }

    .login-modal {
      .modal-background {
        background-color: rgba(10, 10, 10, 0.4);
      }

      .modal-card {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        border: 1px solid #d9bd68;
        max-width: 450px;

        .modal-card-body {
          padding: 0;
        }
      }
    }

    .my-2 {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .form {
      h1 {
        font-size: 24px;
        margin-bottom: 1rem;
        font-weight: 500;
      }

      label.label {
        font-weight: 100;
        line-height: inherit;
        font-size: inherit;
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

        .is-loading {
          &:after {
            margin-top: 10px;
          }
        }
      }

      .field:not(:last-child) {
        margin-bottom: 1.5rem;
      }

      input.input,
      select,
      textarea {
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

        &:focus,
        &:active {
          -webkit-box-shadow: 0 0 2px 0 #d9bd68;
          -moz-box-shadow: 0 0 2px 0 #d9bd68;
          box-shadow: 0 0 2px 0 #d9bd68;
          background-color: #ffffff;
        }

        &.is-danger {
          border: 1px solid #ff3860 !important;

          &:focus,
          &:active {
            -webkit-box-shadow: 0 0 2px 0 #ff3860;
            -moz-box-shadow: 0 0 2px 0 #ff3860;
            box-shadow: 0 0 2px 0 #ff3860;
            background-color: #ffffff;
          }
        }
      }

      .select {
        height: auto;
        &.is-danger {
          select {
            border: 1px solid #ff3860;
            &:focus,
            &:active {
              -webkit-box-shadow: 0 0 2px 0 #ff3860;
              -moz-box-shadow: 0 0 2px 0 #ff3860;
              box-shadow: 0 0 2px 0 #ff3860;
              background-color: #ffffff;
            }
          }
        }

        &:not(.is-loading):after {
          border-color: #dabd67;
        }

        select {
          option {
            color: #dabd67;
          }
        }
      }

      .control.has-icons-right .icon.is-right {
        top: 10px;
      }

      .b-radio.radio {
        input[type="radio"] + .check {
          border-color: #d9bd68;

          &:before {
            background: #d9bd68;
          }
        }

        &:hover {
          input[type="radio"] + .check {
            border-color: #d9bd68;
          }
        }
      }

      .error,
      .success {
        font-size: 18px;
        text-align: center;
        margin-bottom: 1rem;
        font-weight: 100;
      }

      .error {
        color: hsl(348, 100%, 61%);
      }

      .success {
        color: hsl(141, 71%, 48%);
      }
    }
  }
}
</style>
