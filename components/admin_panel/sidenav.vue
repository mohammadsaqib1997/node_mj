<template lang="pug">
  #navbar.navbar-container
    .wrapper
      ul
        li(v-for="item in menu" v-if="find(item.show, u_type) && store_check(item)" :class="{ 'has-dropdown': item.hasOwnProperty('children'), 'is-active': item.active }")
          template(v-if="item.url")
            nuxt-link.nav-item(:to="item.url")
              img.i-img(v-if="item.img !== null" :src="'/img/'+item.img+((item.active) ? '-active': '')+'.png'")
              span.icon(v-else-if="item.icon !== null" v-html="item.icon")
              span {{ item.title }}
          template(v-else)
            .nav-item(v-on:click.prevent="openDropdown")
              img.i-img(v-if="item.img !== null" :src="'/img/'+item.img+((item.active) ? '-active': '')+'.png'")
              span.icon(v-else-if="item.icon !== null" v-html="item.icon")
              span {{ item.title }}
            template(v-if="item.hasOwnProperty('children')")
              .dropdown
                ul
                  li(v-for="d_child in item.children" v-if="find(d_child.show, u_type) && store_check_eql(d_child)" :class="{ 'has-popover': d_child.hasOwnProperty('children'), 'is-active': d_child.active }")
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
          name: "company-chart",
          active: false,
          img: null,
          icon: '<i class="fas fa-building"></i>',
          url: false,
          title: "Company Chart",
          show: [0, 2],
          store_key: "crzb-module.type",
          children: [
            {
              name: "assign-roles",
              active: false,
              url: "/company-chart/assign-roles",
              title: "Assign Roles",
              show: [2]
            },
            {
              name: "zone-management",
              active: false,
              url: "/company-chart/zone-management",
              title: "Zone Management",
              show: [2]
            },
            {
              name: "sales-commission",
              active: false,
              url: "/company-chart/sales-commission",
              title: "Sales - Commission",
              show: [0, 2],
              store_key: "crzb-module.type",
              store_eql_val: 4,
              comp_cond: "!"
            },
            {
              name: "sales",
              active: false,
              url: "/company-chart/sales",
              title: "Sales",
              show: [0],
              store_key: "crzb-module.type",
              store_eql_val: 4
            },
            {
              name: "hierarchy",
              active: false,
              url: "/company-chart/hierarchy",
              title: "Hierarchy",
              show: [2]
            },
            {
              name: "assign-franchise",
              active: false,
              url: "/company-chart/assign-franchise",
              title: "Assign Franchise",
              show: [0],
              store_key: "crzb-module.type",
              store_eql_val: 3
            }
          ]
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
              show: [1, 2]
            },
            {
              name: "finance-details",
              active: false,
              url: "/fund-manager/finance-details",
              title: "Finance Details",
              show: [0, 1, 2]
            },
            {
              name: "invoices",
              active: false,
              url: "/fund-manager/invoices",
              title: "Invoices",
              show: [0]
            },
            {
              name: "total-finances",
              active: false,
              url: "/fund-manager/total-finances",
              title: "Total Finances",
              show: [1, 2]
            }
          ]
        },
        {
          name: "rewards",
          active: false,
          img: null,
          icon: '<i class="fas fa-award"></i>',
          url: false,
          title: "Rewards",
          show: [1, 2],
          children: [
            {
              name: "rewards-request",
              active: false,
              url: "/rewards/rewards-request",
              title: "Rewards Request",
              show: [1, 2]
            },
            {
              name: "rewards-completed",
              active: false,
              url: "/rewards/rewards-completed",
              title: "Rewards Completed",
              show: [1, 2]
            }
          ]
        },
        {
          name: "members-area",
          active: false,
          img: "teamwork",
          url: false,
          title: "Members Area",
          show: [0, 1, 2],
          children: [
            {
              name: "add-new-member",
              active: false,
              url: "/members-area/add-new-member",
              title: "Add New Member",
              show: [0, 1, 2]
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
              url: "/members-area/total-members",
              title: "Total Members",
              show: [1, 2]
            }
          ]
        },
        // {
        //   name: "moderators",
        //   active: false,
        //   img: "group",
        //   url: false,
        //   title: "Moderators",
        //   show: [2],
        //   children: [
        //     {
        //       name: "add-new-moderator",
        //       active: false,
        //       url: "/moderators/add-new-moderator",
        //       title: "Add New Moderator",
        //       show: [2]
        //     },
        //     {
        //       name: "moderators-profile",
        //       active: false,
        //       url: "/moderators/moderators-profile",
        //       title: "Moderators Profile",
        //       show: [2]
        //     }
        //   ]
        // },
        {
          name: "partners-area",
          active: false,
          img: null,
          icon: '<i class="far fa-handshake"></i>',
          url: false,
          title: "Partners Area",
          show: [2],
          children: [
            {
              name: "add-new-partner",
              active: false,
              url: "/partners-area/add-new-partner",
              title: "Add New Partner",
              show: [2]
            },
            {
              name: "partners-profile",
              active: false,
              url: "/partners-area/partners-profile",
              title: "Partners Profile",
              show: [2]
            }
          ]
        },
        {
          name: "system-level",
          active: false,
          img: "system-level",
          url: false,
          title: "System Level",
          show: [0],
          children: [
            {
              name: "auto-rewards",
              active: false,
              url: "/system-level/auto-rewards",
              title: "Auto Rewards",
              show: [0]
            },
            {
              name: "campaign",
              active: false,
              url: "/system-level/campaign",
              title: "Campaign",
              show: [0]
            }
            // {
            //   name: "self-rewards",
            //   active: false,
            //   url: "/system-level/self-rewards",
            //   title: "Self Rewards",
            //   show: [0]
            // }
          ]
        },
        {
          name: "product",
          active: false,
          img: null,
          icon: '<i class="fas fa-cart-arrow-down"></i>',
          url: "/product",
          title: "Product",
          show: [0]
        },
        {
          name: "user",
          active: false,
          img: "person",
          url: false,
          title: "Profile",
          show: [0, 1, 2],
          children: [
            {
              name: "profile",
              active: false,
              url: "/user/profile",
              title: "Profile",
              show: [0, 1, 2]
            },
            {
              name: "bank-details",
              active: false,
              url: "/user/bank-details",
              title: "Bank Details",
              show: [0]
            },
            {
              name: "nomination",
              active: false,
              url: "/user/nomination",
              title: "Nomination",
              show: [0]
            }
          ]
        },
        {
          name: "notifications",
          active: false,
          img: "bell",
          url: "/notifications",
          title: "Notifications",
          show: [0, 1, 2]
        },
        // {
        //   name: "messages",
        //   active: false,
        //   img: null,
        //   icon: '<i class="far fa-envelope"></i>',
        //   url: "/messages",
        //   title: "Message Box",
        //   show: [0, 2]
        // },
        {
          name: "account",
          active: false,
          img: null,
          icon: '<i class="fas fa-clipboard-list"></i>',
          url: false,
          title: "Account",
          show: [2],
          children: [
            {
              name: "vouchers",
              active: false,
              url: "/account/vouchers",
              title: "Vouchers",
              show: [2]
            },
            {
              name: "financial-statement",
              active: false,
              url: "/account/financial-statement",
              title: "Financial Statement",
              show: [2]
            }
          ]
        }
        // {
        //   name: "campaign",
        //   active: false,
        //   img: null,
        //   icon: '<i class="fas fa-bullhorn"></i>',
        //   url: false,
        //   title: "Campaign",
        //   show: [2],
        //   children: [
        //     {
        //       name: "create",
        //       active: false,
        //       url: "/campaign/create",
        //       title: "Campaign Create",
        //       show: [2]
        //     },
        //     {
        //       name: "completed",
        //       active: false,
        //       url: "/campaign/completed",
        //       title: "Campaign Completed",
        //       show: [2]
        //     }
        //   ]
        // },
        // {
        //   name: "lucky-draw",
        //   active: false,
        //   img: null,
        //   icon: '<i class="fas fa-trophy"></i>',
        //   url: "/lucky-draw",
        //   title: "Lucky Draw",
        //   show: [2]
        // }
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
    },
    store_check(item) {
      if (item.hasOwnProperty("store_key")) {
        return _.get(this.$store.state, item.store_key, null) !== null;
      }
      return true;
    },
    store_check_eql(item) {
      if (
        item.hasOwnProperty("store_key") &&
        item.hasOwnProperty("store_eql_val")
      ) {
        if (item.hasOwnProperty("comp_cond") && item.comp_cond === "!") {
          return (
            _.get(this.$store.state, item.store_key, null) !=
            item["store_eql_val"]
          );
        }
        return (
          _.get(this.$store.state, item.store_key, null) ===
          item["store_eql_val"]
        );
      }
      return true;
    }
  }
};
</script>

<style scoped lang="scss">
// - setting-up navigation
.navbar-container {
  position: absolute;
  width: 250px;
  height: calc(100% - 100px);
  & > .wrapper {
    position: relative;
    padding: 0;
    height: 100%;
    & > ul {
      width: 100%;
      max-height: 100%;
      overflow-x: visible;
      overflow-y: auto;
      padding-bottom: 1rem;
      & > li {
        position: static;
        & > .nav-item {
          display: flex;
          align-items: center;
        }
        .wrapper {
          display: none;
          position: absolute;
          left: calc(100% + 5px);
          top: 0;
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    margin-left: -250px;
    &.is-active {
      margin-left: 0;
    }
  }
}

//- designing navigation
.navbar-container {
  border-right: 2px solid gainsboro;
  z-index: 6;
  background-color: #f6f6f6;
  .wrapper {
    padding-bottom: 0 !important;
    & > ul {
      & > li {
        .nav-item {
          cursor: pointer;
          & > span {
            font-weight: 100;
            color: #8c8c8c;
            text-transform: uppercase;
          }
          &:hover {
            & > span {
              color: #3d3e5a;
            }
            & > .icon {
              color: #afafaf;
            }
          }
        }
        & > .nav-item {
          padding: 12px 10px 12px 25px;
          & > span {
            font-size: 14px;
          }
          & > .i-img {
            max-width: 35px;
            max-height: 35px;
            margin-right: 10px;
          }
          & > .icon {
            font-size: 25px;
            width: 35px;
            height: 35px;
            margin-right: 10px;
            color: #afafaf;
          }
        }
        &:not(.has-dropdown) {
          &.is-active {
            position: relative;
            background-color: white;
            & > .nav-item {
              box-shadow: 0 0 10px 1px #ececec;
              & > span {
                color: #3d3e5a;
                font-weight: 400;
              }
              &:before {
                content: " ";
                position: absolute;
                background-color: #d9bd68;
                width: 5px;
                height: 100%;
                left: 0;
              }
            }
          }
        }
        &.has-dropdown {
          & > .nav-item {
            position: relative;
            &:after {
              content: " ";
              position: absolute;
              width: 20px;
              height: 20px;
              right: 5px;
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url("/img/arrow.png");
            }
          }
          & > .dropdown {
            display: none;
            position: static;
            font-size: 14px;
            & > ul {
              & > li {
                & > .nav-item {
                  display: block;
                  padding-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 68px;
                  & > span {
                    font-size: 12px;
                  }
                  &:hover {
                    background-color: #ececec;
                  }
                }
                &.has-popover {
                  & > .nav-item {
                    position: relative;
                    &:after {
                      content: " ";
                      position: absolute;
                      width: 18px;
                      height: 18px;
                      right: 8px;
                      background-size: contain;
                      background-position: center;
                      background-repeat: no-repeat;
                      background-image: url("/img/arrow.png");
                    }
                  }
                  & > .popover {
                    display: none;
                    position: absolute;
                    left: calc(100% + 5px);
                    margin-top: -37px;
                    width: 100%;
                    z-index: 999;
                    background-color: white;
                    box-shadow: 3px 3px 1rem 0px gainsboro;
                    &:before {
                      content: " ";
                      background-color: #3d3e5a;
                      position: absolute;
                      width: 5px;
                      height: 37px;
                      right: 100%;
                    }
                    & > ul {
                      & > li {
                        & > .nav-item {
                          display: block;
                          padding: 8px 15px;
                        }
                        &.is-active {
                          & > .nav-item {
                            & > span {
                              color: #3d3e5a;
                              font-weight: 400;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                &.is-u-active {
                  & > .popover {
                    display: block;
                  }
                }
                &.is-active {
                  & > .nav-item {
                    background-color: #ececec;
                    & > span {
                      color: #3d3e5a;
                      font-weight: 600;
                    }
                  }
                }
              }
            }
          }
          &.is-active,
          &.is-u-active {
            background-color: white;
            & > .nav-item {
              box-shadow: 0 0 10px 1px #ececec;
              & > span:not(.icon) {
                color: #3d3e5a;
                font-weight: 400;
              }
              &:before {
                content: " ";
                position: absolute;
                background-color: #d9bd68;
                width: 5px;
                height: 100%;
                left: 0;
              }
              &:after {
                transform: rotate(90deg);
              }
            }
            & > .dropdown {
              display: block;
            }
          }
          &.is-active {
            & > .nav-item {
              & > .icon {
                color: #3d3e5a;
              }
            }
          }
        }
      }
    }
  }
}
</style>
