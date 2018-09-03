<template lang="pug">
  .wrapper
    fdMember(v-if="u_type === 0")
    fdAdmin(v-else)
</template>

<script>
import fdMember from "~/components/admin_panel/member/fund-manager/finance-details.vue";
import fdAdmin from "~/components/admin_panel/admin/fund-manager/finance-details.vue";
export default {
  components: {
    fdMember,
    fdAdmin
  },
  layout: "admin_layout",
  computed: {
    u_type: function() {
      return this.$store.state.user.data.type;
    }
  }
};
</script>

