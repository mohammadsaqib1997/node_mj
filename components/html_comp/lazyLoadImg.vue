<template lang="pug">
  .img-cont(v-if="load !== true && loaded_img !== null" v-html="loaded_img")
  .load-cont(v-else)
    span.icon
      i.fas.fa-circle-notch.fa-spin
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  watch: {
    src: function(val) {
      this.img_init();
    }
  },
  mounted() {
    this.img_init();
  },
  data() {
    return {
      portrait: false,
      load: true,
      loaded_img: null
    };
  },
  methods: {
    async img_init() {
      const self = this;
      self.load = true;
      await new Promise(resolve => {
        let img = new Image();
        img.onload = function() {
          if (this.height < this.width) {
            self.portrait = true;
            img.style = "height:100%;width:auto;max-width: fit-content;";
          } else {
            img.style = "height:auto;width:100%;max-height: fit-content;";
          }

          self.loaded_img = img.outerHTML;
          resolve();
        };
        img.src = self.src;
      });

      self.load = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.load-cont {
  width: 100%;
  height: 265px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


