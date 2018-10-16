<template lang="pug">
  b-modal.receipt-view(:active="modalAct" :canCancel="false")
    .box.main-box
      .header
        h1 Cancel Reason
      .body
        .section.form
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")

          b-field
            b-input(type="textarea" v-model="reason" maxlength="250" placeholder="Type Cancel Reason...")
          b-field(grouped style="justify-content: flex-end;")
            button.button.btn-des-1(@click.prevent="submit" style="margin-top:0;margin-left:1rem;") Submit
            button.button.btn-des-1.dark(@click.prevent="modalAct=false" style="margin-top:0;margin-left:1rem;") Close
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import mxn_receiptUpload from "~/mixins/receipt_upload.js";
import mxn_modal from "~/mixins/modal.js";
import moment from "moment";
export default {
  mixins: [mxn_receiptUpload, mxn_modal],
  components: {
    tableComp
  },
  props: {
    clm_id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      reason: ""
    };
  },
  methods: {
    async submit() {
      const self = this;
      self.loading = true;
      await self.$axios
        .post("/api/reward/sts_change", {
          clm_id: self.clm_id,
          sts: 2,
          reason: self.reason
        })
        .then(res => {
          self.reason = "";
          self.modalAct = false;
          self.$emit("updated", true);
          self.$toast.open({
            duration: 3000,
            message: "Successfully Canceled Reward Request.",
            position: "is-bottom",
            type: "is-success"
          });
        })
        .catch(err => {
          console.log(err);
          self.$toast.open({
            duration: 3000,
            message: "Server Error! " + err.message,
            position: "is-bottom",
            type: "is-danger"
          });
        });
      self.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.receipt-view /deep/ {
  .form {
    .textarea {
      background-color: #f5f6f7;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      border: 1px solid transparent;
      font-size: 15px;
      color: #3b3f57;
      padding: 10px;
      &:focus,
      &:active {
        border-color: transparent;
        -webkit-box-shadow: 0 0 2px 0 #d9bd68;
        -moz-box-shadow: 0 0 2px 0 #d9bd68;
        box-shadow: 0 0 2px 0 #d9bd68;
        background-color: #ffffff;
      }
    }
  }
}
</style>


