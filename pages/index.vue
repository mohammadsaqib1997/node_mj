<template lang="pug">
    section.section
        .container.main
            .columns
                .column.is-4
                    h1.title Company
                    nuxt-link.button(to="/signup") Signup
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
    .main
        color: #393e50

        h1.title
            color: #393e50
            font-size: 3rem
            font-family: serif
            font-weight: 100
            text-transform: uppercase
            padding-bottom: 1.5rem
            position: relative
            &:after
                position: absolute
                content: ' '
                background-color: #d9bd68
                height: 4px
                width: 50px
                bottom: 0
                left: 0
        .status_items
            margin-top: 2rem
            text-transform: uppercase
            font-size: 15px
            color: #828384
            .item
                position: relative
                padding-left: 35px
                padding-bottom: 50px
                &:first-child
                    &:before
                        content: none
                &:before
                    content: ' '
                    position: absolute
                    width: 1px
                    height: 100%
                    background-color: #dddfe0
                    left: 4.5px
                    bottom: calc(100% - 16px)
                &:after
                    content: ' '
                    position: absolute
                    width: 10px
                    height: 10px
                    background-color: #dddfe0
                    left: 0
                    top: 6px
                    border-radius: 100%

                &.complete
                    color: #2d2e30
                    &:after, &:before
                        background-color: #f3257f
</style>
