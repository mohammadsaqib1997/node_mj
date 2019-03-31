<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Zone Management</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="updated_id !== null ? update(): submit()">
            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.sel_cr_id')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_cr_id')"
                >
                  <b-autocomplete
                    :data="cr_list"
                    v-model="ac_cr"
                    field="name"
                    expanded
                    :keep-first="true"
                    @select="option => f_data.sel_cr_id = option ? option.id : null"
                    @input="loadCR"
                    :loading="isFetching"
                    placeholder="Search by Sales Coordinator, Country"
                  ></b-autocomplete>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.zone')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.zone')"
                >
                  <b-input
                    type="text"
                    placeholder="Enter Zone Name"
                    v-model="f_data.zone"
                    :loading="validation.isValidating('f_data.zone')"
                    :disabled="!f_data.sel_cr_id ? true: false"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.desc')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.desc')"
                >
                  <b-input
                    type="textarea"
                    placeholder="Enter Zone Description"
                    v-model="f_data.desc"
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
                >Create New Zone</button>
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
          <h1>Zone List</h1>
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
      is_auto_cr: false,
      loading_form: false,
      isFetching: false,
      submitted: false,
      ac_cr: "",
      cr_list: [],
      f_data: {
        sel_cr_id: null,
        zone: "",
        desc: ""
      }
    };
  },
  watch: {
    "f_data.sel_cr_id": function(val) {
      if (val === null) {
        this.f_data.zone = "";
      }
    }
  },
  validators: {
    "f_data.sel_cr_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .maxLength(11);
    },
    "f_data.zone": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;

        if (self.submitted || self.validation.isTouched("f_data.zone")) {
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
                  self.f_data.sel_cr_id == self.load_upd_data.parent_id &&
                  value.toLowerCase() == self.load_upd_data.name.toLowerCase()
                ) {
                  return;
                }
                if (!Validator.isEmpty(self.f_data.sel_cr_id)) {
                  return self.$axios
                    .get(
                      `/api/crzb-list/exist-check/${
                        self.f_data.sel_cr_id
                      }/${value}`
                    )
                    .then(res => {
                      if (res.data.count > 0) {
                        return "Zone name is already exist in Sales Coordinator!";
                      }
                    });
                }
              }
            });
          }
        }
      }
    },
    "f_data.desc": function(value) {
      return Validator.value(value).maxLength(250);
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/crzb-list/zone-list", {
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
    loadCR(event) {
      const self = this;
      self.isFetching = true;
      if (self.is_auto_cr && event !== self.load_upd_data.parent_name) {
        self.f_data.sel_cr_id = null;
        self.is_auto_cr = false;
      }
      self.after_f_settle(function() {
        if (self.f_data.sel_cr_id !== null) {
          self.isFetching = false;
          return;
        }
        self.cr_list = [];

        if (!self.ac_cr.length) {
          self.cr_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(`/api/crzb-list/ac_search_cr/${self.ac_cr}`)
          .then(({ data }) => {
            self.cr_list = data.result;
          })
          .catch(error => {
            self.cr_list = [];
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
            .post("/api/crzb-list/zone-add", self.f_data)
            .then(async res => {
              self.reset();
              self.loading_form = false;
              self.$toast.open({
                duration: 1000,
                message: "Successfully Zone Added!",
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
            .post("/api/crzb-list/zone-update", data)
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
                  message: "Successfully Zone Updated!",
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
        sel_cr_id: null,
        zone: "",
        desc: ""
      };
      this.is_auto_cr = false;
      this.ac_cr = "";
      this.submitted = false;
      this.validation.reset();
    },
    toggleActRow(id, sts) {
      const self = this;
      this.$dialog.confirm({
        title: `${sts === 1 ? "Disable" : "Enable"} Zone!`,
        message: `Are you sure you want to <b>${
          sts === 1 ? "disable" : "enable"
        }</b> zone?`,
        confirmText: `${sts === 1 ? "Disable" : "Enable"}`,
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          self.loading = true;
          await self.$axios
            .post("/api/crzb-list/tg-act-zone", {
              tgl_id: id,
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
                  message: `Successfully zone ${
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
        .get(`/api/crzb-list/zone-load/${id}`)
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
            self.is_auto_cr = true;
            self.f_data = {
              sel_cr_id: self.load_upd_data.parent_id,
              zone: self.load_upd_data.name,
              desc: self.load_upd_data.description
            };
            self.ac_cr = self.load_upd_data.parent_name;
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
      self.is_auto_cr = false;
      self.updated_id = null;
      self.load_upd_data = null;
      self.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
