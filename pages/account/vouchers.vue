<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Vouchers</h1>
        </div>
        <div class="column has-text-right">
          <button class="button btn-des-2" @click.prevent="subs_md_act=true">
            <b-icon icon="list-alt"></b-icon>&nbsp;&nbsp;&nbsp;&nbsp;Add Subsidiary
          </button>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="is_update ? updateVoucher(): addVoucher()">
            <h3>{{ is_update ? 'Update': 'Add' }} Voucher</h3>
            <table class="table is-fullwidth is-bordered entry_table">
              <thead>
                <tr>
                  <th width="5%">Row#</th>
                  <th width="15%">Subsidiary</th>
                  <th width="50%">Particular</th>
                  <th width="15%">Debit</th>
                  <th width="15%">Credit</th>
                </tr>
              </thead>
              <tbody>
                <voucherRow ref="v_rows" v-for="n in 5" :ind="n" :key="n"></voucherRow>
              </tbody>
            </table>
            <b-field grouped>
              <b-field
                :type="(validation.hasError('f_data.date')) ? 'is-danger':''"
                :message="validation.firstError('f_data.date')"
              >
                <b-datepicker placeholder="Voucher Date" v-model="f_data.date"></b-datepicker>
              </b-field>
              <b-field grouped>
                <p class="control">
                  <button class="button btn-des-1" type="submit">{{ is_update ? 'Update': 'Save' }}</button>
                </p>
                <p class="control" v-if="is_update">
                  <button
                    @click.prevent="reset"
                    class="button btn-des-1 dark"
                    type="button"
                  >New Voucher</button>
                </p>
              </b-field>
            </b-field>
          </form>
          <hr>

          <tblTopFilter
            :act_view="String(load_params.limit)"
            :s_txt="load_params.search"
            @change_act_view="update_params('limit', parseInt($event))"
            @change_s_txt="update_params('search', $event)"
          ></tblTopFilter>

          <tableComp
            :arr="l_data"
            :loading="loading"
            :striped="true"
            :total_record="num_rows"
            :per_page="parseInt(load_params.limit)"
            :page_set="load_params.page"
            @page_change="update_params('page', $event)"
          >
            <template slot="thead">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Voucher ID</th>
                <th>Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.id }}</td>
                <td>{{ $store.getters.formatDate(row.v_date) }}</td>
                <td>{{ row.v_id }}</td>
                <td>
                  <b-field grouped>
                    <p class="control">
                      <button
                        @click.prevent="deleteVoucher(row.id)"
                        class="button is-small is-danger"
                      >Delete</button>
                    </p>
                    <p class="control">
                      <button
                        @click.prevent="loadUpdateData(row.id)"
                        class="button is-small is-info"
                      >Edit</button>
                    </p>
                  </b-field>
                </td>
              </tr>
            </template>
          </tableComp>
        </div>
      </div>
    </div>
    <addSubsMD :md_act="subs_md_act" @closed="subs_md_act=false"></addSubsMD>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import expFinanceComp from "~/components/admin_panel/admin/exp-finance.vue";
import addSubsMD from "~/components/modals/add_subsidiary.vue";
import voucherRow from "~/components/forms/voucher_row.vue";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter,
    expFinanceComp,
    addSubsMD,
    voucherRow
  },
  computed: {},
  directives: {
    mask
  },
  data() {
    return {
      tot_balance: "",
      subs_md_act: false,
      loaded_voucher: null,
      is_update: false,
      f_data: {
        date: null
      }
    };
  },
  validators: {
    "f_data.date": function(value) {
      return Validator.value(value).required();
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/voucher/list_voucher", {
          params: self.load_params
        })
        .then(res => {
          self.l_data = res.data.data;
          self.num_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    addVoucher() {
      const self = this;
      self.loading = true;
      Promise.all(
        self.$refs.v_rows.map(function(row_com) {
          return row_com.validate();
        })
      ).then(async function(result) {
        let self_form_chk = false;
        await self.$validate().then(
          function(success) {
            self_form_chk = success;
          }.bind(this)
        );

        let fill = result.filter(function(row_data) {
          return (
            typeof row_data !== "undefined" &&
            !_.get(row_data, "empty", false) &&
            !_.get(row_data, "required", false)
          );
        });
        if (_.filter(result, "required").length > 0) {
          self.loading = false;
          return;
        }
        if (fill.length < 1) {
          self.loading = false;
          self.$toast.open({
            duration: 1000,
            message: "Minimum one entry.",
            position: "is-bottom",
            type: "is-danger"
          });
        } else {
          if (self_form_chk) {
            await self.$axios
              .post("/api/voucher/add", {
                v_date: self.f_data.date,
                rows: fill
              })
              .then(async res => {
                if (res.data.status === true) {
                  self.$toast.open({
                    duration: 1000,
                    message: "Successfully voucher inserted.",
                    position: "is-bottom",
                    type: "is-success"
                  });
                  self.reset();
                  await self.loadData();
                } else {
                  self.$toast.open({
                    duration: 1000,
                    message: res.data.message,
                    position: "is-bottom",
                    type: "is-danger"
                  });
                }
              })
              .catch(err => {
                console.log(err);
                self.$toast.open({
                  duration: 1000,
                  message: "Server Error.",
                  position: "is-bottom",
                  type: "is-danger"
                });
              });
          }
          self.loading = false;
        }
      });
    },
    updateVoucher() {
      const self = this;
      self.loading = true;
      Promise.all(
        self.$refs.v_rows.map(function(row_com) {
          return row_com.validate();
        })
      ).then(async function(result) {
        let self_form_chk = false;
        await self.$validate().then(
          function(success) {
            self_form_chk = success;
          }.bind(this)
        );

        let fill = result.filter(function(row_data) {
          return (
            typeof row_data !== "undefined" &&
            !_.get(row_data, "empty", false) &&
            !_.get(row_data, "required", false)
          );
        });
        if (_.filter(result, "required").length > 0) {
          self.loading = false;
          return;
        }
        if (fill.length < 1) {
          self.loading = false;
          self.$toast.open({
            duration: 1000,
            message: "Minimum one entry.",
            position: "is-bottom",
            type: "is-danger"
          });
        } else {
          if (self_form_chk) {
            let upd_rows = [];

            self.$refs.v_rows.forEach(function(comp, i) {
              let fill_row = fill[i];
              let prev_row = self.loaded_voucher.v_ent_data[i];

              if (fill_row && prev_row) {
                fill_row["id"] = prev_row.id;
                upd_rows[i] = fill_row;
              } else if (!fill_row && prev_row) {
                upd_rows[i] = {
                  id: prev_row.id,
                  remove: true
                };
              } else if (fill_row && !prev_row) {
                upd_rows[i] = fill_row;
              }
            });

            await self.$axios
              .post("/api/voucher/update", {
                upd_id: self.loaded_voucher.v_data.id,
                v_date: moment(self.f_data.date).format(),
                rows: upd_rows
              })
              .then(async res => {
                if (res.data.status === true) {
                  self.$toast.open({
                    duration: 1000,
                    message: "Successfully voucher updated.",
                    position: "is-bottom",
                    type: "is-success"
                  });
                  self.reset();
                  await self.loadData();
                } else {
                  self.$toast.open({
                    duration: 1000,
                    message: res.data.message,
                    position: "is-bottom",
                    type: "is-danger"
                  });
                }
              })
              .catch(err => {
                console.log(err);
                self.$toast.open({
                  duration: 1000,
                  message: "Server Error.",
                  position: "is-bottom",
                  type: "is-danger"
                });
              });
          }
          self.loading = false;
        }
      });
    },
    deleteVoucher(id) {
      const self = this;
      this.$dialog.confirm({
        title: "Deleting voucher #" + id,
        message:
          "Are you sure you want to <b>delete</b> voucher? This action cannot be undone.",
        confirmText: "Delete Voucher",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          self.loading = true;
          await self.$axios
            .post("/api/voucher/delete", {
              del_id: id
            })
            .then(async res => {
              self.$toast.open({
                duration: 1000,
                message: "Successfully voucher deleted.",
                position: "is-bottom",
                type: "is-success"
              });
              await self.loadData();
            })
            .catch(err => {
              self.loading = false;
              console.log(err);
              self.$toast.open({
                duration: 1000,
                message: "Server Error.",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        }
      });
    },
    reset() {
      this.f_data = {
        date: null
      };
      this.is_update = false;
      this.loaded_voucher = null;
      this.validation.reset();
      this.$refs.v_rows.forEach(function(row_com) {
        row_com.rowDataReset();
      });
    },
    async loadUpdateData(id) {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/voucher/load/" + id)
        .then(res => {
          if (res.data.status == false) {
            self.$toast.open({
              duration: 1000,
              message: res.data.message,
              position: "is-bottom",
              type: "is-danger"
            });
          } else {
            self.is_update = true;
            self.loaded_voucher = res.data;
            self.f_data.date = new Date(res.data.v_data.v_date);
            self.$refs.v_rows.forEach(function(row_com, ind) {
              row_com.rowDataReset();
              row_com.setRowData(res.data.v_ent_data[ind]);
            });
          }
          self.loading = false;
        })
        .catch(err => {
          self.loading = false;
          console.log(err);
          self.$toast.open({
            duration: 1000,
            message: "Server Error.",
            position: "is-bottom",
            type: "is-danger"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    .btn-des-2 {
      color: #666666;
      border: 2px solid transparent;
      box-shadow: none !important;
      font-weight: 500;
      text-transform: uppercase;
      height: auto;
      border-radius: 0;
      &:not(:last-child) {
        margin-right: 10px;
      }
      &:focus,
      &:hover {
        border: 2px solid #d9bd68;
      }
      .icon {
        color: #d9bd68;
      }
    }

    .entry_table {
      td {
        padding: 4px;
        &:first-child {
          vertical-align: middle;
          text-align: center;
        }
      }
    }

    .section > hr {
      background-color: #d9bd68;
    }

    .total-count {
      > p {
        font-size: 16px;
        font-weight: 500;
        color: #959595;
        > .count {
          margin-left: 5px;
          color: #666666;
        }
      }
    }

    .form {
      > h3 {
        font-size: 20px;
        font-weight: 300;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      > .field > .field {
        margin-bottom: 0;
      }

      .control {
        .btn-des-1 {
          margin-top: 0;
          min-height: 0;
          padding: 15px 30px;
          box-shadow: none;

          &:focus {
            box-shadow: none !important;
          }
        }
      }
    }
  }
}
</style>