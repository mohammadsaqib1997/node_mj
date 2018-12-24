<template>
  <div class="wrapper">
    <div class="tab-cont columns is-variable is-1">
      <div class="column is-6">
        <button :class="[{ 'active': tab_act === 0 }, 'button btn-des-1']" @click="tab_act=0;">Sales</button>
      </div>
      <div class="column is-6">
        <button
          :class="[{ 'active': tab_act === 1 }, 'button btn-des-1']"
          @click="tab_act=1;"
        >Commission</button>
      </div>
    </div>

    <div class="box counter-box">
      <div class="columns is-gapless is-multiline">
        <div class="column is-12-mobile is-6-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <div class="tile is-ancestor c-tile is-parent">
                <div class="tile is-vertical is-narrow">
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                </div>
                <div class="tile is-vertical">
                  <div class="tile is-child">
                    <span>Monthly Sale</span>
                  </div>
                  <div class="tile is-child">
                    <span>Yearly Sale</span>
                  </div>
                  <div class="tile is-child">
                    <span>Total Sale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <h5 class="title-cus-1">Region Sale</h5>
              <div class="tile is-ancestor c-tile is-parent">
                <div class="tile is-vertical is-narrow">
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>0</h5>
                  </div>
                </div>
                <div class="tile is-vertical">
                  <div class="tile is-child">
                    <span>Sindh</span>
                  </div>
                  <div class="tile is-child">
                    <span>Punjab</span>
                  </div>
                  <div class="tile is-child">
                    <span>Balochistan</span>
                  </div>
                  <div class="tile is-child">
                    <span>KPK</span>
                  </div>
                  <div class="tile is-child">
                    <span>Fata</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-12-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <div class="amount-wrapper">
                <b>Pakistan</b>
                <h1>0</h1>
              </div>
              <h5 class="title-cus-2">Country Sale</h5>
            </div>
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active="false" :can-cancel="false"></b-loading>
    </div>

    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Sales List</h1>
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
      tab_act: 0,
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
.wrapper {
  /deep/ {
    .tab-cont {
      .btn-des-1 {
        width: 100%;
        margin-top: 0;
        font-weight: 300;
        font-size: 20px;
        box-shadow: none;
        background-color: #3d3e5a;
        color: #d9bd68 !important;
        &:after {
          background-color: #2a2b42;
        }

        &.active {
          background-color: #d9bd68;
          color: #2a2b42 !important;
          box-shadow: 0 2px 20px 2px #ccc !important;
          &:after {
            background-color: #ab9142;
          }
        }
      }
    }

    .counter-box {
      position: relative;
      & > .columns {
        & > .column {
          &:nth-child(3) {
            border-right: none !important;
          }
        }
      }
      h5 {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        &.title-cus-1 {
          color: #d9bd68;
          padding: 0 0.75rem;
          text-align: left;
        }
        &.title-cus-2 {
          color: #ffffff;
        }
      }

      .flex {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        .c-tile {
          margin: 0;
          display: flex;
          text-align: left;
          h5,
          span {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          h5 {
            color: #d9bd68;
          }
          span {
            color: #ffffff;
            display: inline-block;
            margin-left: 10px;
          }
          .tile.is-vertical > .is-child:not(:last-child) {
            margin-bottom: 10px !important;
          }
          .is-narrow {
            flex: none;
            text-align: right;
          }
        }
        .amount-wrapper {
          b {
            text-transform: uppercase;
          }
          h1 {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
