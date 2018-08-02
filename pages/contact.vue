<template lang="pug">
  .wrapper
    .section.sct-1
      .container
        .columns
          .column.info-cont.is-4
            h1.title-1 Contact
            p.txt-wrp Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              | Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            .img-cont
              img(src="~/assets/img/support-img.png")
          .column.form-cont.is-6.is-offset-1
            .form
              b-field(label="Full Name")
                b-input(type="text" placeholder="(example: Shabir Ahmed)")

              b-field(label="Email")
                b-input(type="email" placeholder="Your Email ID")

              b-field(label="Subject")
                b-select(placeholder="Select Type" expanded)
                  option(value="1") Check 1
                  option(value="2") Check 2

              b-field(label="Message")
                b-input(type="textarea" placeholder="Type your message here ...")

              .btn-cont
                button.button.btn-des-1 Submit
        // hr
        // .columns
        //   .column.info-cont.is-4
        //     h1.title-1 Location
        //     p.txt-wrp SHOP # 120 , Building Name
        //       |  Street Name, Close By, Area
        //       |  City, Country, Postal Code 121001
        //     .img-cont
        //       img(src="~/assets/img/map-icon-img.png")
        //   .column.form-cont.is-6.is-offset-1
        //     gmap-map.map-cont(:center="{lat:24.946218, lng:67.005615}" :zoom="7" :options="{ disableDefaultUI: true }")
        //       gmap-marker(:position="{lat:24.946218, lng:67.005615}")
        hr
        h1.title-1.center SOCIALIZE WITH US
        ul.social_icons
          li.sc_icon
            a
              b-icon(icon="facebook-f" size="is-small" pack="fab")
          li.sc_icon
            a
              b-icon(icon="twitter" size="is-small" pack="fab")
          li.sc_icon
            a
              b-icon(icon="google-plus-g" size="is-small" pack="fab")
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
  hr
    margin: 3rem auto
  .sct-1
    .info-cont
      .txt-wrp
        margin-top: 2rem
      .img-cont
        text-align: center
        margin: 3rem auto

    .form-cont
      .form
        background-color: #ffffff
        border-radius: 5px
        box-shadow: 0 1px 15px #ccc
        padding: 2rem 1.5rem
        .btn-cont
          text-align: center

    .map-cont
      min-height: 420px
      height: 100%
      box-shadow: 2px 2px 5px 3px #e2e2e2

    ul.social_icons
      text-align: center
      margin: 2rem auto
      li.sc_icon
        display: inline-block
        margin: 0 1rem
        a
          box-shadow: 2px 2px 5px 3px #e2e2e2
          background-color: #dabd67
          height: 70px
          width: 70px
          display: block
          text-align: center
          line-height: 70px
          border-radius: 100%
          color: #f5f6f7
          font-size: 2rem
</style>
