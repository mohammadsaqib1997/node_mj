<template lang="pug">
  img(v-if="load !== true" :src="src" :style="style")
  span.icon(v-else)
    i.fas.fa-circle-notch.fa-spin
</template>

<script>
export default {
  props: {
    src: {
      type: String
    }
  },
  computed: {
    style: function() {
      if (this.portrait) {
        return {
          height: 100 + "%",
          width: "auto"
        };
      } else {
        return {
          width: 100 + "%",
          height: "auto"
        };
      }
    }
  },
  mounted() {
    const self = this;
    if (self.src !== "") {
      let img = new Image();
      img.onload = function() {
        if (this.height < this.width) {
          self.portrait = true;
        }
      };
      img.src = self.src;
      this.load = false;
    }
  },
  data() {
    return {
      portrait: false,
      load: true
    };
  }
};
</script>

