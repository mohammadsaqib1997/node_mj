<template lang="pug">
  .wrapper
    hmSlider
    .section.sct-2
      .container
        h1.title-1.center Products
        .columns
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-1.png")
              .title SUPREME CARD
              .detail-txt
                | Up to 50% discount could be availed on the everyday necessities such as groceries...
              nuxt-link.button(to="/products") View More
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-2.png")
              .title MOTORCYCLE
              .detail-txt
                | Our registered members would be given an opportunity to own a brand new bike...
              nuxt-link.button(to="/products") View More
          .column
            .box-pro-det
              .img-con
                img(src="~/assets/img/hm-pd-img-3.png")
              .title Medical Insurance
              .detail-txt
                | MJ Supreme would be providing you with a year of complete health care...
              nuxt-link.button(to="/products") View More
    upcoming-prod-section
    winnerSec
    .section.sct-5
      .container
        .columns
          .column
            .detail-cont
              h1.title-1
                | GROWTH OPPORTUNITIES
                br
                | WITH SUPREME
              p.txt
                | In just Rs.5000,
                br
                | register to MJ Supreme and make yourselves eligible for the most attractive awards,
                br
                | rewards and bonuses for a safe n sound future...
              nuxt-link(to="/about-us") More Info
          .column
            .img-cont
              img(src="~/assets/img/hm-op-img-1.png")
    // hmPgPromotion(:md_act="true")
</template>

<script>
import upcomingProdSection from "~/components/upcoming-prod-section.vue";
import winnerSec from "~/components/winner-sec.vue";
import hmSlider from "~/components/hm_slider.vue";
import hmPgPromotion from "~/components/modals/home_pg_promotion.vue";
export default {
  head: {
    meta: [
      { name: "p:domain_verify", content: "d2c642f9f3af0663d2c72c5a499fa248" }
    ],
    script: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=UA-131367350-1"
      }
    ]
  },
  mounted() {
    this.$nextTick(function() {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "UA-131367350-1");
    });
  },
  components: {
    "upcoming-prod-section": upcomingProdSection,
    winnerSec,
    hmPgPromotion,
    hmSlider
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.sct-2 {
  background-color: #f6f6f6;
  padding-top: 2rem;

  .box-pro-det {
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 5rem;

    .img-con {
      display: flex;
      width: 120px;
      height: 120px;
      align-items: center;
      justify-content: center;
      background-color: #f6f6f6;
      border: 2px solid white;
      border-radius: 10px;
      box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04);
      transform: rotate(45deg);
      margin: 0 auto;
      margin-bottom: 3rem;

      img {
        transform: rotate(-45deg);
        max-height: 3.5rem;
      }
    }

    .title {
      font-size: 15px;
      text-transform: uppercase;
      color: #3d3e5a;
    }

    .detail-txt {
      color: #868686;
      font-size: 15px;
      padding: 0 4rem;
      margin-bottom: 1.5rem;
    }

    .button {
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
  }
}

.sct-5 {
  padding: 6rem 3.5rem;
  background-image: url("/img/hm-op-img-2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media screen and (max-width: 768px) {
    padding: 3rem 1rem;
  }

  .detail-cont {
    height: 100%;
    padding: 2rem;
    border: 5px solid #5f6077;

    & > h1.title-1 {
      @media screen and (min-width: 769px) {
        font-size: 2.6rem;
      }

      @media screen and (min-width: 426px) and (max-width: 768px) {
        font-size: 40px;
      }

      @media screen and (max-width: 425px) {
        font-size: 8vw;
      }
    }

    & > .txt {
      font-size: 22px;
      margin: 2rem auto;
      color: #5e5e5e;

      @media screen and (max-width: 425px) {
        font-size: 18px;
      }
    }

    & > a {
      text-transform: uppercase;
      color: #db3279;
      font-weight: 500;
    }
  }

  .img-cont {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
