<template>
  <div class="msg-cont">
    <b-message ref="msg_body" :type="msgData.type" :class="{'is-active': msgAct===true}" :active.sync="msgAct" :title="msgData.title"
      has-icon @close="reShow">
      {{ msgData.message }}
      <template v-if="msgData.action && msgData.action !== null">
        <b-field class="btn-cont">
          <button class="button is-small" @click.prevent="actionTr(msgData.action.param)">{{ msgData.action.txt }}</button>
        </b-field>
      </template>
      <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    </b-message>
  </div>
</template>

<script>
export default {
  mounted() {
    const self = this;
    if (self.strMsgAct !== self.msgAct) {
      self.msgAct = self.strMsgAct;
    }
    if (self.msgData.force_open === true && self.msgAct !== true) {
      self.msgAct = true;
    }
  },
  beforeDestroy() {
    if (this.oneTime === true) {
      this.$store.commit("showMsgs/resetData", false);
    }
  },
  computed: {
    strMsgAct: function() {
      return this.$store.state.showMsgs.msg_act;
    },
    msgData: function() {
      return this.$store.state.showMsgs.msg_data;
    }
  },
  watch: {
    msgAct: function(val) {
      if (val !== this.strMsgAct) {
        this.$store.commit("showMsgs/setMsgAct", val);
      }
    },
    strMsgAct: function(val) {
      if (val !== this.msgAct) {
        this.msgAct = val;
      }
    }
  },
  data() {
    return {
      msgAct: false,
      loading: false,
      oneTime: false
    };
  },
  methods: {
    reShow() {
      const self = this;
      if (self.msgData.force_open === true) {
        setTimeout(function() {
          self.msgAct = true;
        }, 1000);
      }
    },
    async actionTr(tr_name) {
      const self = this;
      if (tr_name === "send-verify-email") {
        self.loading = true;
        self.oneTime = true;
        await self.$axios
          .post("/api/email/verify")
          .then(res => {
            if (res.data.status === true) {
              self.$store.commit("showMsgs/resetData");
              self.$store.commit("showMsgs/setMsgData", {
                title: "Success!",
                message: "Successfully verification e-mail sent.",
                type: "is-success"
              });
              self.$store.commit("showMsgs/setMsgAct", true);
            } else {
              self.$toast.open({
                message: "Something went wrong to sending email.",
                type: "is-danger",
                position: "is-bottom"
              });
            }
          })
          .catch(err => {
            console.log(err);
            self.$toast.open({
              message: "Server Request Error!",
              type: "is-danger",
              position: "is-bottom"
            });
          });
        self.loading = false;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.msg-cont {
  position: fixed;
  bottom: 5rem;
  overflow: hidden;

  @media screen and (min-width: 514px) {
    max-width: 350px;
    right: 2rem;
  }

  @media screen and (max-width: 513px) {
    right: 1rem;
    left: 1rem;
  }

  /deep/ {
    @keyframes activeNotification {
      from {
        opacity: 0;
        margin-bottom: -100%;
      }

      to {
        opacity: 1;
        margin-bottom: 0;
      }
    }

    .message {
      display: none;

      &.is-active {
        display: block;
        animation-name: activeNotification;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.105, 0.875, 0.415, 1.265);
        animation-duration: 300ms;
      }

      .media-content {
        .btn-cont {
          margin-top: 10px;
          .button {
            background-color: #3d3e5a;
            color: white;
            border-color: #d9bd68;
            &:focus {
              box-shadow: 0 0 0 0.125em rgba(217, 189, 104, 0.33);
            }
          }
        }
      }
    }
  }
}
</style>