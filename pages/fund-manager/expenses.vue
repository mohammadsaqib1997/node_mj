<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header">
        <h1>Expenses</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="addExpanse">
            <h3>Add Expenses</h3>
            <b-field grouped>
              <b-field :type="(validation.hasError('f_data.remarks')) ? 'is-danger':''" :message="validation.firstError('f_data.remarks')" expanded>
                <b-input placeholder="Expense Remarks" v-model="f_data.remarks"></b-input>
              </b-field>
              <b-field :type="(validation.hasError('f_data.debit')) ? 'is-danger':''" :message="validation.firstError('f_data.debit')">
                <b-input type="tel" placeholder="Debit" v-mask="'#######'" v-model="f_data.debit"></b-input>
              </b-field>
              <b-field :type="(validation.hasError('f_data.credit')) ? 'is-danger':''" :message="validation.firstError('f_data.credit')">
                <b-input type="tel" placeholder="Credit" v-mask="'#######'" v-model="f_data.credit"></b-input>
              </b-field>
              <b-field>
                <p class="control">
                  <button class="button btn-des-1" type="submit">Add</button>
                </p>
              </b-field>
            </b-field>
          </form>
          <hr>

          <tblTopFilter :act_view="String(load_params.limit)" :s_txt="load_params.search" @change_act_view="update_params('limit', parseInt($event))" @change_s_txt="update_params('search', $event)"></tblTopFilter>
          <tableComp :arr="l_data" :loading="loading" :striped="true" :total_record="num_rows" :per_page="parseInt(load_params.limit)" :page_set="load_params.page" @page_change="update_params('page', $event)">
            <template slot="thead">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.id }}</td>
                <td>{{ $store.getters.formatDate(row.created_at) }}</td>
                <td>{{ row.remarks }}</td>
                <td>{{ row.debit }}</td>
                <td>{{ row.credit }}</td>
              </tr>
            </template>
          </tableComp>

        </div>
      </div>
    </div>
  </div>
</template>
>
</template>

<script>
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter
  },
  computed: {},
  directives: {
    mask
  },
  data() {
    return {
      f_data: {
        remarks: "",
        debit: "",
        credit: ""
      }
    };
  },
  validators: {
    "f_data.remarks": function(value) {
      return Validator.value(value)
        .required()
        .minLength(3)
        .maxLength(250)
        .custom(() => {
          if (/[^a-zA-Z0-9\.\?\!\"\'\s- ]/.test(value)) {
            return "Invalid character use.";
          }
        });
    },
    "f_data.debit": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(1000000, "Maximum amount add 1000000!");
    },
    "f_data.credit": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(1000000, "Maximum amount add 1000000!");
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/admin/expense_list", {
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
    addExpanse() {
      const self = this;
      self.$validate().then(function(success) {
        if (success) {
          self.loading = true;
          self.$axios
            .post("/api/admin/add_expanse", {
              remarks: self.f_data.remarks,
              debit: self.f_data.debit,
              credit: self.f_data.credit
            })
            .then(async res => {
              self.reset();
              await self.loadData()
              self.loading = false;
              self.$toast.open({
                duration: 3000,
                message: "Successfully Add Expanse.",
                position: "is-bottom",
                type: "is-success"
              });
            })
            .catch(err => {
              console.log(err);
              self.loading = false;
              self.$toast.open({
                duration: 3000,
                message: "DB Error.",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        } else {
          self.loading = false;
        }
      });
    },
    reset() {
      this.f_data = {
        remarks: "",
        debit: "",
        credit: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    hr {
      background-color: #d9bd68;
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