<template>
  <div class="box counter-box">
    <div class="columns is-gapless is-multiline">
      <div class="column is-12-mobile is-6-tablet is-3-widescreen">
        <div class="flex">
          <div>
            <div class="tile is-ancestor c-tile is-parent">
              <div class="tile is-vertical is-narrow">
                <div class="tile is-child">
                  <h5>{{ paid_mem }}</h5>
                </div>
                <div class="tile is-child">
                  <h5>{{ un_paid_mem }}</h5>
                </div>
              </div>
              <div class="tile is-vertical">
                <div class="tile is-child"><span>Paid Members</span></div>
                <div class="tile is-child"><span>Pending Members</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-widescreen">
        <div class="amount-main">
          <div class="amount-item">
            <div class="amount-wrapper"><b>Rs.</b>
              <h1>{{ wallet }}/-</h1>
            </div>
            <h5>Wallet</h5>
          </div>
          <!-- <div class="amount-item">
            <div class="amount-wrapper"><b>Rs.</b>
              <h1>{{ tot_expenses }}/-</h1>
            </div>
            <h5>Expenses</h5>
          </div>
          <div class="amount-item">
            <div class="amount-wrapper"><b>Rs.</b>
              <h1>{{ tot_vouchers }}/-</h1>
            </div>
            <h5>Vouchers</h5>
          </div> -->
        </div>


      </div>
      <div class="column is-12-mobile is-6-tablet is-3-widescreen">
        <div class="flex">
          <div>
            <div class="tile is-ancestor c-tile is-parent">
              <div class="tile is-vertical is-narrow">
                <div class="tile is-child">
                  <h5>{{ paid_cm }}/-</h5>
                </div>
                <div class="tile is-child">
                  <h5>{{ un_paid_cm }}/-</h5>
                </div>
                <div class="tile is-child">
                  <h5>{{ user_wallet }}/-</h5>
                </div>
              </div>
              <div class="tile is-vertical">
                <div class="tile is-child"><span>Paid Commissions</span></div>
                <div class="tile is-child"><span>Un-Paid Commissions</span></div>
                <div class="tile is-child"><span>User Wallet</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-12-mobile is-6-tablet is-3-widescreen">
        <div class="amount-wrapper"><b>Rs.</b>
          <h1>{{ parseInt(wallet) + parseInt(paid_cm) + parseInt(user_wallet) }}/-</h1>
        </div>
        <h5>Grand Total</h5>
      </div>
    </div>
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
  </div>
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
        self.paid_mem = data.paid_mem ? data.paid_mem : 0;
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
    await self.$axios
      .get("/api/admin/wallet")
      .then(res => {
        self.wallet = res.data.comp_wallet;
        self.user_wallet = res.data.user_wallet;
      })
      .catch(err => {
        console.log(err);
      });
    // await self.$axios
    //   .get("/api/admin/total_expenses_and_vouchers")
    //   .then(res => {
    //     self.tot_expenses = res.data.tot_expense;
    //     self.tot_vouchers = res.data.tot_voucher;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    self.loading = false;
  },
  data() {
    return {
      loading: true,
      paid_mem: 0,
      un_paid_mem: 0,
      paid_cm: 0,
      un_paid_cm: 0,
      wallet: 0,
      tot_expenses: 0,
      tot_vouchers: 0,
      user_wallet: 0
    };
  }
};
</script>

<style scoped lang="scss">
.amount-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-wrap: wrap;
  .amount-item {
    padding: 0 1rem;
    h5 {
      color: #ffffff;
      font-weight: 600;
      text-transform: uppercase;
    }
    .amount-wrapper {
      b {
        font-size: 18px !important;
      }
      h1 {
        font-size: 22px !important;
        font-weight: 400 !important;
        line-height: 15px !important;
      }
    }
  }
}

.box.counter-box {
  position: relative;
}

.flex {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.c-tile {
  margin: 0;
  display: flex;
  text-align: left;
}

.c-tile h5,
.c-tile span {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
}

.c-tile h5 {
  color: #d9bd68;
}

.c-tile span {
  color: #ffffff;
  display: inline-block;
  margin-left: 10px;
}

.c-tile .tile.is-vertical > .is-child:not(:last-child) {
  margin-bottom: 10px !important;
}

.c-tile .is-narrow {
  flex: none;
  text-align: right;
}
</style>