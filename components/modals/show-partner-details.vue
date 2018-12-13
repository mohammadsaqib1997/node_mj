<template>
  <b-modal class="md-info" :active.sync="modalAct" :canCancel="['x']">
    <div class="box main-box">
      <div class="body">
        <div class="section info-cont">
          <template v-if="loading === false">
            <partnerImg :logo="f_data.logo"/>
            <div class="info-content">
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>Name</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.full_name }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>Email</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.email }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>Contact No#</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.cont_num }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>Address</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.address }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>City</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.city }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1">
                <div class="column">
                  <label>Discount Upto</label>
                </div>
                <div class="column">
                  <h2>{{ f_data.discount }}</h2>
                </div>
              </div>
              <div class="columns is-variable is-1" v-if="f_data.disc_prds.length > 0">
                <div class="column">
                  <label>Discount Products</label>
                </div>
                <div class="column">
                  <div class="tags">
                    <div class="tag" v-for="(prd, ind) in f_data.disc_prds" :key="ind">{{ prd }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
import partnerImg from "~/components/html_comp/lazy_partner_img.vue";
export default {
  mixins: [mxn_modal],
  components: {
    partnerImg
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  watch: {
    modalAct: function(val) {
      if (val === false) {
        this.closedMD();
      }
    }
  },
  data() {
    return {
      loading: true,
      f_data: {
        logo: null,
        full_name: "",
        email: "",
        discount: "",
        disc_prds: [],
        cont_num: "",
        address: "",
        city: ""
      }
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/web/partner_info/" + self.id)
        .then(res => {
          self.f_data = {
            logo: res.data.result.logo,
            full_name: res.data.result.full_name,
            email: res.data.result.email,
            discount: res.data.result.discount + "%",
            disc_prds: res.data.result.disc_prds
              ? res.data.result.disc_prds.split("|")
              : [],
            cont_num: res.data.result.cont_num,
            address: res.data.result.address,
            city: res.data.result.city
          };
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    closedMD: function() {
      this.f_data = {
        logo: null,
        full_name: "",
        email: "",
        discount: "",
        disc_prds: [],
        cont_num: "",
        address: "",
        city: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.md-info /deep/ {
  .info-cont {
    min-height: 200px;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: center;

    .img-con {
      border: 2px solid #d9bd68;
      display: inline-block;
      border-radius: 100%;
      overflow: hidden;
      box-shadow: 0 3px 10px 2px #bfbfbf;
      min-width: 150px;
      img {
        width: 250px;
      }
    }

    .info-content {
      text-align: left;
      margin-bottom: 1rem;
      margin-top: 3rem;

      & > .columns {
        margin-bottom: 0.7rem;
        border-bottom: 1px solid #f1f1f1;
        & > .column {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
      }

      label {
        font-weight: 300;
        line-height: normal;
        font-size: 1.2rem;
      }

      h2 {
        font-weight: bold;
        line-height: normal;
        font-size: 1.2rem;
        color: #3d3e5a;
      }

      .tags {
        .tag {
          font-size: 14px;
          line-height: 14px;
          font-weight: 500;
          background-color: #d9bd68;
          color: #3d3e5a;
        }
      }
    }
  }
}
</style>