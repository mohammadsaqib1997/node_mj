<template lang="pug">
  .wrapper
    .section
      .container
        h1.title-1.center PRESENTATIONS
        .main-slider-cont
          .arrow.prev(@click.prevent="prs_act_slide=prev_act_slide(prs_act_slide, prs_slides)")
          .arrow.next(@click.prevent="prs_act_slide=next_act_slide(prs_act_slide, prs_slides)")
          .cont-wrapper.columns.is-gapless
            .column.is-12
              .slide
                //- h1.title-1.lt
                //-   | Earn More
                //-   br
                //-   | Profit
                .img-cont
                  img(:src="prs_slides[prs_act_slide].thmb")
                .cap-cont.columns.is-gapless
                  .decs-cont.column
                    //- p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    //-   | incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    //-   | quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  .btns-cont.column.is-3(@click.prevent="vid_mdl.active=true;vid_mdl.loading=true;vid_mdl.src=prs_slides[prs_act_slide].src")
                    .inner-cont
                      .det-cont
                        span
                          | Go To
                          br
                          | Presentation


        hr
        .columns.vid-cont
          .column.is-3
            h1.title-1.simple Videos
            .img-cont
              img(src="~/assets/img/video-plr-img.png")
          .column.is-9
            //- .slider-indec-cont
            //-   .prev.arrow
            //-   .link-txt View All
            //-   .next.arrow
            .columns.slider-cont
              .column.is-4(v-for="vid in vids_slides")
                .img-cont(@click.prevent="vid_mdl.active=true;vid_mdl.loading=true;vid_mdl.src=vid.src")
                  img(:src="vid.thmb")
                .cap-txt {{ vid.title }}
              //- .column.is-4
              //-   .img-cont
              //-     img(src="~/assets/img/vid-img-2.jpg")
              //-   .cap-txt
              //-     | Get Maximum Discounts Rates Tips
              //- .column.is-4
              //-   .img-cont
              //-     img(src="~/assets/img/vid-img-3.jpg")
              //-   .cap-txt
              //-     | Planning Your Growth

        hr
        .columns.gallery-cont
          .column.is-3
            h1.title-1.simple Gallery
            .img-cont
              img(src="~/assets/img/gallery-img.png")
          .column.is-9
            .slider-indec-cont
              .prev.arrow(@click.prevent="slidePrv")
              .link-txt(@click.prevent="img_act_mdl(gallery_imgs[0])") View All
              .next.arrow(@click.prevent="slideNext")
            .columns.slider-cont.is-gapless
              .column.is-4(v-for="n in 3" v-if="curt_img_act[n-1]" @click.prevent="img_act_mdl(curt_img_act[n-1])")
                LazyLoadImg(:src="curt_img_act[n-1]")
                .cap-cont
                  .inner-cont
                    .txt MJ Supreme Launch Event
                    .divider
                    .txt 04th Aug 2018
              
    b-modal.img-gallery(:active.sync="active_img.md")
      .slider-container
        .prev.arrow(@click.prevent="active_img.ind=prev_act_slide(active_img.ind, gallery_imgs)")
        .next.arrow(@click.prevent="active_img.ind=next_act_slide(active_img.ind, gallery_imgs)")
        .sh-img-cont(v-if="active_img.loading !== true && active_img.loaded_img !== null" v-html="active_img.loaded_img")
        b-loading(:is-full-page="false" :active="active_img.loading" :can-cancel="false")
      
      

    b-modal.mdl-videos(:active.sync="vid_mdl.active")
      iframe(v-show="vid_mdl.loading !== true" :onLoad="vid_load_mdl()"  :src="vid_mdl.src" width="560" height="315" frameborder="0" allow="encrypted-media" allowfullscree)
      b-loading(:is-full-page="false" :active="vid_mdl.loading" :can-cancel="false")
          
</template>

<script>
import LazyLoadImg from "~/components/html_comp/lazyLoadImg.vue";
import _ from "lodash";
export default {
  components: {
    LazyLoadImg
  },
  computed: {
    curt_img_act: function() {
      const self = this;
      const limit = 3;
      let offset = (self.view_at_pg - 1) * limit;
      let endpoint = self.view_at_pg * limit;

      return _.slice(self.gallery_imgs, offset, endpoint);
    }
  },
  watch: {
    "active_img.ind": function(val) {
      this.load_img_glr(val);
    }
  },
  data() {
    let gallery_imgs = [];
    for (let i = 1; i <= 76; i++) {
      gallery_imgs.push("/gallery/" + i + ".jpg");
    }
    return {
      gallery_imgs,
      view_at_pg: 1,
      prs_slides: [
        {
          thmb: "https://img.youtube.com/vi/hGk1JojkEr4/maxresdefault.jpg",
          src: "https://www.youtube.com/embed/hGk1JojkEr4?rel=0&amp;showinfo=0"
        },
        {
          thmb: "https://img.youtube.com/vi/P8MHgr6QGAk/maxresdefault.jpg",
          src: "https://www.youtube.com/embed/P8MHgr6QGAk?rel=0&amp;showinfo=0"
        }
      ],
      vids_slides: [
        {
          thmb: "https://img.youtube.com/vi/hGk1JojkEr4/maxresdefault.jpg",
          src: "https://www.youtube.com/embed/hGk1JojkEr4?rel=0&amp;showinfo=0",
          title: "MR AMIR BUSINESS PRESENTATION"
        },
        {
          thmb: "https://img.youtube.com/vi/P8MHgr6QGAk/maxresdefault.jpg",
          src: "https://www.youtube.com/embed/P8MHgr6QGAk?rel=0&amp;showinfo=0",
          title: "MR JAVAID CEO MSG"
        },
        {
          thmb: "https://img.youtube.com/vi/HUxV4W7Wlr4/maxresdefault.jpg",
          src: "https://www.youtube.com/embed/HUxV4W7Wlr4?rel=0&amp;showinfo=0",
          title: "MUHAMMAD AAMIR COUNTRY MANAGER"
        }
      ],
      prs_act_slide: 0,
      active_img: {
        ind: 0,
        md: false,
        loading: false,
        loaded_img: null
      },
      vid_mdl: {
        loading: false,
        active: false,
        src: ""
      }
    };
  },
  methods: {
    vid_load_mdl() {
      const self = this;
      setTimeout(function() {
        self.vid_mdl.loading = false;
      }, 5000);
    },
    async img_act_mdl(src) {
      const self = this;
      let find_ind = _.indexOf(self.gallery_imgs, src);
      if (self.active_img.ind !== find_ind)
        self.active_img.ind = _.indexOf(self.gallery_imgs, src);
      else self.load_img_glr(self.active_img.ind);
    },
    async load_img_glr(ind) {
      const self = this;
      self.active_img.md = true;
      self.active_img.loading = true;
      await new Promise(resolve => {
        let img = new Image();
        img.onload = function() {
          self.active_img.loaded_img = img.outerHTML;
          setTimeout(resolve, 500);
        };
        img.src = self.gallery_imgs[ind];
      });
      self.active_img.loading = false;
    },
    next_act_slide(cur, data) {
      return data.length > cur + 1 ? cur + 1 : 0;
    },
    prev_act_slide(cur, data) {
      return 0 <= cur - 1 ? cur - 1 : data.length - 1;
    },
    slideNext: function() {
      let next_pg = this.view_at_pg + 1;
      let max_pg = Math.ceil(this.gallery_imgs.length / 3);

      this.view_at_pg = next_pg <= max_pg ? next_pg : 1;
    },
    slidePrv: function() {
      let prev_pg = this.view_at_pg - 1;
      let max_pg = Math.ceil(this.gallery_imgs.length / 3);

      this.view_at_pg = prev_pg >= 1 ? prev_pg : max_pg;
    }
  }
};
</script>

<style lang="scss" scoped>
.section {
  .slider-indec-cont {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 2.4rem;
    margin-top: 1.5rem;

    @media screen and (max-width: 768px) {
      justify-content: center;
    }

    .link-txt {
      text-transform: uppercase;
      font-size: 15px;
      font-weight: 700;
      position: relative;
      margin: 0 1rem;

      &:after {
        content: " ";
        position: absolute;
        background-color: #d2d2d6;
        height: 1px;
        width: 100%;
        left: 0;
        bottom: 0;
      }
    }

    .arrow {
      width: 22px;
      height: 22px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      cursor: pointer;

      &.prev {
        background-image: url("/img/sld-prev-icon.png");
      }

      &.next {
        background-image: url("/img/sld-next-icon.png");
      }
    }
  }

  .slider-cont {
    @media screen and (max-width: 768px) {
      max-width: 300px;
      margin: 0 auto 1rem;
    }

    .img-cont {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      height: 265px;
      width: 100%;
      margin: 0 auto;
      position: relative;
      cursor: pointer;
      box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.15);

      &:before {
        content: " ";
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
      }

      img {
        height: 100%;
        max-width: none;
      }
    }
  }

  .main-slider-cont {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3rem auto;

    @media screen and (max-width: 768px) {
      display: block;
      text-align: center;
    }

    .arrow {
      width: 25px;
      height: 70px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      cursor: pointer;

      @media screen and (max-width: 768px) {
        display: inline-block;
        margin-bottom: 1rem;
      }

      &.prev {
        background-image: url("/img/sld-prev-btn.png");
        margin-right: 30px;
      }

      &.next {
        margin-left: 30px;
        order: 2;
        background-image: url("/img/sld-next-btn.png");
      }
    }

    .cont-wrapper {
      width: 100%;
      box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.15);

      .slide {
        position: relative;

        @media screen and (max-width: 768px) {
          background-color: rgba(59, 63, 87, 0.8);
        }

        .img-cont {
          display: flex;
          align-items: baseline;
          justify-content: center;
          overflow: hidden;
          position: relative;

          &:after {
            position: absolute;
            content: " ";
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(59, 63, 87, 0.6);
          }

          @media screen and (min-width: 768px) {
            max-height: 380px;
          }
        }

        h1.title-1 {
          position: absolute;
          top: 2rem;
          left: 2rem;
          line-height: 1.1;
          z-index: 2;
          text-align: left;

          @media screen and (max-width: 768px) {
            position: relative;
            top: 0;
            left: 0;
            padding-top: 1rem;
            margin-left: 1rem;
            margin-bottom: 1rem;
          }
        }

        .cap-cont {
          background-color: rgba(59, 63, 87, 0.5);
          color: #fff;

          @media screen and (min-width: 769px) {
            position: absolute;
            bottom: 0;
            width: 100%;
          }

          .decs-cont {
            padding: 2rem !important;

            p {
              font-size: 20px;
              font-weight: 300;
            }
            @media screen and (max-width: 768px) {
              display: none;
            }
          }

          .btns-cont {
            cursor: pointer;

            @media screen and (min-width: 769px) {
              border-left: 1px solid #d9bd68;
            }

            .inner-cont {
              display: flex;
              padding: 1rem 0;
              height: 100%;
              align-items: center;
              justify-content: center;
              background-color: rgba(59, 63, 87, 0.8);

              .det-cont {
                text-align: center;

                & > span {
                  font-weight: 700;
                  text-transform: uppercase;
                  font-size: 14px;
                }

                &:after {
                  content: " ";
                  display: block;
                  height: 50px;
                  width: 50px;
                  margin: 8px auto;
                  background-image: url("/img/play-btn.png");
                  background-repeat: no-repeat;
                  background-size: contain;
                  background-position: center;
                }
              }
            }
          }
        }
      }
    }
  }

  .vid-cont {
    @media screen and (max-width: 768px) {
      text-align: center;
    }

    .slider-cont {
      .img-cont {
        margin-bottom: 1rem;

        &:before {
          background-color: rgba(0, 0, 0, 0.4);
        }

        &:hover {
          &:before {
            background-color: rgba(0, 0, 0, 0.6);
          }

          &:after {
            content: " ";
            position: absolute;
            background-image: url("/img/vid-plr-icon.png");
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            height: 80px;
            width: 80px;
          }
        }
      }

      .cap-txt {
        color: #565656;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }

  .gallery-cont {
    @media screen and (max-width: 768px) {
      text-align: center;
    }

    .slider-cont {
      .column {
        position: relative;
        cursor: pointer;

        @media screen and (max-width: 768px) {
          margin-bottom: 1rem;
        }

        .cap-cont {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(59, 63, 87, 0.5);
          align-items: center;
          justify-content: center;

          .inner-cont {
            text-align: center;
            color: #fefefe;
            font-weight: 700;
            font-size: 16px;

            .divider {
              display: inline-block;
              width: 50px;
              height: 5px;
              background-color: #d9bd68;
              margin: 3px auto;
            }
          }
        }

        &:hover {
          .cap-cont {
            display: flex;
          }
        }
      }
    }
  }
}

.img-gallery /deep/ {
  .modal-content {
    > .slider-container {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .arrow {
        width: 25px;
        height: 70px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        cursor: pointer;

        &.prev {
          background-image: url("/img/sld-prev-btn.png");
        }

        &.next {
          background-image: url("/img/sld-next-btn.png");
        }
        @media screen and (min-width: 1131px) {
          &.prev {
            margin-right: 30px;
          }

          &.next {
            margin-left: 30px;
            order: 2;
          }
        }

        @media screen and (max-width: 1130px) {
          position: absolute;
          bottom: 40px;
          &.prev {
            left: calc(50% - 40px);
          }

          &.next {
            right: calc(50% - 40px);
          }
        }
      }
      .sh-img-cont {
        height: calc(100% - 40px);
        min-width: 200px;
        min-height: 200px;
        img {
          display: block;
          max-height: 100%;
        }
      }
    }
    .loading-background {
      background: transparent;
    }
  }
}

.mdl-videos /deep/ {
  .modal-content {
    min-height: 200px;
    width: 100%;
    iframe {
      margin: 0 auto;
      display: block;
      width: 100%;
      height: 500px;
    }
  }
  .loading-overlay {
    .loading-background {
      background: transparent;
    }
  }
}
</style>
