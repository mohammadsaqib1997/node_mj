<template>
  <tr :class="[{form: edit_row.row_id === row.id}, 'ar_row']">
    <td>{{ row.id }}</td>
    <td>{{ row.code }}</td>
    <td>{{ row.mj_id }}</td>
    <td>{{ row.mj_name }}</td>
    <td :class="{'vc-top': edit_row.row_id === row.id}">
      <template v-if="edit_row.row_id !== row.id">{{ row.name }}</template>
      <b-field
        class="cus-des-1"
        v-else
        :type="(validation.hasError('edit_row.form.crz_id')) ? 'is-danger':''"
        :message="validation.firstError('edit_row.form.crz_id')"
      >
        <b-autocomplete
          :placeholder="`Update New ${roles[edit_row.form.role]}`"
          :data="crz_list"
          v-model="edit_row.form.ac_crz"
          field="name"
          expanded
          :keep-first="true"
          @select="option => edit_row.form.crz_id = option ? option.id : null"
          @input="function() { return edit_row.form.role <= 2  ? loadCRZ(): null }"
          :loading="isFetching"
          :disabled="edit_row.form.role > 2"
        ></b-autocomplete>
      </b-field>
    </td>
    <td :class="{'vc-top': edit_row.row_id === row.id}">
      <template v-if="edit_row.row_id !== row.id">{{ roles[row.type] }}</template>
      <b-field
        v-else
        class="cus-des-1"
        :type="(validation.hasError('edit_row.form.role')) ? 'is-danger':''"
        :message="validation.firstError('edit_row.form.role')"
      >
        <b-select v-model="edit_row.form.role" expanded @input="edit_row.form.ac_crz=''">
          <option v-for="(r, ind) in roles" :value="ind" :key="ind">{{ r }}</option>
        </b-select>
      </b-field>
    </td>
    <td>
      <b-field grouped>
        <template v-if="edit_row.row_id !== row.id">
          <p class="control">
            <button class="button is-small is-info" @click.prevent="rowEdit(row)">Edit</button>
          </p>
          <p class="control">
            <button
              @click.prevent="toggleSts(row, !row.role_status)"
              :class="['button is-small', {'is-danger': row.role_status === 1, 'is-success': row.role_status === 0}]"
            >{{ row.role_status === 0 ? 'Active':'Deactive' }}</button>
          </p>
        </template>
        <template v-else>
          <p class="control">
            <button class="button is-small is-danger" @click.prevent="cancelRowEdit">Cancel</button>
          </p>
          <p class="control">
            <button class="button is-small is-success" @click.prevent="saveRow">Save</button>
          </p>
        </template>
      </b-field>
    </td>
  </tr>
</template>

<script>
import _ from "lodash";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  props: {
    row: {
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    edit(val) {
      if (val === false) {
        this.cancelRowEdit();
      }
    }
  },
  data() {
    return {
      roles: ["Country", "Sales Coordinator", "Zone"],
      crz_list: [],
      isFetching: false,
      edit_row: {
        row_id: null,
        data: null,
        form: {
          ac_crz: "",
          crz_id: null,
          role: ""
        }
      }
    };
  },
  validators: {
    "edit_row.form.crz_id": {
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
    },
    "edit_row.form.role": function(value) {
      return Validator.value(value)
        .required()
        .digit()
        .lessThanOrEqualTo(3);
    }
  },
  methods: {
    after_f_settle: _.debounce(function(cb) {
      cb();
    }, 500),
    loadCRZ() {
      const self = this;
      self.isFetching = true;
      self.after_f_settle(function() {
        if (self.edit_row.form.crz_id !== null) {
          self.isFetching = false;
          return;
        }
        self.crz_list = [];

        if (!self.edit_row.form.ac_crz.length) {
          self.crz_list = [];
          self.isFetching = false;
          return;
        }
        self.$axios
          .get(
            `/api/crzb-list/ac_search_list/${self.edit_row.form.role}/${
              self.edit_row.form.ac_crz
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
          self.$emit("loading", true);
          await self.$axios
            .post("/api/assign-role/toggle-status", {
              row_id: row.id,
              change_sts: asn_sts,
              crz_id: row.crzb_id
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
              self.$emit("loadData", true);
            })
            .catch(err => {
              self.$emit("loading", false);
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
    rowEdit(row) {
      const self = this;
      self.$emit("row_edit", row.id);
      self.edit_row = {
        row_id: row.id,
        data: row,
        form: {
          ac_crz: "",
          crz_id: null,
          role: row.type
        }
      };
    },
    cancelRowEdit() {
      const self = this;
      self.edit_row = {
        row_id: null,
        data: null,
        form: {
          ac_crz: "",
          crz_id: null,
          role: ""
        }
      };
      self.validation.reset();
    },
    saveRow() {
      const self = this;
      self.$emit("loading", true);
      self.$validate().then(function(success) {
        if (success) {
          const send_data = {
            updated_id: self.edit_row.data.id,
            crz_id: self.edit_row.form.crz_id
          };
          self.$axios
            .post("/api/assign-role/update-row", send_data)
            .then(async res => {
              self.cancelRowEdit();
              self.$toast.open({
                duration: 1000,
                message: "Successfully Updated Row!",
                position: "is-bottom",
                type: "is-success"
              });
              self.$emit("loadData", true);
            })
            .catch(err => {
              console.log(err);
              self.$emit("loading", false);
              self.$toast.open({
                duration: 1000,
                message: "Server Error!",
                position: "is-bottom",
                type: "is-danger"
              });
            });
        } else {
          self.$emit("loading", false);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ar_row {
  /deep/ {
    .vc-top {
      vertical-align: top !important;
    }
  }
}
</style>

