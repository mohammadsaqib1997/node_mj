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
          <form class="form" @submit.prevent="addVoucher">
            <h3>Add Voucher</h3>
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
              <b-field>
                <p class="control">
                  <button class="button btn-des-1" type="submit">Save</button>
                </p>
              </b-field>
            </b-field>
          </form>
          <hr>
          <!-- <expFinanceComp title="Voucher" :type="2" @loading="loading=$event"></expFinanceComp> -->
          <!-- <hr> -->
          <tblTopFilter
            :act_view="String(load_params.limit)"
            :s_txt="load_params.search"
            @change_act_view="update_params('limit', parseInt($event))"
            @change_s_txt="update_params('search', $event)"
          ></tblTopFilter>
          <!-- <b-field class="total-count">
            <p class="control has-text-right">
              <span>Total Balance:</span>
              <span class="count">{{ tot_balance }}/-</span>
            </p>
          </b-field> -->
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
                <td></td>
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
              .then(res => {
                if (res.data.status === true) {
                  self.$toast.open({
                    duration: 1000,
                    message: "Successfully voucher inserted.",
                    position: "is-bottom",
                    type: "is-success"
                  });
                  self.reset();
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
    reset() {
      this.f_data = {
        date: null
      };
      this.validation.reset();
      this.$refs.v_rows.forEach(function(row_com) {
        row_com.rowDataReset();
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