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
                      img(v-if="result.product_id && result.product_id === 1" src="~/assets/img/credit-card-active.png")
                      img(v-else-if="result.product_id && result.product_id === 2" src="~/assets/img/motorcycle-active.png")
                      
                  .column.is-6
                    label Product Name
                  .column.is-6
                    h2(v-if="result.product_id && result.product_id === 1") Supreme Card
                    h2(v-else-if="result.product_id && result.product_id === 2") Motorcycle

                  template(v-if="result.product_id && result.product_id === 2")
                    .column.is-6
                      label Buyer Type
                    .column.is-6
                      h2(v-if="result.buyer_type && result.buyer_type === 1") Individual
                      h2(v-else-if="result.buyer_type && result.buyer_type === 2") Reseller

                    template(v-if="result.buyer_type && result.buyer_type === 2")
                      .column.is-6
                        label Quantity Of Bikes
                      .column.is-6
                        h2(v-if="result.buyer_qty_prd") {{ result.buyer_qty_prd }}

                    .column.is-6
                      label Payment Type
                    .column.is-6
                      h2(v-if="result.buyer_pay_type && result.buyer_pay_type === 1") On Cash
                      h2(v-else-if="result.buyer_pay_type && result.buyer_pay_type === 2") On Installment

                  .column.is-6
                    label Package Activation
                  .column.is-6
                    h2(v-if="result.package_act_date")
                      | Start: {{ gen_date(result.package_act_date, 0) }}
                      br
                      | End: {{ gen_date(result.package_act_date, 1) }}
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


