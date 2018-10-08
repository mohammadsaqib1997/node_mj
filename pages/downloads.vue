<template>
  <div class="wrapper">
    <div class="section">
      <div class="container">
        <h1 class="title-1">Downloads</h1>
        <div class="columns is-multiline">
          <div class="column is-4">
            <a class="columns is-gapless box_cont is-mobile" href="/docs/MJ Supreme Profile.pdf" download="MJ Supreme Profile">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">MJ Supreme Profile</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
            <a class="columns is-gapless box_cont is-mobile" href="/docs/MJ Merchant Agreement.pdf" download="MJ Merchant Agreement">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">MJ Merchant Agreement</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
            <a class="columns is-gapless box_cont is-mobile" href="/docs/SUpreme health program.pdf" download="Supreme Health Program">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Supreme Health Program</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
          </div>
          <div class="column is-4">
            <a class="columns is-gapless box_cont is-mobile" href="/docs/Appled For Zonal Manager.docx" download="Appled For Zonal Manager">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Appled For Zonal Manager</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
            <a class="columns is-gapless box_cont is-mobile" href="/docs/Applied for Regional Manager.docx" download="Applied for Regional Manager">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Applied for Regional Manager</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
            <a class="columns is-gapless box_cont is-mobile" href="/docs/supreme Leaftlet.pdf" download="Supreme Leaftlet">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Supreme Leaftlet</h3><b class="fw">05 Sep 2018</b>
                </div>
              </div>
            </a>
          </div>
          <div class="column is-4">
            <a class="columns is-gapless box_cont is-mobile" href="/docs/Panel Hospital List SPI- 08-08-2018.pdf" download="Panel Hospital List SPI">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Panel Hospital List SPI</h3><b class="fw">08-08-2018</b>
                </div>
              </div>
            </a>
            <a class="columns is-gapless box_cont is-mobile" href="/docs/Panel Hospital List SPI- 08-08-2018-converted.xlsx" download="Panel Hospital List SPI (Excel)">
              <div class="column is-3">
                <div class="bk_img simple" :style="'background-image: url(/img/download_img.png)'"></div>
              </div>
              <div class="column">
                <div class="cont">
                  <h3 class="fw">Panel Hospital List SPI (Excel)</h3><b class="fw">08-08-2018</b>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper /deep/ {
  .container > h1 {
    margin-bottom: 2rem
  }
  .box_cont {
    background-color: white;
    box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.1);

    .bk_img {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }

    .cont {
      color: #9e9e9e;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      height: 100%;
      flex-wrap: wrap;

      .fw {
        width: 100%;
      }

      .h3 {
        font-size: 20px;
        font-weight: 300;
      }

      b {
        font-weight: 600;
      }
    }
  }
}
</style>