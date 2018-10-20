<template>
  <div class="img-con">
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    <img v-if="img === null" src="~/assets/img/default.png" />
    <img v-else-if="render_img_url !== null && img !== null" :src="render_img_url" @load="loading=false" />
  </div>
</template>

<script>
export default {
  props: {
    img: {
      default: null,
      type: String
    }
  },
  async mounted() {
    if (this.img !== null) {
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
          url: "/api/web/user/img/" + self.img,
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
  position: relative;
  display: block;
  overflow: hidden;
  width: 180px;
  height: 180px;
  border-radius: 100%;
  padding: 5px;
  border: 2px solid #d9bd68;

  img {
    display: block;
    border-radius: 100%;
    max-width: 100%;
    max-height: 320px;
    margin: auto;
  }

  @media screen and (min-width: 1088px) and (max-width: 1279px) {
    width: 150px;
    height: 150px;
  }

  @media screen and (max-width: 1087px) {
    margin: 0 auto;
  }
}
</style>

