<template lang="pug">
  section#bikeFormCon.form
    h1 Bike Details
    .block
      b-radio(v-model="type" native-value="on_cash") On Cash
      b-radio(v-model="type" native-value="on_installment") On Installment
</template>

<script>
export default {
  mounted() {
    $('html, body').animate({ scrollTop: $("#bikeFormCon").offset().top-32 }, 500);
  },
  data() {
    return {
      type: "on_cash"
    }
  }
}
</script>
