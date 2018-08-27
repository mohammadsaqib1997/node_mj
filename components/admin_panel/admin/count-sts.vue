<template lang="pug">
    .box.counter-box
        .columns.is-gapless.is-multiline
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                h1 {{ paid_mem }}
                h5 Paid Members
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                h1 {{ un_paid_mem }}
                h5 Pending Members
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                .amount-wrapepr
                    b Rs.
                    h1 {{ paid_cm }}
                h5 Paid Commissions
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                .amount-wrapepr
                    b Rs.
                    h1 {{ un_paid_cm }}
                h5 Un-Paid Commissions
        b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
export default {
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/admin/member_counts")
      .then(res => {
        let data = res.data.data;
        self.paid_mem = data.paid_mem;
        self.un_paid_mem = data.un_paid_mem;
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/admin/total_cm")
      .then(res => {
        self.paid_cm = res.data.paid;
        self.un_paid_cm = res.data.un_paid;
      })
      .catch(err => {
        console.log(err);
      });
    self.loading = false;
  },
  data() {
    return {
      loading: true,
      paid_mem: 0,
      un_paid_mem: 0,
      paid_cm: 0,
      un_paid_cm: 0
    };
  }
};
</script>

<style scoped>
.box.counter-box {
  position: relative;
}
</style>


