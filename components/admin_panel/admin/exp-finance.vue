<template>
  <div class="main">
    <h3>{{ title }} Report</h3>
    <b-field class="exp-form-cont" grouped>
      <b-field>
        <b-datepicker v-model="start_date" placeholder="Report Start Date" icon="calendar-alt"></b-datepicker>
      </b-field>
      <b-field>
        <b-datepicker v-model="end_date" placeholder="Report End Date" icon="calendar-alt"></b-datepicker>
      </b-field>
      <b-field v-if="start_date !== null && end_date !== null">
        <p class="control">
          <button
            class="button btn-des-1"
            type="button"
            @click.prevent="exportReport"
          >Export To Excel</button>
        </p>
      </b-field>
    </b-field>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    title: {
      default: "Finance",
      type: String
    },
    type: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      start_date: null,
      end_date: null
    };
  },
  methods: {
    async exportReport() {
      const self = this;
      self.$emit("loading", true);
      await self
        .$axios({
          url: `/api/report/exp_vch_report/${moment(self.start_date).format(
            "x"
          )}/${moment(self.end_date).format("x")}/${self.type}`,
          method: "GET",
          responseType: "blob"
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.getElementById("download_anc");
          if (!link) {
            link = document.createElement("a");
            link.id = "download_anc";
          }
          link.href = url;
          link.setAttribute(
            "download",
            `${self.type === 1 ? 'expense':'voucher'}_report.${moment(self.start_date).format(
              "YYYY-MM-DD"
            )}-${moment(self.end_date).format("YYYY-MM-DD")}.csv`
          );
          if (!document.getElementById("download_anc")) {
            document.body.appendChild(link);
          }
          link.click();
          let el = document.getElementById("download_anc");
          el.parentNode.removeChild(el);
        })
        .catch(err => {
          console.log(err);
        });
      self.$emit("loading", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.main /deep/ {
  & > h3 {
    font-size: 20px;
    font-weight: 300;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .exp-form-cont {
    .datepicker .control {
      &.has-icons-left {
        & > input {
          padding-left: 2.25em;
        }
        & > .icon {
          top: 0.45em;
        }
      }
      & > input {
        background-color: #f5f6f7;
        box-shadow: none;
        border-radius: 0;
        border: 1px solid transparent;
        font-size: 15px;
        color: #3b3f57;
        height: 3.2rem;
        padding: 0 1rem;
      }
    }
    .btn-des-1 {
      margin-top: 0;
      min-height: 0;
      padding: 15px 30px;
      box-shadow: none;
      &:focus {
        box-shadow: none !important;
      }
    }
  }
}
</style>
