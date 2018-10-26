<template lang="pug">
  .wrapper
    .section.sct-1
      .overlay
      h1.sct-heading Need Help ? ... We are always here!
    .section.sct-2
      .container
        h1.title-1 Faqs
        .columns
          .column
            .prd-list-cont.columns.is-variable.is-6.is-mobile.is-multiline
              .item.column.is-narrow.active
                .img-cont
                  img(src="~/assets/img/hm-pd-img-1.png")
                .title SUPREME CARD
              .item.column.is-narrow
                .img-cont
                  img(src="~/assets/img/hm-pd-img-2.png")
                .title MOTORCYCLE
              .item.column.is-narrow
                .img-cont
                  img(src="~/assets/img/hm-pd-img-3.png")
                .title SPI INSSURANCE
            .faq-cont
              b-collapse.collapse-item(:open="false")
                .col-header(slot="trigger" slot-scope="props" :class="{ active: props.open }")
                  h1.title How can I apply for multiple bikes ?
                .col-body
                  p
                    | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                    | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    | voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    | sunt in culpa qui officia deserunt mollit anim id est laborum.
              b-collapse.collapse-item(:open="false")
                .col-header(slot="trigger" slot-scope="props" :class="{ active: props.open }")
                  h1.title How long it takes to process an application and what is the
                    |  wait on confirmation period ?
                .col-body
                  p
                    | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                    | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    | voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    | sunt in culpa qui officia deserunt mollit anim id est laborum.
              b-collapse.collapse-item(:open="false")
                .col-header(slot="trigger" slot-scope="props" :class="{ active: props.open }")
                  h1.title How can I pay and what payment methods are available ?
                .col-body
                  p
                    | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                    | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    | voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    | sunt in culpa qui officia deserunt mollit anim id est laborum.
              b-collapse.collapse-item(:open="false")
                .col-header(slot="trigger" slot-scope="props" :class="{ active: props.open }")
                  h1.title How can I apply for multiple bikes ?
                .col-body
                  p
                    | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                    | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    | voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    | sunt in culpa qui officia deserunt mollit anim id est laborum.
              b-collapse.collapse-item(:open="false")
                .col-header(slot="trigger" slot-scope="props" :class="{ active: props.open }")
                  h1.title How can I apply for multiple bikes ?
                .col-body
                  p
                    | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                    | ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    | laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    | voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    | sunt in culpa qui officia deserunt mollit anim id est laborum.
            .btn-cont
              button.button View All Questions
          .column.is-3
            .info-cont
              .img-cont
                img(src="~/assets/img/support-img.png")
              p.txt
                | Unable to find exact
                |  information looking
                |  for our live chat can
                |  help you out.
              button.button Live Chat
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="sass">
  .sct-1
    position: relative
    text-align: center
    margin-bottom: 1rem
    box-shadow: 0 5px 3px -3px #999
    background-image: url('/img/au_banner_1.jpg')
    background-repeat: no-repeat
    background-size: cover
    background-position: center
    .overlay
      background-color: rgba(39, 40, 81, 0.5)
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
    .sct-heading
      position: relative
      display: inline-block
      font-size: 3rem
      border: 2px solid #d7bb6d
      padding: 20px 40px
      margin: 2rem auto
      color: #fff
      font-weight: 200
      text-transform: uppercase

  .sct-2
    .prd-list-cont
      margin-top: 2rem
      margin-bottom: 2rem
      .item
        text-align: center
        .img-cont
          cursor: pointer
          width: 110px
          height: 110px
          display: flex
          align-items: center
          justify-content: center
          padding: 20px
          background-color: #f6f6f6
          border: 2px solid #fff
          border-radius: 15px
          margin: 0 auto 14px
          box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.06)
          img
            height: 100%
            max-width: none
        .title
          font-size: 12px
        &.active
          .img-cont
            background-color: #3d3e5a
    .faq-cont
      background-color: #ffffff
      border-radius: 5px
      box-shadow: 4px 4px 15px 6px rgba(0, 0, 0, 0.04)
      .collapse-item
        &:not(:last-child)
          border-bottom: 1px solid #ececec
        .col-header
          padding: 1.46rem 5rem
          position: relative
          &:before
            content: " "
            position: absolute
            height: 30px
            width: 30px
            background-image: url("/img/qst-mark-img.png")
            background-repeat: no-repeat
            background-size: contain
            background-position: center
            left: 1.4rem
            top: 1.4rem
          &:after
            content: " "
            position: absolute
            height: 20px
            width: 20px
            background-image: url("/img/add-icon.png")
            background-repeat: no-repeat
            background-size: contain
            background-position: center
            right: 1.4rem
            top: 26px
          &.active
            &:after
              background-image: url("/img/subtract-icon.png")
          h1.title
            font-size: 24px
            font-weight: 200
            color: #888
        .col-body
          padding: 0 5rem 1.46rem
          font-weight: 300
          color: #888
          @media screen and (max-width: 768px)
            padding: 0 3rem 1.46rem
    .btn-cont
      text-align: center
      margin: 3rem auto
      .button
        border: 2px solid #dfc884
        height: auto
        padding: 6px 1.2rem
        background-color: transparent
        color: #3d3e5a
        font-size: 14px
        font-weight: 500
        &:focus
          box-shadow: 0 0 5px 0 rgb(223, 200, 132)
    .info-cont
      text-align: center
      .txt
        padding: 1rem 3rem
      .button
        background-color: #d9bd68
        border-radius: 50px
        padding: 8px 30px
        height: auto
        border: 0
        box-shadow: 0px 3px 6px 0px #d4d4d4
        color: white
        text-transform: uppercase
        font-weight: 700
        font-size: 14px

</style>
