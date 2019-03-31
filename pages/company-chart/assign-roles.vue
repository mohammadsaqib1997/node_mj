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
              <div class="column">
                <b-field
                  class="cus-des-1"
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-select v-model="f_data.sel_role" expanded @input="ac_crz=''">
                    <option value>Select Role</option>
                    <option v-for="(r, ind) in roles" :value="ind" :key="ind">{{ r }}</option>
                  </b-select>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2" v-if="f_data.sel_role !== ''">
              <div class="column">
                <b-field
                  class="cus-des-1"
                  expanded
                  :type="(validation.hasError('f_data.sel_crz_id')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_crz_id')"
                >
                  <b-autocomplete
                    :placeholder="`Enter ${roles[f_data.sel_role]}`"
                    :data="crz_list"
                    v-model="ac_crz"
                    field="name"
                    expanded
                    :keep-first="true"
                    @select="option => f_data.sel_crz_id = option ? option.id : null"
                    @input="loadCRZ"
                    :loading="isFetching"
                  ></b-autocomplete>
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
                <th>Code</th>
                <th>MJ ID</th>
                <th>Head Of Depart</th>
                <th>Name Of Area</th>
                <th>Name Of Role</th>
                <th>Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <asnRoleRow
                v-for="(row, ind) in l_data"
                :key="ind"
                :row="row"
                :edit="row.id===row_edit_id"
                @loading="loading=$event"
                @loadData="loadData"
                @row_edit="row_edit_id=$event"
              ></asnRoleRow>
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
import asnRoleRow from "~/components/forms/assign_role_row.vue";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter,
    asnRoleRow
  },
  data() {
    return {
      loading_form: false,
      roles: ["Country", "Sales Coordinator", "Zone"],
      row_edit_id: null,
      isFetching: false,
      ac_crz: "",
      crz_list: [],
      search_mj_user: "",
      submitted: false,
      s_name: "",
      f_data: {
        mem_id: "",
        sel_role: "",
        sel_crz_id: null
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
                  .post("/api/assign-role/get-user-check", {
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
    "f_data.sel_role": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(3);
    },
    "f_data.sel_crz_id": {
      cache: false,
      validator: function(value) {
        const self = this;

        let validator = Validator.value(value)
          .required()
          .digit()
          .maxLength(11);

        if (validator.hasImmediateError()) {
          return validator;
        } else {
          return validator.custom(() => {
            if (!Validator.isEmpty(value)) {
              return self.$axios
                .get(`/api/assign-role/exist-check/${value}`)
                .then(res => {
                  if (res.data.count > 0) {
                    return "Already assigned.";
                  }
                });
            }
          });
        }
      }
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
        .get("/api/assign-role/list", {
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
    after_f_settle: _.debounce(function(cb) {
      cb();
    }, 500),
    loadCRZ() {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.f_data.sel_crz_id !== null) {
          self.isFetching = false;
          return;
        }
        // self.isFetching = true;
        self.crz_list = [];

        if (!self.ac_crz.length) {
          self.crz_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(
            `/api/crzb-list/ac_search_list/${self.f_data.sel_role}/${
              self.ac_crz
            }`
          )
          .then(({ data }) => {
            self.crz_list = data.result;
          })
          .catch(error => {
            self.crz_list = [];
            throw error;
          })
          .finally(() => {
            self.isFetching = false;
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
            .post("/api/assign-role/assign", self.f_data)
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
        sel_role: "",
        sel_crz_id: null
      };
      this.search_mj_user = "";
      this.s_name = "";
      this.submitted = false;
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
