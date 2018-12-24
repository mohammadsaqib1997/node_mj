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
          <form class="form" @submit.prevent="submit">
            <div class="columns is-variable is-2">
              <div class="column">
                <b-field
                  class="cus-des-1"
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-select v-model="f_data.sel_role" expanded>
                    <option value>Select Country</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  class="cus-des-1"
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-select v-model="f_data.sel_role" expanded>
                    <option value>Select Region</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  class="cus-des-1"
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-select v-model="f_data.sel_role" expanded>
                    <option value>Select Zone</option>
                  </b-select>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-input type="text" placeholder="Enter Branch Name" v-model="f_data.sel_role"></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-variable is-2">
              <div class="column is-6">
                <b-field
                  expanded
                  :type="(validation.hasError('f_data.sel_role')) ? 'is-danger':''"
                  :message="validation.firstError('f_data.sel_role')"
                >
                  <b-input type="textarea" placeholder="Enter Branch Description" v-model="f_data.sel_role"></b-input>
                </b-field>
              </div>
            </div>

            <b-field>
              <p class="control">
                <button type="submit" class="button btn-des-1">Save</button>
              </p>
            </b-field>
          </form>
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
      f_data: {
        mj_id: "",
        sel_role: "",
        start_date: null,
        end_date: null,
        img: null
      }
    };
  },
  validators: {
    "f_data.start_date": function(value) {
      return Validator.value(value).required();
    },
    "f_data.end_date": function(value) {
      return Validator.value(value).required();
    },
    "f_data.img": function(value) {
      return Validator.value(value).required();
    }
  },
  methods: {
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
      this.f_data = {
        start_date: null,
        end_date: null,
        img: null
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
