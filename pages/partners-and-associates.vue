<template>
  <div class="wrapper">
    <div class="section">
      <div class="container">
        <h1 class="title-1 main-title">Supreme Partners And Associates</h1>
        <b-field class="search-cont">
          <b-input
            type="text"
            @input="update_params('search', $event)"
            placeholder="Search by city, vendor name, or discount."
          ></b-input>
        </b-field>
        <div v-if="l_data.length > 0" class="columns is-multiline">
          <div class="column is-3" v-for="(row, ind) in l_data" :key="ind+row.email">
            <div class="box-cont">
              <partnerImg :logo="row.logo"/>
              <div class="content">
                <h1 class="title is-4">{{ row.full_name }}</h1>
                <p>{{ row.email }}</p>
                <p>{{ row.cont_num }}</p>
                <p>{{ row.city }}</p>
                <p>{{ row.address }}</p>
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <h1 class="title is-6">Discount upto: {{row.discount}}%</h1>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <button class="button btn-des-2" @click.prevent="det_md=true;det_md_id=row.id">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-12 has-text-centered">
            <div class="pag-cont">
              <b-pagination
                :total="num_rows"
                :per-page="12"
                :current.sync="load_params.page"
                @change="update_params('page', $event)"
              ></b-pagination>
            </div>
          </div>
        </div>
        <section class="not-found" v-else>
          <h1 class="title">No Data Found!</h1>
        </section>
      </div>
    </div>
    <b-loading :is-full-page="true" :active="loading" :can-cancel="false"></b-loading>
    <showPartnerDet :md_act="det_md" :id="det_md_id" @closed="det_md=false;det_md_id=null;"></showPartnerDet>
  </div>
</template>

<script>
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import partnerImg from "~/components/html_comp/lazy_partner_img.vue";
import showPartnerDet from "~/components/modals/show-partner-details.vue";
export default {
  mixins: [mxn_tableFilterListing],
  components: {
    partnerImg,
    showPartnerDet
  },
  data() {
    return {
      det_md: false,
      det_md_id: null
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/web/list_partner", {
          params: this.load_params
        })
        .then(res => {
          this.l_data = res.data.data;
          this.num_rows = res.data.total_rows;
        })
        .catch(err => {
          console.log(err);
        });
      $("html").animate({ scrollTop: $(".main-title").offset().top }, 500);
      self.loading = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.wrapper /deep/ {
  .container > h1 {
    margin-bottom: 2rem;
  }

  .search-cont {
    margin-bottom: 3rem;
    input.input {
      background-color: #ffffff;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      border: 1px solid transparent;
      font-size: 15px;
      color: #3b3f57;
      padding: 16px 35px 16px 20px;
      height: auto;
      &:focus {
        -webkit-box-shadow: 0 0 2px 0 #d9bd68;
        -moz-box-shadow: 0 0 2px 0 #d9bd68;
        box-shadow: 0 0 2px 0 #d9bd68;
      }
    }
  }

  .pag-cont {
    display: inline-block;
    margin: 0 auto;
    .pagination {
      a {
        &[role="button"] {
          -webkit-border-radius: 0;
          -moz-border-radius: 0;
          border-radius: 0;
          border-color: #eeeeee;
          color: #959595;
          background-color: white;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

          &.is-current {
            background-color: #d9bd68;
            color: #ffffff;
          }
        }
      }

      @media screen and (min-width: 769px) {
        .pagination-previous {
          -webkit-box-ordinal-group: 2;
          -ms-flex-order: 1;
          order: 1;
        }

        .pagination-next {
          -webkit-box-ordinal-group: 4;
          -ms-flex-order: 3;
          order: 3;
        }

        .pagination-list {
          -webkit-box-ordinal-group: 3;
          -ms-flex-order: 2;
          order: 2;
        }
      }
    }
  }

  .not-found > h1 {
    color: #8d93ae;
    text-transform: uppercase;
    font-weight: 400;
  }

  .box-cont {
    height: 100%;
    border-radius: 8px;
    background-color: white;
    box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .content {
      padding: 1rem 1rem 1.5rem;

      .title.is-4 {
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      p {
        margin-bottom: 5px;
        color: #7d7d7d;
      }
    }
  }

  .btn-des-2 {
    color: #666666;
    border: 1px solid #d9bd68;
    box-shadow: none !important;
    font-weight: 400;
    text-transform: uppercase;
    height: auto;
    border-radius: 0;
    padding: 2px 9px;
    font-size: 12px;

    &:focus,
    &:hover {
      border: 1px solid #3d3e5a;
      color: #3d3e5a;
    }
  }
}
</style>