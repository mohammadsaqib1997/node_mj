<template>
  <b-modal class="add_subsidiary" :active.sync="modalAct" :canCancel="false">
    <div class="box main-box">
      <div class="header">
        <h1>Subsidiary</h1>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="updated === false ? add(): update()">
            <p v-if="err !== ''" class="error">{{ err }}</p>

            <label>{{ updated === false ? 'Add':'Update' }} Subsidiary</label>
            <b-field grouped>
              <b-field
                class="cus-des-1"
                :type="(validation.hasError('f_data.sel_control')) ? 'is-danger':''"
                :message="validation.firstError('f_data.sel_control')"
                expanded
              >
                <b-select v-model="f_data.sel_control" expanded>
                  <option value>Select Controller</option>
                  <option
                    v-for="(data, ind) in list_controllers"
                    :key="ind"
                    :value="data.code"
                  >{{ data.name }}</option>
                </b-select>
              </b-field>

              <b-field
                :type="(validation.hasError('f_data.subs_name')) ? 'is-danger':''"
                :message="validation.firstError('f_data.subs_name')"
                expanded
              >
                <b-input
                  type="text"
                  placeholder="Subsidiary Name"
                  v-model="f_data.subs_name"
                  autocomplete="off"
                ></b-input>
              </b-field>

              <b-field>
                <p class="control">
                  <button
                    class="button btn-des-1"
                    type="submit"
                  >{{ updated === false ? 'Add':'Update' }}</button>
                </p>
              </b-field>
            </b-field>
          </form>
          <hr>

          <section class="section em-sec" v-if="list_data.length < 1">
            <div class="content has-text-grey has-text-centered">
              <p>
                <span class="icon is-large">
                  <i class="far fa-frown fa-3x"></i>
                </span>
              </p>
              <p>Nothing here.</p>
            </div>
          </section>
          <table class="table is-fullwidth is-bordered" v-else>
            <thead>
              <tr>
                <th>Controller Name</th>
                <th>Subsidiary Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, ind) in list_data" :key="ind">
                <td>{{ data.p_name }}</td>
                <td>{{ data.name }}</td>
                <td>
                  <b-field grouped>
                    <p class="control">
                      <button
                        class="button is-small btn-sm-des-1 danger"
                        @click="deleteSubs(data.id)"
                      >Delete</button>
                    </p>
                    <p class="control">
                      <button
                        class="button is-small btn-sm-des-1"
                        @click.prevent="updateLoadData(data.id)"
                      >Edit</button>
                    </p>
                  </b-field>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="d-flex">
            <button
              class="button btn-des-1 dark"
              type="button"
              @click.prevent="modalAct=false;"
            >Close</button>
          </div>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import mxn_modal from "~/mixins/modal.js";
import _ from "lodash";
export default {
  mixins: [mxn_modal],
  watch: {
    modalAct: function(val) {
      if (val === false) {
        this.resetData();
      }
    }
  },
  data() {
    return {
      loading: false,
      updated: false,
      updated_id: null,
      list_data: [],
      list_controllers: [],
      err: "",
      f_data: {
        sel_control: "",
        subs_name: ""
      }
    };
  },
  validators: {
    "f_data.sel_control": function(value) {
      return Validator.value(value)
        .required()
        .maxLength(10);
    },
    "f_data.subs_name": function(value) {
      return Validator.value(value)
        .required()
        .maxLength(100);
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/c_subsidiary/list_controllers")
        .then(res => {
          self.list_controllers = res.data.result;
        })
        .catch(err => {
          console.log(err);
        });
      await self.$axios
        .get("/api/c_subsidiary/list")
        .then(res => {
          self.list_data = res.data.result;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    add() {
      const self = this;
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          await self.$axios
            .post("/api/c_subsidiary/add", self.f_data)
            .then(async res => {
              if (res.data.status === true) {
                self.resetData();
                self.$toast.open({
                  duration: 1000,
                  message: "Successfully Add Subsidiary!",
                  position: "is-bottom",
                  type: "is-success"
                });
                await self.loadData();
              } else {
                self.err = res.data.message;
              }
            })
            .catch(err => {
              console.log(err);
              self.err = "Server Error!";
            });
          self.loading = false;
        }
      });
    },

    update() {
      const self = this;
      self.err = "";
      self.$validate().then(async function(success) {
        if (success) {
          self.loading = true;
          let update_data = _.cloneDeep(self.f_data);
          update_data["update_id"] = self.updated_id;
          await self.$axios
            .post("/api/c_subsidiary/update", update_data)
            .then(async res => {
              if (res.data.status === true) {
                self.resetData();
                self.$toast.open({
                  duration: 1000,
                  message: "Successfully Update Subsidiary!",
                  position: "is-bottom",
                  type: "is-success"
                });
                await self.loadData();
              } else {
                self.err = res.data.message;
              }
            })
            .catch(err => {
              console.log(err);
              self.err = "Server Error!";
            });
          self.loading = false;
        }
      });
    },

    updateLoadData(id) {
      const self = this;
      self.updated_id = id;
      self.updated = true;
      const sel_update_form = _.cloneDeep(_.find(self.list_data, { id }));

      self.f_data = {
        sel_control: sel_update_form.p_code,
        subs_name: sel_update_form.name
      };
    },

    async deleteSubs(id) {
      const self = this;
      self.loading = true;
      await self.$axios
        .post("/api/c_subsidiary/delete", { del_id: id })
        .then(async res => {
          if (res.data.status === true) {
            self.resetData();
            self.$toast.open({
              duration: 1000,
              message: "Successfully Delete Subsidiary!",
              position: "is-bottom",
              type: "is-success"
            });
            await self.loadData();
          } else {
            self.err = res.data.message;
          }
        })
        .catch(err => {
          console.log(err);
          self.err = "Server Error!";
        });
      self.loading = false;
    },

    resetData() {
      this.updated_id = null;
      this.updated = false;
      this.f_data = {
        sel_control: "",
        subs_name: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.add_subsidiary /deep/ {
  .form {
    > label {
      font-weight: 300;
      line-height: normal;
      font-size: 18px;
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  .d-flex {
    @media screen and (min-width: 426px) {
      display: flex;
      justify-content: flex-end;
    }

    & > .button {
      margin-top: 0;
      @media screen and (max-width: 425px) {
        width: 100%;
      }

      &:last-child {
        @media screen and (min-width: 426px) {
          margin-left: 1rem;
        }
      }
    }
  }

  .btn-sm-des-1 {
    padding: 4px 12px;
    height: auto;
    font-weight: 500;
    font-size: 12px;

    &:not(.active) {
      color: #666666;
      &:focus {
        box-shadow: 0 0 0 0.12em #d9bd68 !important;
        border-color: transparent;
      }
    }

    &.danger {
      color: #ffffff;
      background-color: #ff9999;
      border-color: #bd5e5e;
      &:focus {
        box-shadow: 0 0 0 0.12em #f17777 !important;
        border-color: transparent;
      }
    }
  }

  & > .section {
    min-height: 200px;
  }
  .section {
    .btns-cont {
      justify-content: center;

      & > .btn-des-1:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}
</style>