
<template>
  <div class="main">
    <div class="flex-container l1">
      <div class="col-ord-1">
        <img src="~/assets/img/lucky_draw_prm_1/pop-up_earnmorejpg.jpg">
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  // background-color: #3b3f57;
  /deep/ {
    .flex-container {
      display: flex;
      justify-content: center;
      position: relative;

      .col-ord-1 {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;

        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>

