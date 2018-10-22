<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Notifications
      .body
        .section
          tblTopFilter(:is_remove_btn="has_sel_row" :is_read_unread_btns="has_sel_row" @read_call="read_tg_sel" @remove_call="rm_sel_noti" :f_list="tbl_list_filters" @change_filter="change_filter_tr($event)" :filter_set="filter_val" :act_view="String(params.limit)" :s_txt="params.search" @change_s_txt="set_params({ param: 'search', value: $event })" @change_act_view="set_params({ param: 'limit', value: parseInt($event) })")
          tableComp(:arr="ren_data" :loading="loading" :total_record="tot_rows" :per_page="parseInt(params.limit)" :page_set="params.page" @page_change="set_params({ param: 'page', value: $event })")
            template(slot="thead")
              tr
                th(width="50px") Mark Read / UnRead
                th From
                th Message
                th Date
                th.has-text-centered(width="50px")
                  b-checkbox(v-model="all_sel")
            template(slot="tbody")
              tr(v-for="(row, ind) in ren_data" :class="{ active: row.read === 1 }" @click.prevent="$store.dispatch('notification/show_notif', row.id)")
                td.sts-con
                  .r-sts-btn(@click.prevent.stop="$store.dispatch('notification/readToggle', row.id)")
                    span {{ row.read === 1 ? "UnRead":"Read" }}
                td {{ row.from_txt }}
                td {{ row.msg }}
                td {{ $store.getters['formatDate'](row.date) }}
                td.rm-cont.has-text-centered(@click.stop="")
                  b-checkbox(@input="select_row(ind, $event)" v-model="selected_row[ind]")
</template>

<script>
import { mapState, mapActions } from "vuex";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import _ from "lodash";
export default {
  layout: "admin_layout",
  components: {
    tableComp,
    tblTopFilter
  },
  async mounted() {
    this.$store.commit('notification/set_list_loader', true)
    await this.$store.dispatch("notification/n_list_load");
    this.$store.commit('notification/set_list_loader', false)
  },
  destroyed() {
    this.$store.commit("notification/set_n_list", []);
    this.$store.commit("notification/reset_load_params");
  },
  computed: {
    ...mapState({
      ren_data: state => state.notification.n_list,
      loading: state => state.notification.n_list_loader,
      tot_rows: state => state.notification.total_s_rows,
      params: state => state.notification.load_params
    }),
    filter_val: function() {
      return _.find(this.tbl_list_filters, { value: this.params.filter }).title;
    },
    has_sel_row: function() {
      return (
        _.filter(this.selected_row, row => {
          return row === true;
        }).length > 0
      );
    }
  },
  watch: {
    ren_data: function(val) {
      const self = this;
      self.all_sel = false;
      self.selected_row = [];
      _.each(val, r => {
        self.selected_row.push(false);
      });
    },
    all_sel: function(val) {
      const self = this;
      if (val === true && self.auto_sel_all === false) {
        let new_set = [];
        _.each(self.selected_row, (row, ind) => {
          new_set.push(true);
        });
        self.selected_row = new_set;
      } else if (val === false && self.auto_sel_all === false) {
        let new_set = [];
        _.each(self.selected_row, (row, ind) => {
          new_set.push(false);
        });
        self.selected_row = new_set;
      }
      self.auto_sel_all = false;
    }
  },
  data() {
    return {
      tbl_list_filters: [
        { title: "All", value: "all" },
        { title: "Finance", value: "finance" },
        { title: "Rewards", value: "rewards" },
        { title: "General", value: "general" }
      ],
      selected_row: [],
      all_sel: false,
      auto_sel_all: false
    };
  },
  methods: {
    ...mapActions({
      set_params: "notification/set_params"
    }),
    change_filter_tr: function(val) {
      this.set_params({
        param: "filter",
        value: _.find(this.tbl_list_filters, { title: val }).value
      });
    },
    select_row: function(ind, val) {
      const self = this;
      let all_true = true;
      for (let bool of self.selected_row) {
        if (bool === false) {
          all_true = false;
          break;
        }
      }
      if (all_true === true && self.all_sel !== true) {
        self.all_sel = true;
        self.auto_sel_all = true;
      } else if (all_true === false && self.all_sel !== false) {
        self.all_sel = false;
        self.auto_sel_all = true;
      } else {
        self.auto_sel_all = false;
      }
    },
    rm_sel_noti: function() {
      const self = this;
      let grb_ids = [];
      _.each(self.selected_row, (bool, ind) => {
        if (bool === true) {
          grb_ids.push(self.ren_data[ind].id);
        }
      });
      self.$store.dispatch("notification/remove", grb_ids.join("|"));
    },
    read_tg_sel: function(event) {
      const self = this;
      let grb_ids = [];
      _.each(self.selected_row, (bool, ind) => {
        if (bool === true) {
          grb_ids.push(self.ren_data[ind].id);
        }
      });
      self.$store.dispatch("notification/multipleRd", {
        ids: grb_ids.join("|"),
        sts: event === true ? 1 : 0
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-des-1 /deep/ {
  table {
    thead {
      tr {
        th {
          padding: 0.7rem;
          color: #454545;
          vertical-align: middle;
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        cursor: pointer;
        td {
          &.sts-con {
            padding: 0 !important;
            .r-sts-btn {
              cursor: pointer;
              width: 100%;
              height: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              border-radius: 0;
              border: none;
              background-color: transparent;
              span {
                position: relative;
                text-transform: uppercase;
                font-weight: 600;
                color: #666666;
                font-size: 14px;
                &:after {
                  content: " ";
                  position: absolute;
                  width: 100%;
                  height: 1px;
                  background-color: #dfdfdf;
                  left: 0;
                  top: 100%;
                }
              }
              &:hover,
              &:focus {
                -webkit-box-shadow: 0 0 0 0.125em inset rgba(218, 189, 103, 0.7);
                box-shadow: 0 0 0 0.125em inset rgba(218, 189, 103, 0.7);
              }
            }
          }
        }
        &.active {
          background-color: #f6f6f6;
        }
        &:hover {
          &:not(.active) {
            background-color: #e2e2e2;
          }
        }
      }
    }
  }
}
</style>
