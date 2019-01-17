<template>
  <div class="wrapper">
    <div class="tab-cont columns is-variable is-1">
      <div class="column is-6">
        <button :class="[{ 'active': tab_act === 0 }, 'button btn-des-1']" @click="tab_act=0;">Sales</button>
      </div>
      <div class="column is-6">
        <button
          :class="[{ 'active': tab_act === 1 }, 'button btn-des-1']"
          @click="tab_act=1;"
        >Commission</button>
      </div>
    </div>

    <template v-if="$store.state['crzb-module']['type'] === 5">
      <saleComp v-if="tab_act === 0"></saleComp>
      <CommComp v-if="tab_act === 1"></CommComp>
    </template>
    <template v-else>
      <memSalesComp v-if="tab_act === 0"></memSalesComp>
      <memCommComp v-if="tab_act === 1"></memCommComp>
    </template>
  </div>
</template>

<script>
import saleComp from "~/components/admin_panel/admin/comapny-chart/sales-comp.vue";
import CommComp from "~/components/admin_panel/admin/comapny-chart/commission-comp.vue";
import memSalesComp from "~/components/admin_panel/member/company-chart/sales-comp.vue";
import memCommComp from "~/components/admin_panel/member/company-chart/commission-comp.vue";
export default {
  layout: "admin_layout",
  components: {
    saleComp,
    CommComp,
    memSalesComp,
    memCommComp
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
    .tab-cont {
      .btn-des-1 {
        width: 100%;
        margin-top: 0;
        font-weight: 300;
        font-size: 20px;
        box-shadow: none;
        background-color: #3d3e5a;
        color: #d9bd68 !important;
        &:after {
          background-color: #2a2b42;
        }

        &.active {
          background-color: #d9bd68;
          color: #2a2b42 !important;
          box-shadow: 0 2px 20px 2px #ccc !important;
          &:after {
            background-color: #ab9142;
          }
        }
      }
    }

    .counter-box {
      position: relative;
      & > .columns {
        & > .column {
          &:nth-child(3) {
            border-right: none !important;
          }
        }
      }
      h5 {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        &.title-cus-1 {
          color: #d9bd68;
          padding: 0 0.75rem;
          text-align: left;
        }
        &.title-cus-2 {
          color: #ffffff;
        }
      }

      .flex {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        .c-tile {
          margin: 0;
          display: flex;
          text-align: left;
          h5,
          span {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          h5 {
            color: #d9bd68;
          }
          span {
            color: #ffffff;
            display: inline-block;
            margin-left: 10px;
          }
          .tile.is-vertical > .is-child:not(:last-child) {
            margin-bottom: 10px !important;
          }
          .is-narrow {
            flex: none;
            text-align: right;
          }
        }
        .amount-wrapper {
          b {
            text-transform: uppercase;
          }
          h1 {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
