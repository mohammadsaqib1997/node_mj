<template lang="pug">
  .top-bar-comp
    .funds-cont(v-if="$store.state.user.data.is_paid === 1")
      button.button.tr-btn(@click.prevent="transMDAct=true") Transfer Funds
      nuxt-link.button.wd-btn(to="/withdraw") Withdraw
    .prg-cont
      b-tooltip(:label="'Profile Complete: '+prf_prg+'%'" position="is-bottom" type="is-light" animated)
        progress.progress.is-success(:value='prf_prg' max="100") {{ prf_prg }}
    transferFundsModal(:openMD="transMDAct" @closed="transMDAct=false")
</template>

<script>
import transferFundsModal from "~/components/modals/transfer_funds.vue";
export default {
  components: {
    transferFundsModal
  },
  async mounted() {
    const self = this;
    if (this.user.data.type === 0) {
      await this.$axios
        .get("/api/profile/get_comp_prg")
        .then(res => {
          self.prf_prg = res.data.progress;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      prf_prg: 0,
      transMDAct: false
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
    .prg-cont {
      .tooltip {
        .progress {
          height: 6px;
          width: 140px;
        }
        &:before {
          border-bottom-color: #3d3e5a;
        }
        &:after {
          text-transform: uppercase;
          font-size: 11px;
          background-color: #3d3e5a;
          color: white;
        }
      }
    }
  }
}
</style>


