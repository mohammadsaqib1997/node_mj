<template lang="pug">
	.wrapper
		.box.main-box
			.header.columns.is-gapless
				.column
					h1 Notifications
			.body
				.section
					tblTopFilter(:act_view="String(params.limit)" :s_txt="params.search" @change_s_txt="set_params({ param: 'search', value: $event })" @change_act_view="set_params({ param: 'limit', value: parseInt($event) })")
					tableComp(:arr="ren_data" :loading="loading" :total_record="tot_rows" :per_page="parseInt(params.limit)" :page_set="params.page" @page_change="set_params({ param: 'page', value: $event })")
						template(slot="thead")
							tr
								th(width="50px") Mark Read / UnRead
								th From
								th Message
								th Date
						template(slot="tbody")
							tr(v-for="row in ren_data" :class="{ active: row.read === 1 }" @click.prevent="$store.dispatch('notification/show_notif', row.id)")
								td.sts-con
									.r-sts-btn(@click.prevent.stop="$store.dispatch('notification/readToggle', row.id)")
										span {{ row.read === 1 ? "UnRead":"Read" }}
								td {{ row.from_txt }}
								td {{ row.msg }}
								td {{ $store.getters['formatDate'](row.date) }}
</template>

<script>
import { mapState, mapActions } from "vuex";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
export default {
  layout: "admin_layout",
  components: {
    tableComp,
    tblTopFilter
  },
  async mounted() {
    await this.$store.dispatch("notification/n_list_load");
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
    })
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      set_params: "notification/set_params"
    })
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
