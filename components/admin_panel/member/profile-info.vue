<template lang="pug">
  .profile-info-con
    .columns.is-variable.is-1
      .column
        label ID
      .column
        h2 {{ profile.user_asn_id }}

    .columns.is-variable.is-1
      .column
        label Full Name
      .column
        h2 {{ profile.full_name }}

    .columns.is-variable.is-1
      .column
        label Date Of Birth
      .column
        h2 {{ profile.dob ? $store.getters.formatDate(profile.dob) : '' }}

    .columns.is-variable.is-1
      .column
        label CNIC
      .column
        h2 {{ profile.cnic_num }}

    .columns.is-variable.is-1
      .column
        label Email
      .column
        h2.is-email {{ profile.email }}
        template(v-if="profile.email")
          b-tooltip(v-if="is_verify_email === 0" label="Please verify your email!" type="is-warning")
            .verify-btn(@click.prevent.stop="seeNotify")
              b-icon.has-text-warning(icon="exclamation-triangle")
          b-tooltip(v-else-if="is_verify_email === 1" label="Your email is verified!" type="is-success")
            b-icon.has-text-success(icon="check-circle")

    .columns.is-variable.is-1
      .column
        label Contact Number
      .column
        h2 {{ profile.contact_num }}

    .columns.is-variable.is-1
      .column
        label Mail Address
      .column
        h2 {{ profile.address }}

    .columns.is-variable.is-1
      .column
        label Branch
      .column
        h2 {{ profile.crzb_name }}

    .columns.is-variable.is-1
      .column
        label Referral ID
      .column
        h2 {{ profile.ref_user_asn_id }}

    .columns.is-variable.is-1
      .column
        label Status
      .column
        h2 {{ (profile.active_sts == 0) ? "Suspended":"Approved" }}

    .columns.is-variable.is-1
      .column
        nuxt-link.button.btn-des-1(to="/fund-manager/finance-details")
          img(src="~/assets/img/btn-coin.png")
          | &nbsp;&nbsp;&nbsp;&nbsp;View Finances
</template>

<script>
export default {
  computed: {
    profile: function() {
      return this.$store.state.profile.profile;
    },
    is_verify_email: function() {
      return this.$store.state.user.data.is_verify_email;
    }
  },
  async mounted() {
    await this.$store.dispatch("profile/loadProfile");
  },
  data() {
    return {
      pincode_md_act: false
    };
  },
  methods: {
    seeNotify() {
      this.$store.commit("showMsgs/resetData");
      this.$store.commit("showMsgs/setMsgData", {
        title: "Verify Your Email!",
        message: "Please verify your e-mail.",
        action: {
          txt: "Send E-mail",
          param: "send-verify-email"
        }
      });
      this.$store.commit("showMsgs/setMsgAct", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-info-con {
  /deep/ {
    h2 {
      &.is-email {
        display: inline-block;
        margin-right: 5px;
      }
    }
    .verify-btn {
      cursor: pointer;
    }
    .btn-des-1 {
      &:not(:first-child) {
        margin-left: 1rem;
      }
    }
  }
}
</style>


