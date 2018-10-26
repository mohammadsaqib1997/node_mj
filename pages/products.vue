<template lang="pug">
  .wrapper
    .section.sct-1
      .overlay
      h1.sct-heading Our Products
    .section.sct-2
      .container
        h1.title-1 DISCOUNT PRODUCTS
        .columns.main-prd-cont
          .column.is-4
            .prd-list-cont
              .cont.columns.is-mobile.is-gapless(v-on:click.prevent="actPrd(0)" :class="{ active: prd_act === 0 }")
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-1.png")
                .title.column SUPREME CARD
              .cont.columns.is-mobile.is-gapless(v-on:click.prevent="actPrd(1)" :class="{ active: prd_act === 1 }")
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-2.png")
                .title.column MOTORCYCLE
              .cont.columns.is-mobile.is-gapless(v-on:click.prevent="actPrd(2)" :class="{ active: prd_act === 2 }")
                .img-cont.column.is-narrow
                  img(src="~/assets/img/hm-pd-img-3.png")
                .title.column Medical Insurance
          .column
            .prd-det-cont
              template(v-if="prd_act === 0")
                .prd-cont
                  .img-cont
                    img(src="~/assets/img/hm-img-1.jpg")
                  //- .info-cont.level.is-mobile
                  //-   .level-left
                  //-     nuxt-link.button.more-info(to="/product-details") More Info
                  //-   .level-right
                  //-     nuxt-link.button.reg-now(to="/signup") Register Now
                  //-       b-icon(icon="angle-right")
                .desc-cont
                  h2.title-2 Description
                  p 
                    | Up to 50% discount could be availed on the everyday necessities such as groceries, garments, restaurants, resorts, tourism, educational institutions etc.
                    br
                    | The distribution of stuff would be made much easier for our registered members and even more facilities yet to be introduced in the times to come.

              template(v-if="prd_act === 1")
                .prd-cont
                  .img-cont
                    img(src="~/assets/img/hm-img-3.jpg")
                  //- .info-cont.level.is-mobile
                  //-   .level-left
                  //-     nuxt-link.button.more-info(to="/product-details") More Info
                  //-   .level-right
                  //-     nuxt-link.button.reg-now(to="/signup") Register Now
                  //-       b-icon(icon="angle-right")
                .desc-cont
                  h2.title-2 Description
                  p 
                    | Our registered members would be given an opportunity to own a brand new bike and benefits will be awarded to the buyer without any further changes.  The details of the same would be provided by MJ Supreme.
              template(v-if="prd_act === 2")
                .prd-cont
                  .img-cont
                    img(src="~/assets/img/hm-img-2.jpg")
                  //- .info-cont.level.is-mobile
                  //-   .level-left
                  //-     nuxt-link.button.more-info(to="/product-details") More Info
                  //-   .level-right
                  //-     nuxt-link.button.reg-now(to="/signup") Register Now
                  //-       b-icon(icon="angle-right")
                .desc-cont
                  h2.title-2 Description
                  p 
                    | MJ Supreme would be providing you with a year of complete health care.
                    br
                    | In case of any emergency or accidents, our registered members would be eligible for free medication from any hospital in the country. 
                    br
                    | The allocated amount for the insurance is limited to 80,000 to 100,000 PKR.

    upcoming-prod-section
    subscribe-section
</template>

<script>
import upcomingProdSection from "~/components/upcoming-prod-section.vue";
import subscribeSection from "~/components/subscribe-section.vue";
export default {
  components: {
    "upcoming-prod-section": upcomingProdSection,
    "subscribe-section": subscribeSection
  },
  data() {
    return {
      prd_act: 0
    };
  },
  methods: {
    actPrd: function(act) {
      this.prd_act = act;
    }
  }
};
</script>

<style lang="scss" scoped>
.sct-1 {
  position: relative;
  text-align: center;
  margin-bottom: 1rem;
  box-shadow: 0 5px 3px -3px #999999;
  background-image: url("/img/prd-img-1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  .overlay {
    background-color: rgba(25, 25, 76, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .sct-heading {
    position: relative;
    display: inline-block;
    font-size: 3rem;
    border: 2px solid #d7bb6d;
    padding: 20px 40px;
    margin: 2rem auto;
    color: white;
    font-weight: 200;
    text-transform: uppercase;
  }
}

.sct-2 {
  .main-prd-cont {
    margin: 3rem auto;
    .prd-list-cont {
      .cont {
        align-items: center;
        .img-cont {
          cursor: pointer;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px !important;
          background-color: #f6f6f6;
          border: 2px solid white;
          border-radius: 6px;
          margin-right: 1.2rem;
          box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04);
          img {
            max-height: 100%;
          }
        }
        .title {
          font-size: 16px;
          text-transform: uppercase;
          color: #6c6c6c;
          font-weight: 500;
        }
        &.active {
          .img-cont {
            background-color: #3d3e5a;
          }
          .title {
            color: #3d3e5a;
          }
        }
      }
    }
    .prd-det-cont {
      .prd-cont {
        box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04);
        .img-cont {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .info-cont {
          padding: 1.5rem;
          background-color: white;
          .more-info {
            border: 2px solid #dfc884;
            height: auto;
            padding: 6px 1.2rem;
            background-color: transparent;
            color: #3d3e5a;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            &:focus {
              box-shadow: 0 0 5px 1px rgba(216, 190, 111, 0.5);
            }
          }
          .reg-now {
            background-color: #db3279;
            color: white;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 14px;
            padding: 6.5px 1.7rem;
            height: auto;
            border: none;
            border-bottom: 3px solid #ba2b67;
            &:focus {
              box-shadow: 0 0 5px 1px rgba(219, 50, 121, 0.5);
            }
            .icon {
              margin-top: 2px;
              margin-left: 5px;
            }
          }
        }
      }
      .desc-cont {
        margin-top: 3rem;
        h2.title-2 {
          color: #b7b7b7;
        }
        p {
          margin: 1rem auto;
          color: #4c4c4c;
        }
      }
    }
  }
}
</style>
