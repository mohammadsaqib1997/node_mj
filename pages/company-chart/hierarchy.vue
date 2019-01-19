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
          <HCountries id="country-cont" @load_child="setNextLoad(1, $event)"></HCountries>
          <template v-if="tab_act > 0 && r_p_id !== null">
            <hr>
            <HRegions id="region-cont" :parent_id="r_p_id" @load_child="setNextLoad(2, $event)"></HRegions>
          </template>
          <template v-if="tab_act > 1 && z_p_id !== null">
            <hr>
            <HZones id="zone-cont" :parent_id="z_p_id" @load_child="setNextLoad(3, $event)"></HZones>
          </template>
          <template v-if="tab_act > 2 && b_p_id !== null">
            <hr>
            <HBranches id="branch-cont" :parent_id="b_p_id"></HBranches>
          </template>
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
      tab_act: 0,
      r_p_id: null,
      z_p_id: null,
      b_p_id: null
    };
  },
  methods: {
    setNextLoad(type, id) {
      this.tab_act = type;
      if (type === 1) {
        this.r_p_id = id;
      } else if (type === 2) {
        this.z_p_id = id;
      } else if (type === 3) {
        this.b_p_id = id;
      }
    }
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
    .main-box > .body > .section > hr {
      background-color: #d9bd68;
    }

    .table-des-1 {
      .table {
        tbody {
          tr {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
