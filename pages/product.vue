<template lang="pug">
  .product
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Registered Product
      .body
        .section
          .columns.is-gapless(v-if="loading !== true")
            .column.is-6
              .show-info
                .columns.is-gapless.is-multiline

                  .column.is-6
                    label Product Selected
                  .column.is-6
                    .img-cont
                      img(src="~/assets/img/credit-card-active.png")
                      
                  .column.is-6
                    label Product Name
                  .column.is-6
                    h2 {{ result.name }}

                  .column.is-6
                    label Registration Amount
                  .column.is-6
                    h2 {{ diff_prev_reg(result.sel_prd_date) < 0 ? 5000: result.reg_amount }}/-

                  template(v-if="result.package_act_date")
                    .column.is-6
                      label Package Activation
                    .column.is-6
                      h2(v-if="result.package_act_date")
                        | Start: {{ gen_date(result.package_act_date, 0) }}
                        br
                        | End: {{ gen_date(result.package_act_date, 1) }}
                  //- template(v-else)
                  //-   .column.is-6
                  //-     b-field
                  //-       p.control
                  //-         button.button.btn-des-1 Change Product
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import moment from "moment";
export default {
  layout: "admin_layout",
  async mounted() {
    const self = this;
    self.loading = true;
    try {
      let result = await self.$axios.$get("/api/profile/get_prd_detail");
      self.result = result.data;
    } catch (err) {
      console.log(err);
    }
    self.loading = false;
  },
  data() {
    return {
      loading: true,
      result: {}
    };
  },
  methods: {
    gen_date: function(str, addYear) {
      return moment(new Date(str))
        .add(addYear, "year")
        .format("DD MMM YYYY");
    },
    diff_prev_reg(date) {
      let g_date = moment(new Date(date));
      return g_date.diff(moment(new Date("2018-12-31 23:59:59")), "d");
    }
  }
};
</script>

<style lang="scss" scoped>
.product {
  /deep/ {
    .section {
      min-height: 200px;
    }
    .show-info {
      & > .columns {
        align-items: center;
        .column {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>


