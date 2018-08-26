<template lang="pug">
  .wrapper
    addNewMemCompAdminMember(v-if="$store.state.user.data.type === 0")
    addNewMemCompAdmin(v-else)
</template>

<script>
import addNewMemCompAdmin from "~/components/admin_panel/admin/members_area/add-new-member.vue";
import addNewMemCompAdminMember from "~/components/admin_panel/member/members_area/add-new-member.vue";
export default {
  layout: "admin_layout",
  components: {
    addNewMemCompAdmin,
    addNewMemCompAdminMember
  },
  data() {
    return {};
  }
};
</script>


