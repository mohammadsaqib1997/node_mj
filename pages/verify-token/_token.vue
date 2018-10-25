<template>
  <div class="token-cont">
    <div class="wrapper">
      <div class="logo">
        <nuxt-link to="/">
          <img src="~/assets/img/logo-footer.png" alt="MJ SUPREME">
        </nuxt-link>
      </div>
      <div class="section">
        <h1 :class="{title: true, 'has-text-success':status===1, 'has-text-danger':status===2}">{{ prc_title }}</h1>
        <nuxt-link v-if="(status===1 || status===2) && loading == false && type === 0" to="/" class="button">Go To Home</nuxt-link>
        <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "simple",
  async mounted() {
    const self = this;
    self.loading = true;
    self.prc_title = "Verifying Token...";
    self.status = 0;
    self.type = 0;

    let token = self.$route.params.token;
    if (typeof token !== "undefined") {
      await self.$axios
        .get("/api/verify-token/check/" + token)
        .then(res => {
          if (res.data.status === true) {
            if (res.data.type === 0) {
              self.prc_title = "Your email is successfully varified.";
              self.status = 1;
              self.type = 0;
              self.loading = false;
            }
          } else {
            self.prc_title = res.data.message;
            self.status = 2;
            self.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
          self.prc_title = "Request Error!";
          self.status = 2;
          self.loading = false;
        });
    } else {
      self.prc_title = "Invalid Token!";
      self.status = 2;
      self.loading = false;
    }
  },
  data() {
    return {
      prc_title: "Verifying Token...",
      status: 0,
      type: 0,
      loading: false
    };
  }
};
</script>

<style lang="scss" scoped>
.token-cont {
  padding: 1rem 0;
  /deep/ {
    .wrapper {
      background-color: white;
      box-shadow: 0 6px 15px 6px rgba(0, 0, 0, 0.04);
      border-radius: 5px;
      border: 1px solid #d9bd68;
      max-width: 450px;
      margin: 0 2rem;
      overflow: auto;
      max-height: calc(100vh - 40px);
      .logo {
        text-align: center;
        padding: 20px;
        margin-bottom: 1rem;
        border-bottom: 2px solid #ebeced;
        &::after {
          content: " ";
          display: block;
          width: 50px;
          height: 2px;
          background: #d9bd68;
          position: relative;
          bottom: -22px;
          margin: 0 auto;
        }
      }
      .section {
        position: relative;
        text-align: center;
        > .title {
          color: #3d3e5a;
          font-weight: 400;
        }
        > .button {
          border: 2px solid #d9bd68;
          background-color: #2f3048;
          color: #d9bd68;
          font-weight: 400;
          font-size: 16px;
          border-radius: 0;
          text-transform: uppercase;
          &:focus {
            box-shadow: 0 0 1px 1px rgba(217, 189, 104, 0.3);
          }
        }
        @media screen and (min-width: 425px) {
          min-width: 400px;
        }
      }
    }
  }
}
</style>

