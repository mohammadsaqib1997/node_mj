<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Lucky Draw</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <div class="columns is-multiline __tabs">
            <div class="column is-12 is-6-desktop">
              <button
                :class="['button btn-des-1', {'is-active': tab_act === 0}]"
                @click.prevent="tab_act=0"
              >Daily Lucky Draw</button>
            </div>
            <div class="column is-12 is-6-desktop">
              <button
                :class="['button btn-des-1', {'is-active': tab_act === 1}]"
                @click.prevent="tab_act=1"
              >Previous Lucky Draw</button>
            </div>
          </div>
          <div class="columns is-multiline __tab_content">
            <div :class="['column is-12', {'is-active': tab_act === 0}]">
              <dailyQualifier :load="tab_act === 0"></dailyQualifier>
            </div>
            <div :class="['column is-12', {'is-active': tab_act === 1}]">
              <prevWinner :load="tab_act === 1"></prevWinner>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import dailyQualifier from "~/components/admin_panel/admin/lucky-draw/daily-qualifier.vue";
import prevWinner from "~/components/admin_panel/admin/lucky-draw/prev-winner.vue";
export default {
  layout: "admin_layout",
  components: {
    dailyQualifier,
    prevWinner
  },
  data() {
    return {
      tab_act: 0
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    .btn-des-2 {
      background-color: #3b3f58;
      color: #d9bd68;
      border-color: #d9bd68;
      height: auto;
      line-height: 17px;
      border-radius: 0;

      &:focus {
        box-shadow: 0 0 2px 2px #fff2cb;
      }
    }
    .__tabs {
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
        &.is-active {
          background-color: #d9bd68;
          color: #2a2b42 !important;
          box-shadow: 0 2px 20px 2px #ccc !important;
          &:after {
            background-color: #ab9142;
          }
        }
      }
    }
    .__tab_content {
      & > div.column {
        &:not(.is-active) {
          display: none;
        }
        .__gp_tb {
          .btn-des-1 {
            padding: 0 30px;
            min-height: 50px;
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>

