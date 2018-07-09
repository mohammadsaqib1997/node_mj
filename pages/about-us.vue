<template lang="pug">
  .wrapper
    .section.sct-1
      .overlay
      h1.sct-heading You Dream It ... We Make It.
    .section.sct-2
      .container
        .tile.is-ancestor
          .tile.is-vertical.is-parent
            .tile.is-child
              h1.title-1 About Mj Supreme
            .tile.is-child
              .cont-1
                p
                  | Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  | Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  | when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  | It has survived not only five centuries, but also the leap into electronic typesetting,
                  | remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                  | and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                h3.tag-title "At Mj, we all come to work every day because we want to solve the biggestp problem of Middle Peoples in Pakistan."
                p
                  | Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  | Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  | when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  | It has survived not only five centuries, but also the leap into electronic typesetting,
                  | remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                  | and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          .tile.is-4.is-parent
            .tile.is-child
              .img-con
    .section.sct-3
      .container
        h2.title-2 Benefits
        .columns
          .column.is-2.has-text-centered
            img(src="~/assets/img/au_img_1.png")
          .column
            .tile.is-ancestor.li-cont
              .tile.is-vertical.is-parent(v-for="n in 2")
                .tile.is-child(v-for="n in 2")
                  .li
                    p Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    .section.sct-4
      .container
        .columns
          .column
            h3.title-3 Presentations
            .columns.is-gapless.box_cont(v-for="i in [2, 3]")
              .column.is-3
                .bk_img(:style="'background-image: url(/img/au_img_'+i+'.jpg)'")
              .column
                .cont
                  h3.fw Organization Structure
                  b.fw 28 Feb 2018
          .column.is-2
          .column
            h3.title-3 Downloads
            .columns.is-gapless.box_cont(v-for="i in [2, 3]")
              .column.is-3
                .bk_img.simple(:style="'background-image: url(/img/download_img.png)'")
              .column
                .cont
                  h3.fw Organization Structure
                  b.fw 28 Feb 2018
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
  .box_cont
    background-color: white
    box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, .1)
  .sct-1
    position: relative
    text-align: center
    margin-bottom: 1rem
    box-shadow: 0 5px 3px -3px #999
    background-image: url('~/assets/img/au_banner_1.jpg')
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
  .sct-2
    padding-bottom: 0
    .cont-1
      padding-right: 2rem
      p
        color: #4c4c4c
        font-size: 16px
        margin: 1.7rem auto
      h3.tag-title
        color: #3d3e5a
        font-size: 1.7rem
        font-style: italic
        font-weight: 300
    .img-con
      position: relative
      width: 100%
      height: 520px
      background-image: url('~/assets/img/au_banner_2.png')
      background-repeat: no-repeat
      background-size: cover
      background-position: center
  .sct-3
    h2.title-2
      margin-bottom: 2rem
    .li-cont
      height: 100%
      align-items: center
      .li
        padding-left: 1.8rem
        position: relative
        &:before
          content: " "
          position: absolute
          width: 10px
          height: 10px
          border-radius: 100%
          background-color: #db3279
          left: 0
          top: 13px
        p
          font-size: 24px
          font-weight: 300
  .sct-4
    padding-bottom: 5rem
    .title-3
      margin-bottom: 2rem
    .box_cont
      .bk_img
        width: 100%
        height: 100%
        background-repeat: no-repeat
        background-position: center
        &:not(.simple)
          background-size: cover

      .cont
        color: #9e9e9e
        padding: 1.5rem 2rem
        display: flex
        align-items: center
        height: 100%
        flex-wrap: wrap
        .fw
          width: 100%
        h3
          font-size: 20px
          font-weight: 300
        b
          font-weight: 600



</style>
