<template>
  <div class="img-con">
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    <img v-if="logo === null" src="~/assets/img/default.png" />
    <img v-else-if="render_img_url !== null && logo !== null" :src="render_img_url" @load="loading=false" />
  </div>
</template>

<script>
export default {
  props: {
    logo: {
      default: null,
      type: String
    }
  },
  async mounted() {
    if (this.logo !== null) {
      this.loading = true;
      await this.loadImg();
    } else {
      this.loading = false;
    }
  },
  data() {
    return {
      loading: true,
      render_img_url: null
    };
  },
  methods: {
    async loadImg() {
      const self = this;
      await self
        .$axios({
          url: "/api/web/partner/logo/" + self.logo,
          method: "GET",
          responseType: "blob"
        })
        .then(res => {
          let c_img_url = window.URL.createObjectURL(new Blob([res.data]));
          self.render_img_url = c_img_url;
        })
        .catch(err => {
          self.render_img_url = null;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.img-con {
  min-height: 150px;
  position: relative;
  border-bottom: 2px solid #d9bd68;

  img {
    display: block;
    max-width: 100%;
    max-height: 320px;
    margin: auto;
  }
}
</style>

