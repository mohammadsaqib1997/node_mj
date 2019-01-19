<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Campaign Create</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <form class="form" @submit.prevent="submit">
            <b-field grouped>
              <b-field
                expanded
                label="Campaign Start"
                :type="(validation.hasError('f_data.start_date')) ? 'is-danger':''"
                :message="validation.firstError('f_data.start_date')"
              >
                <b-datepicker
                  placeholder="Start Date"
                  :min-date="cur_date"
                  :max-date="max_date"
                  v-model="f_data.start_date"
                ></b-datepicker>
              </b-field>
              <b-field
                expanded
                label="Campaign End"
                :type="(validation.hasError('f_data.end_date')) ? 'is-danger':''"
                :message="validation.firstError('f_data.end_date')"
              >
                <b-datepicker
                  placeholder="End Date"
                  :min-date="min_date || manageDay(cur_date, 1)"
                  v-model="f_data.end_date"
                ></b-datepicker>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field
                expanded
                label="Reward Name"
                :type="(validation.hasError('f_data.reward_name')) ? 'is-danger':''"
                :message="validation.firstError('f_data.reward_name')"
              >
                <b-input type="text" placeholder="Reward Name" v-model="f_data.reward_name"></b-input>
              </b-field>
              <b-field
                label="Total Referrals"
                :type="(validation.hasError('f_data.total_ref')) ? 'is-danger':''"
                :message="validation.firstError('f_data.total_ref')"
              >
                <b-input
                  type="tel"
                  placeholder="Total Referrals"
                  v-model="f_data.total_ref"
                  v-mask="'######'"
                ></b-input>
              </b-field>
              <b-field
                label="Team Referrals"
                :type="(validation.hasError('f_data.team_ref')) ? 'is-danger':''"
                :message="validation.firstError('f_data.team_ref')"
              >
                <b-input
                  type="tel"
                  placeholder="Team Referrals"
                  v-model="f_data.team_ref"
                  v-mask="'######'"
                ></b-input>
              </b-field>
            </b-field>

            <b-field>
              <p class="control">
                <button type="submit" class="button btn-des-1">Save</button>
              </p>
            </b-field>
            <b-loading :is-full-page="false" :active="formLoading" :can-cancel="false"></b-loading>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mask } from "vue-the-mask";
import { DateTime } from "luxon";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  layout: "admin_layout",
  directives: {
    mask
  },
  computed: {
    min_date: function() {
      if (this.f_data.start_date !== null) {
        return new Date(moment(this.f_data.start_date).add(1, "d"));
      } else {
        return null;
      }
    },
    max_date: function() {
      if (this.f_data.end_date !== null) {
        return new Date(moment(this.f_data.end_date).subtract(1, "d"));
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      cur_date: new Date(
        DateTime.local()
          .setZone("UTC+5")
          .plus({ days: -1 })
          .toString()
      ),
      f_data: {
        start_date: null,
        end_date: null,
        reward_name: "",
        total_ref: "",
        team_ref: ""
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
    "f_data.reward_name": function(value) {
      return Validator.value(value)
        .required()
        .minLength(5)
        .maxLength(250);
    },
    "f_data.total_ref": function(value) {
      return Validator.value(value)
        .required()
        .greaterThanOrEqualTo(5)
        .lessThanOrEqualTo(100000);
    },
    "f_data.team_ref": function(value) {
      return Validator.value(value)
        .required()
        .greaterThanOrEqualTo(5)
        .lessThanOrEqualTo(100000);
    }
  },
  methods: {
    manageDay(date, setDay) {
      return new Date(
        DateTime.fromJSDate(date)
          .setZone("UTC+5")
          .plus({ days: setDay })
          .toString()
      );
    },
    submit() {
      const self = this;
      self.$validate().then(function(success) {
        if (success) {
          self.formLoading = true;
          let msg = "",
            is_err = false,
            send_data = _.cloneDeep(self.f_data);
          send_data["end_date"] = DateTime.fromJSDate(self.f_data["end_date"])
            .setZone("UTC+5")
            .set({ hour: 23, minute: 59, second: 59 });
          self.$axios
            .post("/api/campaign/add", send_data)
            .then(res => {
              if (res.data.status === true) {
                self.reset();
                msg = "Successfully Partner Added.";
              } else {
                is_err = true;
                msg = res.data.message;
              }
            })
            .catch(err => {
              console.log(err);
              is_err = true;
              msg = "Server Error!";
            })
            .finally(() => {
              self.formLoading = false;
              self.$toast.open({
                duration: 1000,
                message: msg,
                position: "is-bottom",
                type: is_err ? "is-danger" : "is-success"
              });
            });
        }
      });
    },
    reset() {
      this.f_data = {
        start_date: null,
        end_date: null,
        reward_name: "",
        total_ref: "",
        team_ref: ""
      };
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
