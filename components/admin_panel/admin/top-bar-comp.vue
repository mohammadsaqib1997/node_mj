<template lang="pug">
  .top-bar-comp
    .funds-cont
      button.button.tr-btn(@click.prevent="transMdAct=true") Transfer Funds
      //- button.button.wd-btn(@click.prevent="walletMdAct=true") Withdraw
    //- adminWithdrawalMD(:md_act='walletMdAct' @closed="walletMdAct=false")
    adminTranFundMD(:md_act='transMdAct' @closed="transMdAct=false")
</template>

<script>
// import adminWithdrawalMD from "~/components/modals/admin_withdraw.vue";
import adminTranFundMD from "~/components/modals/admin_transfer_funds.vue";
export default {
  components: {
    // adminWithdrawalMD,
    adminTranFundMD
  },
  data() {
    return {
      transMdAct: false,
      walletMdAct: false
    };
  }
};
</script>

<style lang="scss" scoped>
.top-bar-comp {
  display: flex;
  align-items: center;
  /deep/ {
    .funds-cont {
      margin-right: 1rem;
      .tr-btn,
      .wd-btn {
        padding: 6px 14px;
        height: auto;
        border-radius: 0;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #d9bd68;
        box-shadow: 0 3px 15px #dcdcdc;
        margin-bottom: 0;
      }
      .tr-btn {
        margin-right: 10px;
        background-color: #d9bd68;
        &:hover {
          color: #ffffff;
        }
      }
      .wd-btn {
        color: #454545;
        &:hover {
          color: #d9bd68;
        }
      }
    }
  }
}
</style>


