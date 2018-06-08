<template lang="pug">
  section#bikeFormCon.form
    h1 Product Details
    .block
      b-radio(v-model="sel_type" native-value="individual") Individual
      b-radio(v-model="sel_type" native-value="reseller") Reseller
    b-field(label="Quantity Of Bikes" v-if="sel_type === 'reseller'")
        b-input(type="text" placeholder="Enter Quantity Of Bikes")
    .block
      b-radio(v-model="pur_type" native-value="on_cash") On Cash
      b-radio(v-model="pur_type" native-value="on_installment") On Installment
</template>

<script>
export default {
  data() {
    return {
      sel_type: "individual",
      pur_type: "on_cash"
    }
  }
}
</script>
