<template>
	<div class="msg-cont">
		<b-message :type="msgData.type" :class="{'is-active': msgAct===true}" :active.sync="msgAct" :title="msgData.title" has-icon @close="reShow">
			{{ msgData.message }}
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
      msgAct: false
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
    }
  }
}
</style>

