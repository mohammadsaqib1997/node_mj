<template lang="pug">
    .profile-info-con
        .columns.is-variable.is-1
            .column
                label Full Name
            .column
                h2 {{ profile.full_name }}

        .columns.is-variable.is-1
            .column
                label CNIC
            .column
                h2 {{ profile.cnic_num }}

        .columns.is-variable.is-1
            .column
                label Email
            .column
                h2 {{ profile.email }}

        .columns.is-variable.is-1
            .column
                label Contact Number
            .column
                h2 {{ profile.contact_num }}

        .columns.is-variable.is-1
            .column
                label Address
            .column
                h2 {{ profile.address }}

        .columns.is-variable.is-1(v-if="$store.state.user.data.type === 1")
            .column
                label Status
            .column
                h2 {{ (profile.active_sts == 0) ? "Suspended":"Approved" }}
</template>

<script>
export default {
  computed: {
    profile: function() {
      return this.$store.state.profile.profile;
    }
  },
  async mounted() {
    await this.$store.dispatch("profile/loadProfile");
  }
};
</script>

