<template>
  <div class="process">
    <div class="main-cont columns is-gapless is-multiline">
      <h2 class="column is-12">Progress</h2>
      <article class="column complete">
        <i class="fas fa-angle-right"></i>
        <h3>Sign Up</h3>
      </article>
      <article class="column">
        <i class="fas fa-angle-right"></i>
        <h3>Payment (5000)</h3>
      </article>
      <article class="column">
        <i class="fas fa-angle-right"></i>
        <h3>Activation</h3>
      </article>
      <article class="column">
        <i class="fas fa-angle-right"></i>
        <h3>Profile Completion</h3>
      </article>
      <article class="column">
        <i class="fas fa-angle-right"></i>
        <h3>Welcome</h3>
      </article>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.process {
  /deep/ {
    .main-cont {
      > h2.column {
        padding: 15px !important;
        text-align: center;
        font-size: 24px;
        text-transform: uppercase;
        background-color: #3d3e5a;
        color: white;
        border-radius: 8px 8px 0 0;
        margin-bottom: 2px;
      }

      @media screen and (min-width: 769px) {
        > :nth-child(2) {
          margin-left: 0 !important;
        }
      }

      > article.column {
        text-align: center;
        background-color: #58597b;
        color: white;
        @media screen and (min-width: 769px) {
          margin-left: 1px;
          margin-right: 1px;
          &:last-child {
            margin-right: 0;
          }
        }
        &.complete {
          opacity: 0.5;
        }
        &:not(.complete) {
          cursor: pointer;
        }

        > i {
          font-size: 3rem;
          display: block;
          padding: 1.8rem;
          background-color: #f7dc8b;
          color: #3d3e5a;
        }
        > h3 {
          padding: 5px;
          font-size: 20px;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>

