<template lang="pug">
	.wrapper
		.box.main-box
			.header.columns.is-gapless
				.column
					h1 Notifications
			.body
				.section
					tblTopFilter
					tableComp(:arr="ren_data" :loading="loading" :total_record="tot_rows")
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
  computed: {
    ren_data: function() {
      return this.$store.state.notification.n_list;
    },
    loading: function() {
      return this.$store.state.notification.n_list_loader;
    },
    tot_rows: function () {
      return this.$store.state.notification.total_s_rows;
    }
  },
  data() {
    return {
      
    };
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
