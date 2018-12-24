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
                  <b-select v-model="f_data.sel_role" expanded @input="ac_crzb=''">
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
                  :type="(validation.hasError('f_data.sel_crzb_id')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_crzb_id')"
                >
                  <b-autocomplete
                    :placeholder="`Enter ${roles[f_data.sel_role]}`"
                    :data="crzb_list"
                    v-model="ac_crzb"
                    field="name"
                    expanded
                    :keep-first="true"
                    @select="option => f_data.sel_crzb_id = option ? option.id : null"
                    @input="loadCRZB"
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
    // self.loading_form = true;
    // self.loading_form = false;
  },
  data() {
    return {
      loading_form: false,
      roles: ["Country", "Region", "Zone", "Branch"],
      isFetching: false,
      ac_crzb: "",
      crzb_list: [],
      search_mj_user: "",
      submitted: false,
      s_name: "",
      f_data: {
        mem_id: "",
        sel_role: "",
        sel_crzb_id: null
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
                if (value !== self.f_data.user_asn_id) {
                  return self.$axios
                    .post("/api/crzb-list/get-user-info", {
                      email: value
                    })
                    .then(res => {
                      if (res.data.count < 1) {
                        return "Invalid User.";
                      } else {
                        self.s_name = res.data.result.full_name;
                        self.f_data.mem_id = res.data.result.id;
                      }
                    });
                } else {
                  return "Invalid User.";
                }
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
    "f_data.sel_crzb_id": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(11);
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
      // await self.$axios
      //   .get("/api/voucher/list_voucher", {
      //     params: self.load_params
      //   })
      //   .then(res => {
      //     self.l_data = res.data.data;
      //     self.num_rows = res.data.tot_rows;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      self.loading = false;
    },
    after_f_settle: _.debounce(function(cb) {
      cb();
    }, 500),
    loadCRZB() {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.f_data.sel_crzb_id !== null) {
          self.isFetching = false;
          return;
        }
        // self.isFetching = true;
        self.crzb_list = [];

        if (!self.ac_crzb.length) {
          self.crzb_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(
            `/api/crzb-list/ac_search_list/${self.f_data.sel_role}/${
              self.ac_crzb
            }`
          )
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
      self.$validate().then(function(success) {
        if (success) {
          self.$toast.open({
            duration: 1000,
            message: "Successfully Submitted!",
            position: "is-bottom",
            type: "is-success"
          });
          self.reset();
          // let form_data = new FormData();
          // if (self.f_data.logo !== null) {
          //   form_data.append("logo", self.f_data.logo);
          // }

          // form_data.append("address", self.f_data.address);
          // form_data.append("city", self.f_data.city);
          // form_data.append("cont_num", self.f_data.cont_num);
          // form_data.append("discount", self.f_data.discount.replace("%", ""));
          // form_data.append("email", self.f_data.email);
          // form_data.append("full_name", self.f_data.full_name);

          // let config = {
          //   headers: { "content-type": "multipart/form-data" }
          // };
          // self.$axios
          //   .post("/api/partner/add", form_data, config)
          //   .then(res => {
          //     self.reset();
          //     self.form.loading = false;
          //     self.form.suc = "Successfully Partner Added.";
          //     setTimeout(() => (self.form.suc = ""), 2000);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //     self.form.loading = false;
          //     self.form.err = "Server Error!";
          //     $(".main-content").animate({ scrollTop: 20 }, 500);
          //   });
        }
      });
    },
    reset() {
      // this.f_data = {
      //   start_date: null,
      //   end_date: null,
      //   img: null
      // };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
