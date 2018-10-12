<template lang="pug">
    .navbar-comp
        .container
            nav.navbar
                .navbar-brand
                    nuxt-link.navbar-item(to="/")
                        img.brand-logo(src="~/assets/img/logo.png")
                    a#nBurgerMain.navbar-burger(role="button" aria-label="menu" aria-expanded="false")
                        span(aria-hidden="true")
                        span(aria-hidden="true")
                        span(aria-hidden="true")
                .navbar-menu#mainMenu
                    .navbar-end
                        nuxt-link.navbar-item(to="/about-us") Company
                        nuxt-link.navbar-item(to="/products") Products
                        nuxt-link.navbar-item(to="/partners-and-associates") Partners
                        nuxt-link.navbar-item(to="/media") Media
                        nuxt-link.navbar-item(to="/blog") Blog
                        nuxt-link.navbar-item(to="/contact") Contact
                        //- nuxt-link.navbar-item(to="/help-center") Help Center
</template>

<script>
export default {
  mounted() {
    $(function() {
      $("body").off("click", "#nBurgerMain");
      $("body").on("click", "#nBurgerMain", function() {
        $(this).toggleClass("is-active");
        $("#mainMenu").toggleClass("is-active");
      });
    });
  }
};
</script>

<style scoped lang="scss">
.navbar-comp {
  background-color: #fff;
  -webkit-box-shadow: 0 2px 8px #efefef;
  -moz-box-shadow: 0 2px 8px #efefef;
  box-shadow: 0 2px 8px #efefef;

  .navbar-brand {
    align-items: center;

    .navbar-item {
      padding-top: 1rem;
      padding-bottom: 1rem;

      .brand-logo {
        max-height: 100%;
      }
    }

    .navbar-burger {
      width: 7rem;
      height: 7rem;

      span {
        height: 2px;
        width: 20px;
        color: #d9bd68;
      }
    }
  }

  .navbar-menu {
    .navbar-end {
      > .navbar-item {
        font-weight: 500;
        text-transform: uppercase;
        position: relative;
        color: #3b3f58;

        &.nuxt-link-exact-active:after {
          position: absolute;
          content: " ";
          height: 5px;
          width: calc(100% - 2rem);
          background-color: #d9bd68;
          bottom: 0;

          @media screen and (max-width: 1023px) {
            width: 25px;
            left: 1rem;
          }
        }
      }
    }
  }
}
</style>
