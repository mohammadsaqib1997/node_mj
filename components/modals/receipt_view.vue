<template lang="pug">
  b-modal.receipt-view(:active="modalAct" :canCancel="false")
    .modal-content
      .box.main-box
        .header
          h1 Receipt View
        .body
          .section
            .img-cont.has-text-centered(v-if="loading !== true && loaded_img !== null")
              img(:src="loaded_img")
            b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
            hr
            b-field(grouped style="justify-content: flex-end;")
              button.button.btn-des-1(@click.prevent="modalAct=false" style="margin-top:0;") Close
              //- button.button.btn-des-1.dark(v-if="$store.state.user.data.type !== 0" @click.prevent="modalAct=false" style="margin-top:0;margin-left:1rem;") Delete

</template>

<script>
export default {
  props: {
    md_act: {
      type: Boolean,
      default: false
    },
    load_id: {
      type: String,
      default: null
    }
  },
  watch: {
    load_id: function(val) {
      if (val !== null) {
        this.load_img(val);
      } else {
        this.loaded_img = null;
      }
    },
    md_act: function(val) {
      if (val !== this.modalAct) {
        this.modalAct = val;
      }
    },
    modalAct: function(val) {
      if (val !== this.md_act) {
        this.$emit("closed", val);
      }
    }
  },
  data() {
    return {
      modalAct: false,
      loading: false,
      loaded_img: null
    };
  },
  methods: {
    load_img: async function(img_id) {
      const self = this;
      self.loading = true;
      await self
        .$axios({
          url: "/api/receipt/get_cm_receipt/" + img_id,
          method: "GET",
          responseType: "blob"
        })
        .then(res => {
          let c_img_url = window.URL.createObjectURL(new Blob([res.data]));
          self.loaded_img = c_img_url;
        })
        .catch(err => {
          console.log(err);
          self.loaded_img = null;
        });
      self.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


