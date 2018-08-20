<template lang="pug">
  #navbar.navbar-container
    .wrapper
      ul
        li(v-for="item in menu" v-if="find(item.show, u_type)" :class="{ 'has-dropdown': item.hasOwnProperty('children'), 'is-active': item.active }")
          template(v-if="item.url")
            nuxt-link.nav-item(:to="item.url")
              img.i-img(:src="'/img/'+item.img+((item.active) ? '-active': '')+'.png'")
              span {{ item.title }}
          template(v-else)
            .nav-item(v-on:click.prevent="openDropdown")
              img.i-img(:src="'/img/'+item.img+((item.active) ? '-active': '')+'.png'")
              span {{ item.title }}
            template(v-if="item.hasOwnProperty('children')")
              .dropdown
                ul
                  li(v-for="d_child in item.children" v-if="find(d_child.show, u_type)" :class="{ 'has-popover': d_child.hasOwnProperty('children'), 'is-active': d_child.active }")
                    template(v-if="d_child.url")
                      nuxt-link.nav-item(:to="d_child.url")
                        span {{ d_child.title }}
                    template(v-else)
                      .nav-item(v-on:mouseenter='openPopover($event, d_child.name)' v-on:mouseleave='openPopover($event, d_child.name)')
                        span {{ d_child.title }}
                      template(v-if="d_child.hasOwnProperty('children')")
                        .popover
                          ul
                            li(v-for="p_child in d_child.children" v-if="find(p_child.show, u_type)" :class="{ 'is-active': p_child.active }")
                              nuxt-link.nav-item(:to="p_child.url")
                                span {{ p_child.title }}
</template>

<script>
import _ from "lodash";
export default {
  mounted() {
    const self = this;
    self.urlActive(self.$route.fullPath);
  },
  computed: {
    routes() {
      return this.$route;
    },
    u_type: function() {
      return this.$store.state.user.data.type;
    }
  },
  watch: {
    routes(val) {
      this.urlActive(val.fullPath);
    }
  },
  data() {
    return {
      pp_timeout: {},
      menu: [
        {
          name: "dashboard",
          active: false,
          img: "panel",
          url: "/dashboard",
          title: "Dashboard",
          show: [0, 1, 2]
        },
        {
          name: "business-chart",
          active: false,
          img: "graph",
          url: "/business-chart",
          title: "Business Chart",
          show: [0, 1, 2]
        },
        {
          name: "fund-manager",
          active: false,
          img: "coin",
          url: false,
          title: "Fund Manager",
          show: [0, 1, 2],
          children: [
            {
              name: "commission-unpaid",
              active: false,
              url: "/fund-manager/commission-unpaid",
              title: "Commission UnPaid",
              show: [1, 2]
            },
            {
              name: "commission-paid",
              active: false,
              url: "/fund-manager/commission-paid",
              title: "Commission Paid",
              show: [0, 1, 2]
            },
            {
              name: "fund-details",
              active: false,
              url: "/fund-manager/fund-details",
              title: "Fund Details",
              show: [0]
            },
            {
              name: "supreme-finance",
              active: false,
              url: false,
              title: "Supreme Finances",
              show: [1, 2],
              children: [
                {
                  name: "total-paid-commission",
                  active: false,
                  url: "/fund-manager/supreme-finance/total-paid-commission",
                  title: "Total Paid Commission",
                  show: [1, 2]
                },
                {
                  name: "total-unpaid-commission",
                  active: false,
                  url: "/fund-manager/supreme-finance/total-unpaid-commission",
                  title: "Total UnPaid Commission",
                  show: [1, 2]
                }
              ]
            }
          ]
        },
        {
          name: "members-area",
          active: false,
          img: "teamwork",
          url: false,
          title: "Members Area",
          show: [1, 2],
          children: [
            {
              name: "add-new-member",
              active: false,
              url: "/members-area/add-new-member",
              title: "Add New Member",
              show: [1, 2]
            },
            {
              name: "members-profile",
              active: false,
              url: "/members-area/members-profile",
              title: "Members Profile",
              show: [1, 2]
            },
            {
              name: "total-members",
              active: false,
              url: false,
              title: "Total Members",
              show: [1, 2],
              children: [
                {
                  name: "active-members-report",
                  active: false,
                  url: "/members-area/total-members/active-members-report",
                  title: "Active Members Report",
                  show: [1, 2]
                },
                {
                  name: "inactive-members-report",
                  active: false,
                  url: "/members-area/total-members/inactive-members-report",
                  title: "InActive Members Report",
                  show: [1, 2]
                }
              ]
            }
          ]
        },
        {
          name: "moderators",
          active: false,
          img: "group",
          url: false,
          title: "Moderators",
          show: [2],
          children: [
            {
              name: "add-new-moderator",
              active: false,
              url: "/moderators/add-new-moderator",
              title: "Add New Moderator",
              show: [2]
            },
            {
              name: "moderators-profile",
              active: false,
              url: "/moderators/moderators-profile",
              title: "Moderators Profile",
              show: [2]
            }
          ]
        },
        {
          name: "system-level",
          active: false,
          img: "system-level",
          url: "/system-level",
          title: "System Level",
          show: [0, 1, 2]
        },
        {
          name: "profile",
          active: false,
          img: "person",
          url: "/profile",
          title: "Profile",
          show: [0, 1, 2]
        },
        {
          name: "notifications",
          active: false,
          img: "bell",
          url: "/notifications",
          title: "Notifications",
          show: [1, 2]
        }
      ]
    };
  },
  methods: {
    openDropdown: function(e) {
      const prevAct = document
        .querySelectorAll("div.navbar-container")[0]
        .querySelectorAll("div.wrapper > ul > li.is-u-active");
      if (prevAct.length > 0) prevAct[0].classList.remove("is-u-active");
      if (e) {
        const target = e.target.closest("li.has-dropdown");
        target.classList.add("is-u-active");
      }
    },
    openPopover: function(e, name) {
      const target = e.target.closest("li.has-popover");
      let pp_elm = target.querySelectorAll(".popover")[0];
      pp_elm.style.top = target.getBoundingClientRect().top - 28 + "px";
      if (e.type === "mouseenter") {
        this.pp_timeout[name] ? clearTimeout(this.pp_timeout[name]) : "";
        target.classList.add("is-u-active");
      } else {
        this.pp_timeout[name] = setTimeout(() => {
          pp_elm.style.top = "auto";
          target.classList.remove("is-u-active");
        }, 500);
      }
    },
    urlActive: function(fullPath) {
      const self = this;

      let urlList = _.split(fullPath, "/").filter(i => {
        return i !== "";
      });

      this.openDropdown();
      this.resetMenu();

      let m_ind = _.findIndex(self.menu, { name: urlList[0] });
      self.setMItem("[" + m_ind + "].active");

      if (_.has(self.menu[m_ind], "children")) {
        let d_ind = _.findIndex(self.menu[m_ind].children, {
          name: urlList[1]
        });
        self.setMItem("[" + m_ind + "].children[" + d_ind + "].active");

        if (_.has(self.menu[m_ind].children[d_ind], "children")) {
          let p_ind = _.findIndex(self.menu[m_ind].children[d_ind].children, {
            name: urlList[2]
          });
          self.setMItem(
            "[" +
              m_ind +
              "].children[" +
              d_ind +
              "].children[" +
              p_ind +
              "].active"
          );
        }
      }
    },

    setMItem: function(path, bool) {
      bool = typeof bool === "undefined" ? true : bool;
      _.set(this.menu, path, bool);
    },

    resetMenu: function() {
      const self = this;

      let m_ind = _.findIndex(self.menu, { active: true });
      this.setMItem("[" + m_ind + "].active", false);

      if (_.has(self.menu[m_ind], "children")) {
        let d_ind = _.findIndex(self.menu[m_ind].children, { active: true });
        this.setMItem("[" + m_ind + "].children[" + d_ind + "].active", false);

        if (_.has(self.menu[m_ind].children[d_ind], "children")) {
          let p_ind = _.findIndex(self.menu[m_ind].children[d_ind].children, {
            active: true
          });
          this.setMItem(
            "[" +
              m_ind +
              "].children[" +
              d_ind +
              "].children[" +
              p_ind +
              "].active",
            false
          );
        }
      }
    },

    find(data, val) {
      return _.indexOf(data, val) > -1;
    }
  }
};
</script>

<style scoped lang="sass">
// - setting-up navigation
.navbar-container
  position: absolute
  width: 250px
  height: calc(100% - 100px)
  &>.wrapper
    position: relative
    padding: 0
    height: 100%
    &>ul
      width: 100%
      max-height: 100%
      overflow-x: visible
      overflow-y: auto
      &>li
        position: static
        &>.nav-item
          display: flex
          align-items: center
        .wrapper
          display: none
          position: absolute
          left: calc(100% + 5px)
          top: 0
  @media screen and (max-width: 1023px)
    margin-left: -250px
    &.is-active
      margin-left: 0


//- designing navigation
.navbar-container
  border-right: 2px solid #dcdcdc
  z-index: 6
  background-color: #f6f6f6
  .wrapper
    &>ul
      &>li
        .nav-item
          cursor: pointer
          &>span
            font-weight: 100
            color: #8c8c8c
            text-transform: uppercase
          &:hover
            &>span
              color: #3d3e5a
        &>.nav-item
          padding: 12px 10px 12px 25px
          &>span
            font-size: 14px
          &> img
            max-width: 35px
            max-height: 35px
            margin-right: 10px
        &:not(.has-dropdown)
          &.is-active
            position: relative
            background-color: #ffffff
            &>.nav-item
              box-shadow: 0 0 10px 1px #ececec
              &>span
                color: #3d3e5a
                font-weight: 400
              &:before
                content: " "
                position: absolute
                background-color: #d9bd68
                width: 5px
                height: 100%
                left: 0
        &.has-dropdown
          &>.nav-item
            position: relative
            &:after
              content: ' '
              position: absolute
              width: 20px
              height: 20px
              right: 5px
              background-size: contain
              background-position: center
              background-repeat: no-repeat
              background-image: url("~/assets/img/arrow.png")
          &>.dropdown
            display: none
            position: static
            font-size: 14px
            &>ul
              &>li
                &>.nav-item
                  display: block
                  padding-top: 8px
                  padding-bottom: 8px
                  padding-left: 68px
                  &>span
                    font-size: 12px
                  &:hover
                    background-color: #ececec
                &.has-popover
                  &>.nav-item
                    position: relative
                    &:after
                      content: ' '
                      position: absolute
                      width: 18px
                      height: 18px
                      right: 8px
                      background-size: contain
                      background-position: center
                      background-repeat: no-repeat
                      background-image: url("~/assets/img/arrow.png")
                  &>.popover
                    display: none
                    position: absolute
                    left: calc(100% + 5px)
                    margin-top: -37px
                    width: 100%
                    z-index: 999
                    background-color: white
                    box-shadow: 3px 3px 1rem 0px #dcdcdc
                    &:before
                      content: " "
                      background-color: #3d3e5a
                      position: absolute
                      width: 5px
                      height: 37px
                      right: 100%
                    &>ul
                      &>li
                        &>.nav-item
                          display: block
                          padding: 8px 15px
                        &.is-active
                          &>.nav-item
                            &>span
                              color: #3d3e5a
                              font-weight: 400
                &.is-u-active
                  &>.popover
                    display: block
                &.is-active
                  &>.nav-item
                    background-color: #ececec
                    &>span
                      color: #3d3e5a
                      font-weight: 600
          &.is-active, &.is-u-active
            background-color: #ffffff
            &>.nav-item
              box-shadow: 0 0 10px 1px #ececec
              &>span
                color: #3d3e5a
                font-weight: 400
              &:before
                content: " "
                position: absolute
                background-color: #d9bd68
                width: 5px
                height: 100%
                left: 0
              &:after
                transform: rotate(90deg)
            &>.dropdown
              display: block
</style>
