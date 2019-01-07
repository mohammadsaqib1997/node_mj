<template>
  <div class="thumb">
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    <img v-if="img === null" src="~/assets/img/default.png">
    <img
      v-else-if="render_img_url !== null && img !== null"
      :src="render_img_url"
      @load="loading=false"
    >
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
    this.loading = true;
    if (this.img !== null) {
      await this.loadImg();
    }
    this.loading = false;
  },
  watch: {
    async img(val) {
      this.loading = true;
      if (this.img !== null) {
        await this.loadImg();
      }
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
          url: "/api/web/user/thumb/" + self.img,
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
.thumb {
  position: relative;
  overflow: hidden;
  display: block;
  width: 50px;
  height: 50px;

  img {
    display: block;
    max-width: 100%;
    max-height: 50px;
    margin: auto;
  }

  /deep/ {
    .loading-overlay {
      .loading-icon {
        &:after {
          top: calc(50% - 1em);
          left: calc(50% - 1em);
          width: 2em;
          height: 2em;
        }
      }
    }
  }
}
</style>