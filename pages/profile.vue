<template lang="pug">
  .wrapper.profile
    .box.main-box
      .header.columns.is-gapless.is-multiline
        .column
          h1 Profile
        .column.is-2-desktop.is-12-tablet.has-text-right
          button.button.edit-btn(@click.prevent="modalActive = true")
              b-icon(icon="edit")
              | &nbsp;&nbsp;&nbsp;&nbsp;Edit
      .body
        .section
          .columns.is-gapless
            .column.is-5
              template(v-if="!loading")
                .profile-img
                  img(v-if="profile_img_url !== null" :src="profile_img_url")
                  img(v-else src="~/assets/img/default.png")
                b-upload.add-img-con(@input="changeImg($event)")
                  img(src="~/assets/img/plus-icon.png")
                  span Upload image
            .column
              .profile-info-con
                .columns.is-variable.is-1
                  .column
                    label ID
                  .column
                    h2 {{ profile.user_asn_id }}

                .columns.is-variable.is-1
                  .column
                    label Full Name
                  .column
                    h2 {{ profile.full_name }}

                .columns.is-variable.is-1
                  .column
                    label Date Of Birth
                  .column
                    h2 {{ $store.getters.formatDate(profile.dob) }}

                .columns.is-variable.is-1
                  .column
                    label CNIC
                  .column
                    h2 {{ profile.cnic_num }}

                .columns.is-variable.is-1
                  .column
                    label Email
                  .column
                    h2 {{ profile.email }}

                .columns.is-variable.is-1
                  .column
                    label Contact Number
                  .column
                    h2 {{ profile.contact_num }}

                .columns.is-variable.is-1
                  .column
                    label Address
                  .column
                    h2 {{ profile.address }}

                .columns.is-variable.is-1
                  .column
                    label Referral ID
                  .column
                    h2 {{ profile.ref_user_asn_id }}

                .columns.is-variable.is-1
                  .column
                    label Status
                  .column
                    h2 {{ (profile.active_sts == 0) ? "Suspended":"Approved" }}

                .columns.is-variable.is-1
                  .column
                    nuxt-link.button.btn-des-1(to="/fund-manager/finance-details")
                      img(src="~/assets/img/btn-coin.png")
                      | &nbsp;&nbsp;&nbsp;&nbsp;View Finances
    b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
      .modal-card
        #ed-prof-con.modal-card-body
          profileEd(@close_modal="modalActive=false")
</template>

<script>
import profileEd from "~/components/forms/ed-profile.vue";
export default {
  layout: "admin_layout",
  components: {
    profileEd
  },
  computed: {
    profile: function() {
      return this.$store.state.profile.profile;
    }
  },
  async mounted() {
    const self = this;
    this.loading = true;
    await this.$store.dispatch("profile/loadProfile");
    await this.$axios({
      url: "/api/profile/file/" + this.$store.state.user.data.user_id,
      method: "GET",
      responseType: "blob" // important
    })
      .then(res => {
        let c_img_url = window.URL.createObjectURL(new Blob([res.data]));
        self.profile_img_url = c_img_url;
      })
      .catch(err => {
        self.profile_img_url = null;
      });
    this.loading = false;
  },
  data() {
    return {
      loading: false,
      modalActive: false,
      profile_img_url: null
    };
  },
  methods: {
    changeImg(files) {
      const self = this;
      let is_err = false;
      let msg = "";
      if (files[0].type === "image/png" || files[0].type === "image/jpeg") {
        if (files[0].size > 5000000) {
          is_err = true;
          msg = "Maximum file upload size 5mb.";
        }
      } else {
        is_err = true;
        msg = "Invalid Type. Allowed Types(PNG, JPG).";
      }

      if (!is_err) {
        if (files && files[0]) {
          self.upload_img(files[0]);
          let reader = new FileReader();
          reader.onload = e => {
            self.profile_img_url = e.target.result;
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        self.profile_img_url = null;
        self.$toast.open({
          duration: 3000,
          message: msg,
          position: "is-bottom",
          type: "is-danger"
        });
      }
    },
    async upload_img(file) {
      this.loading = true;
      let msg = "";
      let is_err = false;
      let form_data = new FormData();
      form_data.append("profile", file, file.name);
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      await this.$axios
        .post("/api/profile/image_upload", form_data, config)
        .then(res => {
          if (res.data.status === true) {
            msg = "Successfully upload image.";
          } else {
            is_err = true;
            msg = "Error while uploading!";
          }
        })
        .catch(err => {
          console.log(err);
          is_err = true;
          msg = err.message;
        });
      this.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err ? "is-danger" : "is-success"
      });
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="sass">
  .profile /deep/
  
    .profile-img
      margin-right: 5rem
      max-width: 20rem
      &>img
        width: 100%
    .add-img-con
      display: flex
      align-items: center
      &>span
        text-transform: uppercase
        font-size: 14px
        text-decoration: underline
        line-height: 2rem
        color: #838383
        padding: 0 5px
        cursor: pointer


    .edit-btn
      color: #666666
      border: 2px solid transparent
      box-shadow: none !important
      font-weight: 500
      text-transform: uppercase
      height: auto
      border-radius: 0
      &:focus, &:hover
        border: 2px solid #d9bd68
      .icon
        color: #d9bd68

    .btn-des-1
      &>img
        width: 20px

    .profile-info-con h2
      font-weight: bold
      line-height: 3rem
      font-size: 1.2rem
      color: #3d3e5a

    label
      font-weight: 300
      line-height: 3rem
      font-size: 1.2rem
</style>
