<template lang="pug">
  .section
    .container
      .columns.is-gapless.main-cont
        .column.is-6
          .winner-cont.auto-rd
            h1.title-1.lt
              | Auto Reward Winners Of
              br
              | The Month
            .sld-cont(v-if="loading !== true && auto_rds.length > 0")
              .wrapper
                .sld-item(v-for="(row, ind) in auto_rds" :key="ind" :class="{ 'active': ind===act_sld_auto }")
                  .columns.is-gapless.is-desktop
                    .column.is-narrow
                      userImg(:img="row.file_name")
                      .lvl-cont
                        span LVL {{ row.level }}
                    .column.detail-cont
                      .columns.is-gapless.is-mobile
                        .column.awd-img.is-narrow
                          img(src="~/assets/img/awrd.png")
                        .column.name
                          span {{ row.full_name }}
                      .score-cont
                        span RWD: {{ getLvlRwd(0, row.rwd_level, 'rwds.['+row.reward_selected+']') }}
                        br
                        span.rwd-lvl RWD LVL: {{ getLvlRwd(0, row.rwd_level, 'lvl') }}
              .sld-indic(v-if="auto_rds.length > 1")
                .arr.left(@click.prevent="prev_slide('auto_rds', 'act_sld_auto')")
                .arr.right(@click.prevent="next_slide('auto_rds', 'act_sld_auto')")
            .loading-cont(v-else)
              h1.title(v-if="loading !== true") No Data Found
              b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
        .column.is-6
          .winner-cont.self-rd
            h1.title-1.lt
              | Self Reward Winners Of
              br
              | The Month
            .sld-cont(v-if="loading !== true && self_rds.length > 0")
              .wrapper
                .sld-item(v-for="(row, ind) in self_rds" :key="ind" :class="{ 'active': ind===act_sld_self }")
                  .columns.is-gapless.is-desktop
                    .column.is-narrow
                      userImg(:img="row.file_name")
                      .lvl-cont
                        span LVL {{ row.level }}
                    .column.detail-cont
                      .columns.is-gapless.is-mobile
                        .column.awd-img.is-narrow
                          img(src="~/assets/img/awrd.png")
                        .column.name
                          span {{ row.full_name }}
                      .score-cont
                        span RWD: {{ getLvlRwd(1, row.rwd_level, 'rwds.['+row.reward_selected+']') }}
                        br
                        span.rwd-lvl RWD LVL: {{ getLvlRwd(1, row.rwd_level, 'lvl') }}
              .sld-indic(v-if="self_rds.length > 1")
                .arr.left(@click.prevent="prev_slide('self_rds', 'act_sld_self')")
                .arr.right(@click.prevent="next_slide('self_rds', 'act_sld_self')")
            .loading-cont(v-else)
              h1.title(v-if="loading !== true") No Data Found
              b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
      b-field.vw-all(v-if="loading !== true && (auto_rds.length > 0 || self_rds.length > 0)")
        nuxt-link.button(to="/winners-of-the-month") View All
</template>

<script>
import mxn_rewardsData from "~/mixins/rewards-data.js";
import userImg from "~/components/html_comp/lazy_user_img.vue";
import _ from "lodash";
export default {
  mixins: [mxn_rewardsData],
  components: {
    userImg
  },
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/web/get_winners")
      .then(res => {
        self.auto_rds = res.data.data.auto_rewards;
        self.self_rds = res.data.data.self_rewards;
        self.setIntervalFunc("auto_rds", "act_sld_auto");
        self.setIntervalFunc("self_rds", "act_sld_self");
      })
      .catch(err => {
        console.log(err);
      });
    self.loading = false;
  },
  data() {
    return {
      loading: true,
      auto_rds: [],
      self_rds: [],
      act_sld_auto: 0,
      act_sld_self: 0,
      auto_rds_interval: null,
      self_rds_interval: null
    };
  },
  methods: {
    next_slide(sel_data, sel_next_tr) {
      let next_tr = this[sel_next_tr] + 1;
      let data = this[sel_data];
      let act_indof = data[next_tr];
      if (typeof act_indof !== "undefined") {
        this[sel_next_tr] = next_tr;
      } else {
        this[sel_next_tr] = 0;
      }
      clearInterval(this[sel_data + "_interval"]);
      this.setIntervalFunc(sel_data, sel_next_tr);
    },
    prev_slide(sel_data, sel_prev_tr) {
      let prev_tr = this[sel_prev_tr] - 1;
      let data = this[sel_data];
      let act_indof = data[prev_tr];
      if (typeof act_indof !== "undefined") {
        this[sel_prev_tr] = prev_tr;
      } else {
        this[sel_prev_tr] = data.length - 1;
      }
      clearInterval(this[sel_data + "_interval"]);
      this.setIntervalFunc(
        sel_data,
        sel_prev_tr === "act_sld_auto" ? "act_sld_auto" : "act_sld_self"
      );
    },
    setIntervalFunc(sel_data, sel_next_tr) {
      const self = this;
      self[sel_data + "_interval"] = setInterval(function() {
        self.next_slide(sel_data, sel_next_tr);
      }, 5000);
    }
  }
};
</script>


<style lang="scss" scoped>
.section {
  padding: 0;
  position: relative;
  @media screen and (min-width: 769px) {
    &:before,
    &:after {
      content: " ";
      position: absolute;
      width: 50%;
      height: 100%;
    }

    &:before {
      left: 0;
      top: 0;
      background-color: #3d3e59;
    }

    &:after {
      right: 0;
      top: 0;
      background-color: #2f3047;
    }

    & > .container {
      position: relative;
      z-index: 2;
    }
  }

  & /deep/ {
    & > .container {
      .vw-all {
        text-align: center;
        padding-bottom: 3rem;
        .button {
          border: 2px solid #d9bd68;
          background-color: #2f3048;
          color: #d9bd68;
          font-weight: 400;
          font-size: 18px;
          border-radius: 0;
          text-transform: uppercase;
          &:focus {
            box-shadow: 0 0 1px 1px rgba(217, 189, 104, 0.3);
          }
        }

        @media screen and (max-width: 768px) {
          padding-bottom: 1rem;
          padding-top: 1rem;
        }
      }
      .main-cont {
        margin-bottom: 0;
      }

      @media screen and (max-width: 768px) {
        background-color: #3d3e5a;
      }
    }

    .winner-cont {
      padding: 3rem;

      &.auto-rd {
        background-color: #3d3e5a;
      }
      &.self-rd {
        background-color: #2f3048;
      }

      .loading-cont {
        position: relative;
        min-height: 150px;
        margin-top: 3rem;
      }

      @media screen and (max-width: 768px) {
        text-align: center;
      }

      & .sld-item {
        @media screen and (min-width: 1088px) {
          padding: 4rem 0;
        }

        @media screen and (max-width: 1087px) {
          text-align: center;
          padding: 2rem 0 0;
        }
      }

      .sld-cont {
        width: 100%;
        overflow: hidden;
        position: relative;
        .sld-indic {
          text-align: center;
          @media screen and (max-width: 1087px) {
            margin-top: 2rem;
          }
          .arr {
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: inline-block;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: 5px;
            &.left {
              background-image: url("/img/sld-prev-icon.png");
            }
            &.right {
              background-image: url("/img/sld-next-icon.png");
              margin-right: 0;
            }
          }
        }
        .sld-item {
          display: none;
          &.active {
            display: block;
            animation-duration: 200ms;
            animation-timing-function: ease;
            animation-fill-mode: forwards;
            animation-name: act_slide;
          }
        }
      }

      h1.title-1 {
        font-size: 40px;
        line-height: 50px;

        @media screen and (max-width: 1087px) {
          text-align: center;

          &:after {
            left: 0;
            right: 0;
            margin: 0 auto;
          }
        }
      }

      h1.title {
        color: #969696;
      }

      .lvl-cont {
        text-align: center;
        color: #9697bb;
        font-weight: 800;
        font-size: 18px;
        margin-top: 8px;
      }

      .detail-cont {
        & > .columns:first-child {
          margin-bottom: 1rem;
          @media screen and (min-width: 1088px) and (max-width: 1471px) {
            display: block;
          }
        }

        @media screen and (min-width: 1472px) {
          margin-left: 5rem;
        }

        @media screen and (min-width: 1088px) and (max-width: 1471px) {
          margin-left: 2rem;

          .awd-img {
            margin-left: 15px;
            img {
              width: 80px;
            }
          }
        }

        @media screen and (max-width: 1087px) {
          display: inline-block;
          margin: 2rem auto 0;
        }

        @media screen and (max-width: 375px) {
          & > .is-mobile {
            display: block;
          }
        }

        .name {
          font-size: 36px;
          line-height: 45px;
          color: #d9bd68;
          font-family: serif;
          font-weight: 600;
          margin: 0 15px;
          position: relative;
          text-align: left;
          word-break: break-word;

          &:after {
            content: " ";
            position: absolute;
            height: 1px;
            width: 100%;
            background-color: #d9bd68;
            bottom: 0;
            left: 0;
          }

          @media screen and (min-width: 1088px) and (max-width: 1279px) {
            font-size: 35px;
            line-height: 40px;
          }

          @media screen and (max-width: 375px) {
            margin: 15px;
            text-align: center;
          }
        }

        .score-cont {
          font-size: 25px;
          text-transform: uppercase;
          font-weight: 300;
          color: #fff;
          text-align: right;
          margin-right: 15px;

          .rwd-lvl {
            font-size: 18px;
          }

          // @media screen and (min-width: 1088px) and (max-width: 1279px) {
          //   font-size: 35px;
          // }
        }
      }
    }
  }
}

@keyframes act_slide {
  0% {
    opacity: 0;
    margin-left: 100%;
    white-space: nowrap;
  }
  95% {
    white-space: nowrap;
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    margin-left: 0%;
    white-space: normal;
  }
}
</style>

