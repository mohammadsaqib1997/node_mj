<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Branch Management</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="updated_id !== null ? update(): submit()">
            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.sel_crzb_id')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_crzb_id')"
                >
                  <b-autocomplete
                    :data="crzb_list"
                    v-model="ac_crzb"
                    field="name"
                    expanded
                    :keep-first="true"
                    @select="option => f_data.sel_crzb_id = option ? option.id : null"
                    @input="loadCRZB"
                    :loading="isFetching"
                    placeholder="Search by Zone, Region, Country"
                  ></b-autocomplete>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.branch')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.branch')"
                >
                  <b-input
                    type="text"
                    placeholder="Enter Branch Name"
                    v-model="f_data.branch"
                    :loading="validation.isValidating('f_data.branch')"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.branch_desc')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.branch_desc')"
                >
                  <b-input
                    type="textarea"
                    placeholder="Enter Branch Description"
                    v-model="f_data.branch_desc"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <b-field grouped>
              <p class="control">
                <button
                  type="submit"
                  class="button btn-des-1"
                >{{ updated_id !== null ? 'Update': 'Save' }}</button>
              </p>

              <p class="control" v-if="updated_id !== null">
                <button
                  type="button"
                  class="button btn-des-1 dark"
                  @click="resetUpdateForm"
                >Create New Branch</button>
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
          <h1>Branch List</h1>
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
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.id }}</td>
                <td>{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.description }}</td>
                <td>
                  <b-field grouped>
                    <p class="control">
                      <button
                        @click.prevent="toggleActRow(row.id, row.active)"
                        :class="[{'is-danger': row.active === 1}, {'is-success': row.active === 0}, 'button is-small']"
                      >{{ row.active === 1 ? 'Disable':'Enable' }}</button>
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
  data() {
    return {
      updated_id: null,
      load_upd_data: null,
      is_auto_crzb: false,
      loading_form: false,
      isFetching: false,
      submitted: false,
      ac_crzb: "",
      crzb_list: [],
      f_data: {
        sel_crzb_id: null,
        branch: "",
        branch_desc: ""
      }
    };
  },
  validators: {
    "f_data.sel_crzb_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "f_data.branch": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;

        if (self.submitted || self.validation.isTouched("f_data.branch")) {
          let validator = Validator.value(value)
            .required()
            .maxLength(100);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              if (!Validator.isEmpty(value)) {
                if (
                  self.updated_id !== null &&
                  self.f_data.sel_crzb_id == self.load_upd_data.parent_id &&
                  value.toLowerCase() == self.load_upd_data.name.toLowerCase()
                ) {
                  return;
                }
                if (!Validator.isEmpty(self.f_data.sel_crzb_id)) {
                  return self.$axios
                    .get(
                      `/api/crzb-list/exist-check/${
                        self.f_data.sel_crzb_id
                      }/${value}`
                    )
                    .then(res => {
                      if (res.data.count > 0) {
                        return "Branch name is already existed!";
                      }
                    });
                }
              }
            });
          }
        }
      }
    },
    "f_data.branch_desc": function(value) {
      return Validator.value(value).maxLength(250);
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/crzb-list/branch-list", {
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
    loadCRZB(event) {
      const self = this;
      self.isFetching = true;
      if (self.is_auto_crzb && event !== self.load_upd_data.parent_name) {
        self.f_data.sel_crzb_id = null;
        self.is_auto_crzb = false;
      }
      self.after_f_settle(function() {
        if (self.f_data.sel_crzb_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crzb_list = [];

        if (!self.ac_crzb.length) {
          self.crzb_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(`/api/crzb-list/ac_search_zone/${self.ac_crzb}`)
          .then(({ data }) => {
            self.crzb_list = data.result;
          })
          .catch(error => {
            self.crzb_list = [];
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
      self.$validate().then(function(success) {
        if (success) {
          self.loading_form = true;
          self.$axios
            .post("/api/crzb-list/branch-added", self.f_data)
            .then(async res => {
              self.reset();
              self.loading_form = false;
              self.$toast.open({
                duration: 1000,
                message: "Successfully Branch Added!",
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
        }
      });
    },
    update() {
      const self = this;
      self.submitted = true;
      self.$validate().then(function(success) {
        if (success) {
          self.loading_form = true;
          let data = _.cloneDeep(self.f_data);
          data["update_id"] = self.updated_id;
          self.$axios
            .post("/api/crzb-list/branch-update", data)
            .then(async res => {
              if (res.data.status === false) {
                self.loading_form = false;
                self.$toast.open({
                  duration: 1000,
                  message: res.data.message,
                  position: "is-bottom",
                  type: "is-danger"
                });
              } else {
                self.resetUpdateForm();
                self.loading_form = false;
                self.$toast.open({
                  duration: 1000,
                  message: "Successfully Branch Updated!",
                  position: "is-bottom",
                  type: "is-success"
                });
                await self.loadData();
              }
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
        }
      });
    },
    reset() {
      this.f_data = {
        sel_crzb_id: null,
        branch: "",
        branch_desc: ""
      };
      this.is_auto_crzb = false;
      this.ac_crzb = "";
      this.submitted = false;
      this.validation.reset();
    },
    toggleActRow(id, sts) {
      const self = this;
      this.$dialog.confirm({
        title: `${sts === 1 ? "Disable" : "Enable"} Branch!`,
        message: `Are you sure you want to <b>${
          sts === 1 ? "disable" : "enable"
        }</b> branch?`,
        confirmText: `${sts === 1 ? "Disable" : "Enable"}`,
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          self.loading = true;
          await self.$axios
            .post("/api/crzb-list/tg-act-branch", {
              del_id: id,
              sts
            })
            .then(async res => {
              if (res.data.status === false) {
                self.$toast.open({
                  duration: 1000,
                  message: res.data.message,
                  position: "is-bottom",
                  type: "is-danger"
                });
              } else {
                self.$toast.open({
                  duration: 1000,
                  message: `Successfully branch ${
                    sts === 1 ? "disabled" : "enabled"
                  }.`,
                  position: "is-bottom",
                  type: "is-success"
                });
                await self.loadData();
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
      });
    },
    async loadUpdateData(id) {
      const self = this;
      self.reset();
      self.loading_form = true;
      await self.$axios
        .get(`/api/crzb-list/branch-load/${id}`)
        .then(res => {
          if (res.data.status === false) {
            self.$toast.open({
              duration: 1000,
              message: "Invalid ID!",
              position: "is-bottom",
              type: "is-danger"
            });
          } else {
            self.load_upd_data = res.data.result;
            self.is_auto_crzb = true;
            self.f_data = {
              sel_crzb_id: self.load_upd_data.parent_id,
              branch: self.load_upd_data.name,
              branch_desc: self.load_upd_data.description
            };
            self.ac_crzb = self.load_upd_data.parent_name;
            self.updated_id = id;
          }
        })
        .catch(err => {
          console.log(err);
        });
      self.loading_form = false;
      $(".main-content").animate({ scrollTop: 20 }, 500);
    },
    resetUpdateForm() {
      const self = this;
      self.is_auto_crzb = false;
      self.updated_id = null;
      self.load_upd_data = null;
      self.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
