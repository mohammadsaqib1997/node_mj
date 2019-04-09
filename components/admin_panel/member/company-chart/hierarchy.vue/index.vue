<template>
  <div class="box main-box">
    <div class="header columns is-gapless is-multiline">
      <div class="column">
        <h1>Sales List</h1>
      </div>
    </div>
    <div class="body">
      <div class="section">
        <template v-if="data_load_type >= 1 && hod_data.type == 0">
          <regionList :p_hod_id="hod_data.hod_id" @nextType="data_load_type=$event"></regionList>
        </template>
        <template v-if="data_load_type >= 2  && hod_data.type <= 1">
          <hr v-if="hod_data.type < 1">
          <zoneList :p_hod_id="hod_data.hod_id" @nextType="data_load_type=$event"></zoneList>
        </template>
        <template v-if="data_load_type >= 3 && hod_data.type <= 2">
          <hr v-if="hod_data.type < 2">
          <branchList :p_hod_id="hod_data.hod_id" @nextType="data_load_type=$event"></branchList>
        </template>
        <!-- <template v-if="data_load_type == 4 && hod_data.type <= 3">
          <hr v-if="hod_data.type < 3">
          <franchiseList :p_hod_id="hod_data.hod_id"></franchiseList>
        </template> -->
      </div>
    </div>
  </div>
</template>

<script>
import regionList from "~/components/admin_panel/member/company-chart/hierarchy.vue/region_ls.vue";
import zoneList from "~/components/admin_panel/member/company-chart/hierarchy.vue/zone_ls.vue";
import branchList from "~/components/admin_panel/member/company-chart/hierarchy.vue/branch_ls.vue";
// import franchiseList from "~/components/admin_panel/member/company-chart/hierarchy.vue/franchise_ls.vue";
export default {
  components: {
    regionList,
    zoneList,
    branchList,
    // franchiseList
  },
  computed: {
    hod_data: function() {
      return this.$store.state["crzb-module"];
    }
  },
  mounted() {
    this.data_load_type = this.hod_data.type + 1;
  },
  data() {
    return {
      data_load_type: 0
    };
  }
};
</script>

