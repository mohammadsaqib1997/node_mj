<template lang="pug">
  .topbar
    .navbar
      .navbar-brand
        a.navbar-burger.main-menu(v-if="$route.name !== 'messages'" role="button" aria-label="menu" aria-expanded="false" v-on:click.prevet="navbarActToggle")
          span(aria-hidden="true")
          span(aria-hidden="true")
          span(aria-hidden="true")
        nuxt-link.navbar-item(to="/")
          img.brand-logo(src="~/assets/img/admin-logo.png")
        a#nBurgerTop.navbar-burger(role="button" aria-label="menu" aria-expanded="false")
          span(aria-hidden="true")
          span(aria-hidden="true")
          span(aria-hidden="true")
      #navTopMenu.navbar-menu
        .navbar-end
          template(v-if="$route.name !== 'messages'")
            .navbar-item(v-if="$store.state.user.data.type === 0")
              topBarCompMem
            .navbar-item(v-else-if="$store.state.user.data.type === 2")
              topBarCompAdmin
          //- .navbar-item.has-dropdown.is-hoverable
          //-   .navbar-item
          //-     .count-unread-msg(v-if="0 > 0")
          //-       | 0
          //-     img(src="~/assets/img/mail.png")
          //-   .navbar-dropdown.notify_cont
          //-     .navbar-item
          //-       nuxt-link.navbar-item.view-all(to="/messages") View all...
          .navbar-item.has-dropdown.is-hoverable
            .navbar-item
              .count-unread-msg(v-if="$store.state.notification.total_unread > 0")
                | {{ $store.state.notification.total_unread }}
              img(src="~/assets/img/notifications-bell-icon.png")
            .navbar-dropdown.notify_cont
              template(v-for="n in top_5_notif")
                .navbar-item(@click.prevent="$store.dispatch('notification/show_notif', n.id)" :class="{ active: n.read === 1 }")
                  span.icon(v-if="n.read === 1")
                    i.far.fa-bell.fa-lg
                  span.icon(v-else)
                    i.fas.fa-bell.fa-lg
                  .cont
                    p {{ n.msg }}
                    span.date {{ $store.getters['formatDate'](n.date) }}
                hr.navbar-divider
              nuxt-link.navbar-item.view-all(to="/notifications") View all...
          .navbar-item.has-dropdown.is-hoverable
            .navbar-item.profile
              img.profile-ic(src="~/assets/img/profile.png")
              span.name(:title="$store.state.profile.name") {{ $store.state.profile.name }}
              img.arrow-ic(src="~/assets/img/arrow.png")
            .navbar-dropdown
              nuxt-link.navbar-item(to="/user/profile") PROFILE
              a.navbar-item(@click.prevent="logoutTr") LOGOUT
    mdNotify
</template>

<script>
import _ from "lodash";
import mdNotify from "~/components/modals/notification.vue";
import topBarCompMem from "~/components/admin_panel/member/top-bar-comp.vue";
import topBarCompAdmin from "~/components/admin_panel/admin/top-bar-comp.vue";
export default {
  components: {
    mdNotify,
    topBarCompMem,
    topBarCompAdmin
  },
  async mounted() {
    await this.$store.dispatch("profile/loadName");
    await this.$store.dispatch("notification/load_tbar_list");
    $(function() {
      $("body").off("click", "#nBurgerTop");

      $("body").on("click", "#nBurgerTop", function() {
        $(this).toggleClass("is-active");
        $("#navTopMenu").toggleClass("is-active");
      });
    });
  },
  computed: {
    top_5_notif: function() {
      return this.$store.state.notification.tbar_list;
    }
  },
  methods: {
    navbarActToggle: function(e) {
      e.target.closest(".navbar-burger").classList.toggle("is-active");
      document.getElementById("navbar").classList.toggle("is-active");
    },
    logoutTr() {
      this.$store.dispatch("logout");
      this.$router.push('/')
    }
  }
};
</script>

<style scoped lang="scss">
.topbar {
  border-bottom: 1px solid #ddd;
  .navbar-brand {
    .navbar-item {
      background-color: transparent !important;
      .brand-logo {
        height: 3rem;
        max-height: 100%;
        width: auto;
      }
    }
    .navbar-burger {
      height: auto;
      color: #333;
      &:nth-child(3) {
        &.is-active {
          span {
            width: 12px;
            &:nth-child(1) {
              left: 50%;
            }
            &:nth-child(3) {
              left: 34%;
            }
          }
        }
      }
      &:first-child {
        margin-left: 0;
        margin-right: auto;
      }
      &.main-menu {
        display: none;
        @media screen and (max-width: 1023px) {
          display: block;
        }
      }
    }
  }
  .navbar-menu {
    .navbar-end {
      margin-right: 5rem;
      .profile {
        .profile-ic {
          margin-right: 1rem;
        }
        .name {
          max-width: 110px;
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline-block;
          white-space: nowrap;
        }
        .arrow-ic {
          margin-left: 3rem;
          -webkit-transform: rotate(90deg);
          -moz-transform: rotate(90deg);
          -ms-transform: rotate(90deg);
          -o-transform: rotate(90deg);
          transform: rotate(90deg);
        }
        &:after {
          position: absolute;
          content: " ";
          height: 5px;
          width: 100%;
          background-color: #d9bd68;
          bottom: -1px;
          left: 0;
        }
      }
      .count-unread-msg {
        height: 40px;
        width: 40px;
        background-color: #db3279;
        border-radius: 100%;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-weight: bold;
        margin-right: -8px;
        z-index: 1;
      }
      .navbar-item {
        .navbar-dropdown {
          left: auto;
          right: 0;
          padding: 0;
          overflow: auto;
          &.notify_cont {
            max-width: 350px;
            max-height: 280px;
            min-width: 250px;
            .navbar-divider {
              display: block;
              height: 1px;
              margin: 0;
            }
            .navbar-item {
              width: 100%;
              cursor: pointer;
              .cont {
                width: calc(100% - 35px);
                margin-left: 20px;
                p {
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                .date {
                  font-size: 11px;
                  font-weight: 600;
                  color: #cacaca;
                }
              }
              &:hover {
                background-color: whitesmoke;
              }
              &.active {
                background-color: #f9f9f9;
              }
              &.view-all {
                justify-content: center;
                padding: 6px 10px;
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 1087px) {
      &.is-active {
        top: 100%;
        position: absolute;
        z-index: 6;
        right: 0;
        min-width: 15rem;
      }
      .navbar-end {
        margin-right: 0;
        .profile {
          .arrow-ic {
            display: none;
          }
          &:after {
            content: none;
          }
        }
        .navbar-item {
          text-align: center;
          & > .navbar-item {
            align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
          }
          .navbar-dropdown {
            border-bottom: 2px solid #efefef;
            border-top: 2px solid #efefef;
            overflow-y: auto;
            max-height: 10rem;
          }
        }
        .count-unread-msg {
          position: relative;
        }
      }
    }
  }
}
</style>
