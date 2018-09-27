<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Member Business Chart
                .column
                    .field
                        p.control.has-icons-right
                            input.input(type="search" v-model="search_txt" placeholder="Search by Member ID or Name")
                            span.icon.is-right
                                i.fas(:class="search_classes")
                        .dropdown.is-active.s_ac_dropdown(v-if="s_data.length > 0")
                            .dropdown-menu
                                .dropdown-content
                                    template(v-for="item in s_data")
                                        .dropdown-item(@click.prevent="loadTreeData(item.id, true)")
                                            p {{ item.user_asn_id }}
                                            p {{ item.email }}
                                            p {{ item.full_name }}
                                        hr.dropdown-divider
                        
            .body
                .section
                    .columns.is-gapless.sts_lvls
                        .column.is-narrow
                            h4 LEVEL:
                                span &nbsp;{{ getMF(tree, '0.level', 0) }}
                        .column
                            h4 TOTAL REFERRALS:
                                span &nbsp;{{ parseInt(getMF(tree, '0.direct_ref_count', 0)) + parseInt(getMF(tree, '0.in_direct_ref_count', 0)) }}
                        .column
                            h4.refl
                                span.toc.dir(@click.prevent="activeRefls(1)" :class="{active: refls == 1}")
                                | DIRECT REFERRALS:
                                span &nbsp;{{ getMF(tree, '0.direct_ref_count', 0) }}
                        .column
                            h4.refl
                                span.toc.in-dir
                                | IN-DIRECT REFERRALS:
                                span &nbsp;{{ getMF(tree, '0.in_direct_ref_count', 0) }}

                    .separator.lvl-head
                        h5 HEAD
                    .separator.lvl-0
                        h5 LEVEL 0
                    .separator.lvl-1
                        h5 LEVEL 1

                    ul.hierarchy_chart
                        .separator.mini
                            h5 HEAD
                        li
                            .box.profile-show
                                button.button.bk-btn(v-if="tree_load_ids.length > 0 && refls === null" @click.prevent="loadTreeData(tree_load_ids[tree_load_ids.length-1])")
                                    b-icon(pack="fas" icon="angle-up")
                                .of-hide
                                    .header(:class="{ none: !getMF(tree, '0', false) }")
                                        b-icon(pack="fas" icon="user")
                                        p.name(:title="getMF(tree, '0.full_name', 'Default')") {{ getMF(tree, '0.full_name', 'Default') }}
                                    .footer
                                        p.id {{ getMF(tree, '0.user_asn_id', '0') }}
                                        p.lvl LVL {{ getMF(tree, '0.level', 0) }}
                            ul
                                li(v-for="n1 in 4")
                                    .separator.mini
                                        h5 LEVEL 0
                                    .box.profile-show(@click.prevent="loadTreeData(getMF(tree, '0.childrens.'+(n1-1)+'.id', null), true)" :class="{ 'direct-ref': directIndirectCheck(tree, 1, (n1-1)) === 0, 'in-direct-ref': directIndirectCheck(tree, 1, (n1-1)) === 1 }")
                                        .of-hide
                                            .header(:class="{ none: !getMF(tree, '0.childrens.'+(n1-1)+'', false) }")
                                                b-icon(pack="fas" icon="user")
                                                p.name(:title="getMF(tree, '0.childrens.'+(n1-1)+'.full_name', 'Default')") {{ getMF(tree, '0.childrens.'+(n1-1)+'.full_name', 'Default') }}
                                            .footer
                                                p.id {{ getMF(tree, '0.childrens.'+(n1-1)+'.user_asn_id', '0') }}
                                                p.lvl LVL {{ getMF(tree, '0.childrens.'+(n1-1)+'.level', 0) }}
                                    ul
                                        .separator.mini
                                            h5 LEVEL 1
                                        li(v-for="n2 in 4")
                                            .box.profile-show.mini(:class="{ 'active': getMF(popup_ind, ('l'+n1)+'.'+('l'+n2), false), 'direct-ref': directIndirectCheck(tree, 2, (n1-1), (n2-1)) === 0, 'in-direct-ref': directIndirectCheck(tree, 2, (n1-1), (n2-1)) === 1 }")
                                                .of-hide(v-on:click.prevent="setPopup(('l'+n1)+'.'+('l'+n2), true)")
                                                    .header(:class="{ none: !getMF(tree, '0.childrens.'+(n1-1)+'.childrens.'+(n2-1)+'', false) }")
                                                        b-icon(pack="fas" icon="user")
                                                .dropup.box
                                                    h3 {{ getMF(tree, '0.childrens.'+(n1-1)+'.childrens.'+(n2-1)+'.full_name', 'Default') }}
                                                    p ID: {{ getMF(tree, '0.childrens.'+(n1-1)+'.childrens.'+(n2-1)+'.user_asn_id', '0') }}
                                                    p LVL {{ getMF(tree, '0.childrens.'+(n1-1)+'.childrens.'+(n2-1)+'.level', 0) }}
                                                    a.link(@click.prevent="loadTreeData(getMF(tree, '0.childrens.'+(n1-1)+'.childrens.'+(n2-1)+'.id', null), true)") Load
                    b-loading(:is-full-page="false" :active="loading" :can-cancel="false")

</template>

<script>
import _ from "lodash";
export default {
  layout: "admin_layout",
  computed: {
    search_classes: function() {
      return {
        "fa-search": this.s_loading === false,
        "fa-circle-notch": this.s_loading === true,
        "fa-spin": this.s_loading === true
      };
    }
  },
  async mounted() {
    const self = this;

    if (self.$store.state.user.data.type === 0) {
      self.load_id = self.$store.state.user.data.user_id;
    } else {
      await self.$axios.get("/api/hierarchy/first_user").then(res => {
        if (res.data.data.length > 0) {
          self.load_id = res.data.data[0].member_id;
        }
      });
    }

    if (self.load_id !== null) {
      await self.loadTreeData(self.load_id);
    }
  },
  watch: {
    search_txt: function(val) {
      let new_val = _.trim(val);
      if (this.s_loading === false) {
        this.s_loading = true;
      }
      if (new_val === "") {
        this.s_loading = false;
        this.s_data = [];
      }
      this.search_ac(new_val);
    }
  },
  data() {
    return {
      s_loading: false,
      search_txt: "",
      s_data: [],
      load_id: null,
      tree_load_ids: [],
      tree: [],
      def_tree: [],
      loaded_tree_id: null,
      loading: false,
      refls: null,
      popup_ind: {}
    };
  },
  methods: {
    loadTreeData: async function(id, back) {
      const self = this;
      self.popup_ind = {};
      if (id === null) {
        self.$toast.open({
          duration: 1500,
          message: "User doesen't exist. If you think it is an error, contact administrator now.",
          position: "is-bottom",
          type: "is-danger"
        });
        return;
      }

      if (typeof back !== "undefined" && back === true) {
        self.tree_load_ids.push(self.load_id);
      }

      if (self.tree_load_ids.indexOf(id) === self.tree_load_ids.length - 1) {
        _.remove(self.tree_load_ids, function(id_l) {
          return id_l === id;
        });
      }

      self.load_id = id;
      self.search_txt = "";
      self.refls = null;
      self.loading = true;
      await self.$axios
        .post("/api/hierarchy", { id })
        .then(res => {
          const data = res.data.data;
          self.loaded_tree_id = id;
          self.tree = data.length > 0 ? self.treeGen(data, true) : [];
          self.loading = false;
        })
        .catch(err => {
          console.log(err);
          self.loading = false;
        });
    },
    treeGen: function(arr, tree_deep) {
      let tree = arr;

      let tree_direct = _.filter(tree, {
        ref_user_asn_id: tree[0].user_asn_id
      });
      let tree_in_direct_results = [];

      _.each(tree_direct, o => {
        o["directRef"] = true;
        let check_in = _.filter(tree, { ref_user_asn_id: o.user_asn_id });
        if (check_in.length > 0) {
          tree_in_direct_results.push(check_in);
        }
      });

      for (let result of tree_in_direct_results) {
        _.each(result, row => {
          row["indirectRef"] = true;
          let check_in = _.filter(tree, { ref_user_asn_id: row.user_asn_id });
          if (check_in.length > 0) {
            tree_in_direct_results.push(check_in);
          }
        });
      }

      if (tree_deep === true) {
        _.each(tree, (o, ind) => {
          _.set(tree[ind], "childrens", _.filter(tree, { parent_id: o.hm_id }));
        });
      }

      return tree;
    },
    getMF: function(data, path, def) {
      return _.get(data, path, def);
    },
    directIndirectCheck: function(data, lvl, inc1, inc2) {
      if (lvl === 1) {
        if (_.hasIn(data, "0.childrens." + inc1 + ".directRef")) {
          return 0;
        } else if (_.hasIn(data, "0.childrens." + inc1 + ".indirectRef")) {
          return 1;
        }
      } else if (lvl === 2) {
        if (
          _.hasIn(
            data,
            "0.childrens." + inc1 + ".childrens." + inc2 + ".directRef"
          )
        ) {
          return 0;
        } else if (
          _.hasIn(
            data,
            "0.childrens." + inc1 + ".childrens." + inc2 + ".indirectRef"
          )
        ) {
          return 1;
        }
      }
      return false;
    },
    activeRefls: async function(code) {
      const self = this;
      if (self.tree.length > 0) {
        self.popup_ind = {};
        if (self.refls == code) {
          self.refls = null;
          self.tree = _.cloneDeep(self.def_tree);
          self.def_tree = [];
        } else {
          if (parseInt(self.tree[0].direct_ref_count) > 0) {
            self.refls = code;
            self.loading = true;
            await self.$axios
              .get("/api/hierarchy/refl/direct/" + self.loaded_tree_id)
              .then(res => {
                if (res.data.results) {
                  self.def_tree = _.cloneDeep(self.tree);
                  self.tree =
                    res.data.results.length > 0 ? res.data.results : [];
                }
                self.loading = false;
              })
              .catch(err => {
                console.log(err);
                self.loading = false;
              });
          } else {
            self.$toast.open({
              duration: 1500,
              message: "No direct referrals!",
              position: "is-bottom",
              type: "is-danger"
            });
          }
        }
      }
    },
    setPopup: function(path, val) {
      const self = this;
      if (!_.get(self.popup_ind, path, false)) {
        self.popup_ind = {};
        _.set(self.popup_ind, path, val);
      } else {
        self.popup_ind = {};
      }
    },
    search_ac: _.debounce(async function(val) {
      const self = this;
      if (val !== "") {
        await self.$axios
          .get("/api/hierarchy/find/" + val)
          .then(res => {
            self.s_data = res.data.result;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        self.s_data = [];
      }
      self.s_loading = false;
    }, 1000)
  }
};
</script>

<style scoped lang="scss">
.hierarchy_chart {
  list-style: none;
  margin: 0;

  ul {
    list-style: none;
    margin: 0;
    display: flex;
    align-items: center;
    position: relative;

    &:before {
      content: " ";
      position: absolute;
      bottom: calc(100% + 2rem);
      background-color: #afafaf;
      height: 2px;
      left: 12%;
      right: 12%;
    }

    & > li {
      position: relative;
      margin: 0 auto;

      &:before {
        content: " ";
        position: absolute;
        width: 2px;
        height: 2rem;
        background-color: #afafaf;
        bottom: 100%;
        left: calc(50% - 1px);
      }

      ul {
        list-style: none;
        margin: 0;
        position: relative;

        &:before {
          content: " ";
          position: absolute;
          bottom: calc(100% + 2rem);
          background-color: #afafaf;
          height: 2px;
          width: auto;
          left: 26px;
          right: 26px;
        }

        & > li {
          margin-left: 0.25rem;
          margin-right: 0.25rem;
          position: relative;

          &:before {
            content: " ";
            position: absolute;
            width: 2px;
            height: 2rem;
            background-color: #afafaf;
            bottom: 100%;
            left: calc(50% - 1px);
          }
        }
      }
    }
  }

  @media screen and (max-width: 1359px) {
    ul {
      display: block;
      margin-left: 3rem;

      &:before {
        top: -2rem;
        bottom: 22.7rem;
        height: auto;
        width: 2px;
        left: -2rem;
      }

      & > li {
        &:before {
          top: 3rem;
          right: 100%;
          left: auto;
          width: 2rem;
          height: 2px;
        }

        ul {
          margin-left: 3rem;
          margin-bottom: 2rem;

          &:before {
            top: -2rem;
            bottom: 1.65rem;
            height: auto;
            width: 2px;
            left: -2rem;
          }

          & > li {
            &:before {
              top: calc(50% - 2px);
              right: 100%;
              left: auto;
              width: 2.2rem;
              height: 2px;
            }
          }
        }
      }
    }
  }
}

.profile-show {
  text-align: center;
  padding: 0;
  border: 2px solid #afafaf;
  margin: 0 auto 5rem;
  width: 7rem;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: -0.7px;
  position: relative;
  cursor: pointer;

  &:after {
    content: " ";
    position: absolute;
    height: 3rem;
    width: 2px;
    top: calc(100% + 2px);
    background-color: #afafaf;
  }

  .bk-btn {
    position: absolute;
    width: 30px;
    height: 30px;
    left: calc(100% + 15px);
    padding: 0;
    border-radius: 100%;
    color: #a7a7a7;
    &:hover {
      color: #3f405b;
      border-color: #f1e8cc;
    }
    &:focus {
      color: #3f405b;
      border-color: #f1e8cc;
      -webkit-box-shadow: 0 0 0 0.125em #f1e8cc;
      box-shadow: 0 0 0 0.125em #f1e8cc;
    }
  }

  &.mini {
    display: inline-block;
    width: auto;
    margin: 0 auto;

    &:after {
      content: none;
    }

    & > .dropup {
      display: none;
      position: absolute;
      min-width: 8rem;
      max-width: 12rem;
      margin-top: 1rem;
      margin-left: -100%;
      z-index: 1;

      &:before {
        content: " ";
        position: absolute;
        top: -11px;
        left: calc(50% - 10px);
        background-color: white;
        width: 20px;
        height: 20px;
        border-top: 1px solid rgba(10, 10, 10, 0.1);
        border-left: 1px solid rgba(10, 10, 10, 0.1);
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
      }

      h3 {
        font-size: 15px;
        font-weight: 500;
        white-space: pre-line;
        color: #454545;
      }

      p {
        font-size: 14px;
        margin-bottom: 2px;
        color: #838383;
      }

      a.link {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        text-decoration: underline;
      }
    }

    &.active {
      & > .dropup {
        display: block;
      }
    }
  }

  .of-hide {
    overflow: hidden;
    border-radius: 3px;

    .header {
      color: #3f405b;
      padding: 0.6rem;

      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &.none {
        & > .icon {
          position: relative;

          &:after {
            content: "";
            position: absolute;
            width: calc(100% + 6px);
            height: 2px;
            background-color: #db3279;
            left: -3px;
            top: 50%;
            transform: rotate(130deg);
          }
        }
      }
    }

    .footer {
      background-color: #3d3e5a;
      padding: 0.6rem;

      p {
        margin-bottom: 0;
        color: #ffffff;

        &.lvl {
          color: #8c8db4;
        }
      }
    }
  }

  &.direct-ref {
    border-color: #db3279;

    .of-hide {
      .header {
        background-color: #3d3e5a;
        color: #fff;

        .icon {
          color: #db3279;
        }
      }
    }
  }

  &.in-direct-ref {
    border-color: #db3279;

    .of-hide {
      .header {
        background-color: #f1e8cc;
      }
    }
  }

  @media screen and (max-width: 1359px) {
    margin: 0 0 2rem;

    &:after {
      content: none;
    }
  }
}

.sts_lvls {
  margin-bottom: 6rem !important;

  & > .column {
    padding-right: 1.5rem !important;

    &.is-narrow {
      padding-right: 5rem !important;

      @media screen and (max-width: 768px) {
        padding-right: 0 !important;
      }
    }

    &:last-child {
      padding-right: 0 !important;
    }

    h4 {
      margin-bottom: 0;

      span {
        color: #969595;
      }

      &.refl {
        position: relative;
        padding-left: 15px;

        .toc {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 7px;
          left: 0;

          &.dir {
            background-color: #db3279;
          }

          &.in-dir {
            background-color: #f1e8cc;
          }

          &.active {
            border: 2px solid black;

            &:after {
              content: "";
              position: absolute;
              bottom: -7px;
              left: -2px;
              width: 10px;
              height: 2px;
              background-color: black;
            }
          }
        }
      }
    }

    @media screen and (max-width: 768px) {
      padding-right: 0 !important;
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

.separator {
  border-bottom: 2px dotted #efefef;
  position: absolute;
  width: calc(100% - 4rem);
  top: 0;

  &.lvl-head {
    top: 7rem;
  }

  &.lvl-0 {
    top: 20.2rem;
  }

  &.lvl-1 {
    top: 33rem;
  }

  h5 {
    font-size: 12px;
    margin-bottom: 0;
    color: #c2c2c2;
  }

  &.mini {
    display: none;
  }

  @media screen and (max-width: 1359px) {
    display: none;

    &.mini {
      display: block;
      width: 100%;
      position: relative;
      margin-bottom: 1rem;
    }

    &.lvl-head,
    &.lvl-0,
    &.lvl-1 {
      top: auto;
    }
  }
}

.s_ac_dropdown {
  width: 100%;
  .dropdown-menu {
    width: 100%;
    .dropdown-content {
      max-height: 215px;
      overflow: auto;
      .dropdown-item {
        p:first-child {
          font-weight: bold;
          font-size: 14px;
          color: #3d3e5a;
        }
        p {
          font-size: 12px;
          color: #6b6c79;
        }
        &:hover {
          background-color: whitesmoke;
          cursor: pointer;
        }
      }
    }
  }
}
</style>