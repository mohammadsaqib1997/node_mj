<template lang="pug">
  .wrapper.profile
    .box.main-box
      .header.columns.is-gapless.is-multiline
        .column
          h1 Profile
        .column.has-text-right
          button.button.edit-btn(@click.prevent="password_md_act=true")
            b-icon(icon="key")
            | &nbsp;&nbsp;&nbsp;&nbsp;Change Password
          button.button.pincode-btn(v-if="$store.state.user.data.type === 0" @click.prevent="pincode_md_act=true")
            b-icon(icon="shield-alt")
            | &nbsp;&nbsp;&nbsp;&nbsp;{{ is_pin === true ? 'Change': 'Add' }} PinCode
          button.button.edit-btn(@click.prevent="modalActive = true")
              b-icon(icon="edit")
              | &nbsp;&nbsp;&nbsp;&nbsp;Edit Profile
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
              profileInfoMem(v-if="$store.state.user.data.type === 0")
              profileInfoAdm(v-else)
    b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
      .modal-card
        #ed-prof-con.modal-card-body
          profileEdMem(v-if="$store.state.user.data.type === 0" @close_modal="modalActive=false")
          profileEdAdm(v-else @close_modal="modalActive=false")
    pinCodeMD(:md_act="pincode_md_act" @closed="pincode_md_act=false")
    changePassMD(:md_act="password_md_act" @closed="password_md_act=false")
</template>

<script>
import profileEdMem from "~/components/forms/ed-profile.vue";
import profileEdAdm from "~/components/admin_panel/admin/ed-profile.vue";
import profileInfoMem from "~/components/admin_panel/member/profile-info.vue";
import profileInfoAdm from "~/components/admin_panel/admin/profile-info.vue";
import pinCodeMD from "~/components/modals/add-pincode.vue";
import changePassMD from "~/components/modals/change_password.vue";
export default {
  layout: "admin_layout",
  components: {
    profileEdMem,
    profileEdAdm,
    profileInfoMem,
    profileInfoAdm,
    pinCodeMD,
    changePassMD
  },
  computed: {
    is_pin: function() {
      return this.$store.state.pincode.is_pincode;
    }
  },
  async mounted() {
    const self = this;
    this.loading = true;
    await this.$axios({
      url: "/api/profile/file/" + this.$store.state.user.data.user_id,
      method: "GET",
      responseType: "blob"
    })
      .then(res => {
        let c_img_url = window.URL.createObjectURL(new Blob([res.data]));
        self.profile_img_url = c_img_url;
      })
      .catch(err => {
        self.profile_img_url = null;
      });

    if (this.$store.state.user.data.type === 0) {
      await this.$store.dispatch("pincode/loadPin");
    }
    this.loading = false;
  },
  data() {
    return {
      loading: false,
      modalActive: false,
      profile_img_url: null,
      pincode_md_act: false,
      password_md_act: false
    };
  },
  methods: {
    changeImg(file) {
      const self = this;
      let is_err = false;
      let msg = "";
      if (file.type === "image/png" || file.type === "image/jpeg") {
        if (file.size > 5000000) {
          is_err = true;
          msg = "Maximum file upload size 5mb.";
        }
      } else {
        is_err = true;
        msg = "Invalid Type. Allowed Types(PNG, JPG).";
      }

      if (!is_err) {
        if (file) {
          self.upload_img(file);
          let reader = new FileReader();
          reader.onload = e => {
            self.profile_img_url = e.target.result;
          };
          reader.readAsDataURL(file);
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

<style scoped lang="scss">
.profile /deep/ {
  .profile-img {
    margin-right: 5rem;
    max-width: 20rem;
    & > img {
      width: 100%;
    }
  }
  .add-img-con {
    display: flex;
    align-items: center;
    & > span {
      text-transform: uppercase;
      font-size: 14px;
      text-decoration: underline;
      line-height: 2rem;
      color: #838383;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .edit-btn,
  .pincode-btn {
    color: #666666;
    border: 2px solid transparent;
    box-shadow: none !important;
    font-weight: 500;
    text-transform: uppercase;
    height: auto;
    border-radius: 0;
    &:not(:last-child) {
      margin-right: 10px;
    }
    &:focus,
    &:hover {
      border: 2px solid #d9bd68;
    }
    .icon {
      color: #d9bd68;
    }
  }
  .btn-des-1 {
    & > img {
      width: 20px;
    }
  }
  .profile-info-con h2 {
    font-weight: bold;
    line-height: 3rem;
    font-size: 1.2rem;
    color: #3d3e5a;
  }
  label {
    font-weight: 300;
    line-height: 3rem;
    font-size: 1.2rem;
  }
}
</style>
