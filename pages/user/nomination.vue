<template>
  <div class="box main-box">
    <div class="header columns is-gapless is-multiline">
      <div class="column">
        <h1>Nomination</h1>
      </div>
    </div>
    <div class="body">
      <div class="section">
        <div class="form" v-if="l_data.length < 1 || update == true">
          <table class="table is-fullwidth">
            <tbody>
              <nomRow
                ref="nom_row_fm"
                v-for="n in 3"
                :ind="n"
                :key="n"
                :upd_data="update && l_data[n-1] ? l_data[n-1]:null"
              ></nomRow>
            </tbody>
          </table>
          <h3>Note: Documents should be submitted upon transfer of account. Blood relation should be directly from your family member.</h3>
          <b-field
            v-if="update !== true"
            :type="(validation.hasError('terms_cond')) ? 'is-danger':''"
            :message="validation.firstError('terms_cond')"
          >
            <b-checkbox
              v-model="terms_cond"
            >I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief. I hereby authorize that my account should be transferred to the above personals priority wise upon showing required document for fluent transfer of account.</b-checkbox>
          </b-field>
          <b-field>
            <p class="control">
              <button
                class="button btn-des-1"
                @click.prevent="submit"
              >{{ update ? 'Update': 'Submit' }}</button>
            </p>
          </b-field>
        </div>
        <template v-else>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Sr.#</th>
                <th>Name</th>
                <th>Blood Relation</th>
                <th>CNIC</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ind) in l_data" :key="ind">
                <th>{{ ind+1 }}</th>
                <td>{{ row.name }}</td>
                <td>{{ row.blood_rel }}</td>
                <td>{{ row.cnic_numb }}</td>
                <td>{{ row.contact_numb }}</td>
              </tr>
            </tbody>
          </table>
          <b-field>
            <p class="control">
              <button class="button btn-des-1" @click.prevent="update=true">Edit</button>
            </p>
          </b-field>
        </template>

        <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import nomRow from "~/components/forms/nomination_row.vue";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  components: {
    nomRow
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      loading: false,
      terms_cond: false,
      update: false,
      l_data: []
    };
  },
  validators: {
    terms_cond: function(value) {
      if (this.update) {
        return;
      }
      return Validator.value(value)
        .required()
        .custom(() => {
          if (value !== true) {
            return "This field is required to check.";
          }
        });
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/nomination/list")
        .then(res => {
          self.l_data = res.data.result ? res.data.result : [];
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    async submit() {
      const self = this;
      self.loading = true;
      let row_result = await Promise.all(
        self.$refs.nom_row_fm.map(row => {
          return row.validate();
        })
      );
      let self_form_chk;
      await self.$validate().then(function(success) {
        self_form_chk = success;
      });

      let row_fill = row_result.filter(function(row_data) {
        return (
          typeof row_data !== "undefined" &&
          !_.get(row_data, "empty", false) &&
          !_.get(row_data, "required", false)
        );
      });
      if (_.filter(row_result, "required").length > 0) {
        self.loading = false;
        return;
      }
      if (row_fill.length < 1) {
        self.loading = false;
        self.$toast.open({
          duration: 1000,
          message: "Minimum one entry.",
          position: "is-bottom",
          type: "is-danger"
        });
        return;
      }
      if (!self_form_chk) {
        self.loading = false;
        return;
      }
      // form submit with rows
      let send_data = {};
      if (self.update) {
        send_data["rows"] = _.merge(
          _.cloneDeep(self.l_data),
          _.cloneDeep(row_fill)
        );
      } else {
        send_data["rows"] = row_fill;
      }

      await self.$axios
        .post("/api/nomination/add", send_data)
        .then(async res => {
          await self.loadData();
        })
        .catch(err => {
          console.log(err);
          self.$toast.open({
            duration: 1000,
            message: "Server Error!",
            position: "is-bottom",
            type: "is-danger"
          });
        })
        .finally(() => {
          self.loading = false;
          self.update = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-box {
  /deep/ {
    .form {
      h3 {
        line-height: normal;
        font-weight: 300;
        font-size: 18px;
        margin-bottom: 1rem;
      }
      label.b-checkbox {
        align-items: flex-start;
        input[type="checkbox"] + .check {
          width: 20px;
          height: 20px;
          margin-top: 3px;
        }
        input[type="checkbox"]:checked + .check {
          background-color: #d9bd68;
          border-color: #d9bd68;
        }
        &:focus {
          input[type="checkbox"]:checked + .check {
            box-shadow: 0 0 0.5em rgba(217, 189, 104, 0.8);
          }
        }
        &:hover {
          input[type="checkbox"] + .check {
            border-color: #d9bd68;
          }
        }
        span.control-label {
          line-height: normal;
          font-size: 18px;
        }
      }
    }
    .table {
      tr {
        th {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>

