<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>All Sales And Commission</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <HCountries></HCountries>
          <hr>
          <HRegions></HRegions>
          <hr>
          <HZones></HZones>
          <hr>
          <HBranches></HBranches>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HCountries from "~/components/admin_panel/tables/h_countries.vue";
import HRegions from "~/components/admin_panel/tables/h_regions.vue";
import HZones from "~/components/admin_panel/tables/h_zones.vue";
import HBranches from "~/components/admin_panel/tables/h_branches.vue";
export default {
  layout: "admin_layout",
  components: {
    HCountries,
    HRegions,
    HZones,
    HBranches
  },
  data() {
    return {
      tab_act: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    h1.title {
      font-family: serif;
      font-size: 1.5rem;
      color: #454545;
      text-transform: uppercase;
      font-weight: 100;
      margin-bottom: 1rem;
    }

    hr {
      background-color: #d9bd68;
    }
  }
}
</style>
