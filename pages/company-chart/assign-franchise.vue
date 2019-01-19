<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Assign Roles</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="submit">
            <div class="columns is-variable is-2">
              <div class="column">
                <b-field
                  expanded
                  :type="validation.hasError('search_mj_user') || validation.hasError('f_data.mem_id') ? 'is-danger':''"
                  :message="getMessage([validation.firstError('search_mj_user'), validation.firstError('f_data.mem_id')])"
                >
                  <b-input
                    type="text"
                    placeholder="Enter MJ ID or Email"
                    v-model="search_mj_user"
                    :loading="validation.isValidating('search_mj_user')"
                  ></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  expanded
                  :type="validation.hasError('search_mj_user') || validation.hasError('f_data.mem_id') ? 'is-danger':''"
                  :message="getMessage([validation.firstError('search_mj_user'), validation.firstError('f_data.mem_id')])"
                >
                  <b-input
                    type="text"
                    placeholder="Name"
                    v-model="s_name"
                    :loading="validation.isValidating('search_mj_user')"
                    readonly
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-4">
                <b-field
                  label="Select Franchise"
                  class="cus-des-1 select-multi"
                  expanded
                  :type="(validation.hasError('f_data.fr_ids')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.fr_ids')"
                >
                  <b-select
                    multiple
                    v-model="f_data.fr_ids"
                    expanded
                    :loading="isLoadingFrc"
                    :disabled="isLoadingFrc"
                  >
                    <option
                      v-for="(item, ind) in frc_list"
                      :value="item.id"
                      :key="ind"
                    >{{ item.name }}</option>
                  </b-select>
                </b-field>
              </div>
            </div>

            <b-field>
              <p class="control">
                <button type="submit" class="button btn-des-1">Save</button>
              </p>
            </b-field>
          </form>
          <b-loading :is-full-page="false" :active="loading_form" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Assign Roles List</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
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
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>Code</th>
                <th>Name Of Franchise</th>
                <th>Name Of Branch</th>
                <th>Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.id }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.fr_code }}</td>
                <td>{{ row.fr_name }}</td>
                <td>{{ row.br_name }}</td>
                <td>
                  <b-field grouped>
                    <p class="control">
                      <button
                        @click.prevent="toggleSts(row, !row.role_status)"
                        :class="['button is-small', {'is-danger': row.role_status === 1, 'is-success': row.role_status === 0}]"
                      >{{ row.role_status === 0 ? 'Active':'Deactive' }}</button>
                    </p>
                  </b-field>
                </td>
              </tr>
            </template>
          </tableComp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter
  },
  async mounted() {
    const self = this;
    await this.loadFrnList(self.$store.state["crzb-module"]["hod_id"]);
  },
  data() {
    return {
      loading_form: false,
      isLoadingFrc: false,
      frc_list: [],
      search_mj_user: "",
      submitted: false,
      s_name: "",
      f_data: {
        mem_id: "",
        fr_ids: []
      }
    };
  },
  validators: {
    "f_data.mem_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    search_mj_user: {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        self.f_data.mem_id = "";
        self.s_name = "";
        if (self.submitted || self.validation.isTouched("search_mj_user")) {
          let validator = Validator.value(value).required();

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (!Validator.isEmpty(value)) {
                return self.$axios
                  .post("/api/assign-role-fr/get-user-check", {
                    email: value
                  })
                  .then(res => {
                    if (res.data.status === false) {
                      return res.data.message;
                    } else {
                      self.s_name = res.data.result.full_name;
                      self.f_data.mem_id = res.data.result.id;
                    }
                  });
              }
            });
          }
        }
      }
    },
    "f_data.fr_ids": function(value) {
      return Validator.value(value).required();
    }
  },
  methods: {
    getMessage(arr) {
      let msg = "";
      for (let item of arr) {
        if (item && item !== "") {
          msg = item;
          break;
        }
      }
      return msg;
    },
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get(`/api/assign-role-fr/list/${self.$store.state['crzb-module']['hod_id']}`, {
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
    after_f_settle: _.debounce(
      function(cb) {
        cb();
      },
      500,
      false
    ),
    loadFrnList(crzb_id) {
      const self = this;
      self.isLoadingFrc = true;
      self.after_f_settle(function() {
        if (crzb_id === null) {
          self.isLoadingFrc = false;
          return;
        }
        self.frc_list = [];
        self.$axios
          .get(`/api/assign-role-fr/get-fr-list/${crzb_id}`)
          .then(({ data }) => {
            self.frc_list = data.result;
          })
          .catch(error => {
            self.frc_list = [];
            throw error;
          })
          .finally(() => {
            self.isLoadingFrc = false;
          });
      });
    },
    submit() {
      const self = this;
      self.submitted = true;
      self.loading_form = true;
      self.$validate().then(function(success) {
        if (success) {
          self.$axios
            .post("/api/assign-role-fr/assign", self.f_data)
            .then(async res => {
              self.reset();
              self.loading_form = false;
              self.$toast.open({
                duration: 1000,
                message: "Successfully Assigned!",
                position: "is-bottom",
                type: "is-success"
              });
              await self.loadData();
            })
            .catch(err => {
              console.log(err);
              self.loading_form = false;
              self.$toast.open({
                duration: 1000,
                message: "Server Error!",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        } else {
          self.loading_form = false;
        }
      });
    },
    reset() {
      this.f_data = {
        mem_id: "",
        fr_ids: []
      };
      this.search_mj_user = "";
      this.s_name = "";
      this.submitted = false;
      this.validation.reset();
    },
    toggleSts(row, asn_sts) {
      const self = this;
      this.$dialog.confirm({
        title: `${asn_sts ? "Active" : "Deactive"} assigned member!`,
        message: `Are you sure you want to <b>${
          asn_sts ? "active" : "deactive"
        }</b> assigned member?`,
        confirmText: `${asn_sts ? "Active" : "Deactive"}`,
        type: `${asn_sts ? "is-success" : "is-danger"}`,
        hasIcon: true,
        onConfirm: async () => {
          self.loading = true;
          await self.$axios
            .post("/api/assign-role-fr/toggle-status", {
              row_id: row.id,
              change_sts: asn_sts,
              fr_id: row.fr_id
            })
            .then(async res => {
              self.$toast.open({
                duration: 1000,
                message: `Successfully assigned member ${
                  asn_sts ? "Active" : "Deactive"
                }.`,
                position: "is-bottom",
                type: "is-success"
              });
              self.loadData();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    .form .cus-des-1 {
      &.select-multi {
        .select > select {
          height: auto;
        }
      }
    }
    // .select-multi {
    //   background-color: red;
    //   select {
    //     height: auto;
    //   }
    // }
  }
}
</style>
