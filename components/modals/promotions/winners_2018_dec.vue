<template>
  <div class="main">
    <div class="flex-container">
      <div class="col-ord-1">
        <img src="~/assets/img/prm_ass_1/December Promotion .png">
      </div>
      <div class="col-ord-2">
        <img src="~/assets/img/prm_ass_1/badge.png">
      </div>
      <div class="col-ord-3">
        <p class="content-cont">
          Get your vouchers
          from our headoffice.
          For further
          information mail us at:
          <span
            class="hl"
          >info@mj-supreme.com</span>
        </p>
      </div>
    </div>

    <div class="full-container">
      <p class="content-cont">
        Another promotion and year comes to an end. Participants who
        <span class="hl">qualified</span>
        for the
        <span class="hl">lucky draw</span> which will be on
        <span class="hl">19th of January</span> are listed below.
      </p>
      <p class="content-cont">
        <span class="hl">Winners</span> will be announced and handed over
        the
        <span class="hl">reward</span> in that event.
      </p>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(td, ind) in rows" :key="ind">
            <td>{{ genId(td.id) }}</td>
            <td>{{ td.name }}</td>
            <td>{{ td.city }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: [
        {
          id: 1005,
          name: "Syed Waqar Ali Shah Bukhari",
          city: "Mardan"
        },
        {
          id: 1024,
          name: "Basharat ali",
          city: "Okara"
        },
        {
          id: 1055,
          name: "Rehmatullah",
          city: "Peshawar"
        },
        {
          id: 1060,
          name: "Rehmatullah",
          city: "Peshawar"
        },
        {
          id: 27,
          name: "Adeel Iqbal",
          city: "Karachi"
        },
        {
          id: 28,
          name: "Mifrah Adeel",
          city: "Karachi"
        },
        {
          id: 878,
          name: "Islam Akbar",
          city: "Mardan"
        },
        {
          id: 851,
          name: "Muhammad ahmed",
          city: "Karachi"
        },
        {
          id: 15,
          name: "Syeda Maham Adeel",
          city: "Karachi"
        },
        {
          id: 16,
          name: "Syeda Rimsha Javaid",
          city: "Karachi"
        },
        {
          id: 17,
          name: "Syeda Aysha Javaid",
          city: "Karachi"
        },
        {
          id: 21,
          name: "Syed Maaz Javaid",
          city: "Karachi"
        },
        {
          id: 22,
          name: "Syed Khizar Javaid",
          city: "Karachi"
        },
        {
          id: 905,
          name: "Ijaz Ahmad Shah",
          city: "Lahore"
        },
        {
          id: 873,
          name: "Hyder Ali",
          city: "Hyderabad"
        },
        {
          id: 815,
          name: "Muddasir",
          city: "Karachi"
        },
        {
          id: 814,
          name: "Muhammad maaz",
          city: "Karachi"
        },
        {
          id: 4,
          name: "Syed Javaid Hassan",
          city: "Karachi"
        },
        {
          id: 5,
          name: "Syeda Rozina Javaid",
          city: "Karachi"
        },
        {
          id: 869,
          name: "Ghulam Ali Jatoi",
          city: "Hyderabad"
        },
        {
          id: 543,
          name: "Zaid Ahmed",
          city: "Malakand"
        },
        {
          id: 876,
          name: "Aman Ullah",
          city: "Lakki Marwat"
        },
        {
          id: 51,
          name: "Syed zaid javaid",
          city: "Karachi"
        },
        {
          id: 180,
          name: "Syeda Hafsa Adeel",
          city: "Karachi"
        },
        {
          id: 574,
          name: "Muhammad Amir",
          city: "Karachi"
        }
      ]
    };
  },
  methods: {
    genId(id) {
      let str_id = parseInt(id).toString();
      return str_id.length < 9 ? ("000000000" + str_id).substr(-9, 9) : str_id;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  background-color: #3b3f57;

  /deep/ {
    &:before {
      content: "";
      position: absolute;
      background-image: url("/img/prm-ass-1/bgpatt.png");
      background-repeat: no-repeat;
      background-position: center -1px;
      background-size: 101%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .content-cont {
      color: #bdbdc3;
      font-size: 16px;
      text-align: center;
      font-weight: 400;
      .hl {
        color: #d8bb62;
        white-space: nowrap;
        font-weight: 600;
      }
    }

    .flex-container {
      display: flex;
      justify-content: center;
      position: relative;
      @media screen and (max-width: 768px) {
        flex-wrap: wrap;
      }

      .col-ord-2 {
        flex-grow: 2;
        flex-shrink: 0;
        flex-basis: 0;
        margin-top: -75px;
        img {
          display: block;
          margin: 0 auto;
          max-width: 500px;
          width: 100%;
        }
        @media screen and (max-width: 768px) {
          min-width: 100%;
        }
      }
      .col-ord-1,
      .col-ord-3 {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        @media screen and (min-width: 769px) {
          display: flex;
          align-items: center;
          margin-top: 110px;
          justify-content: flex-end;
          max-width: 225px;
        }

        &.col-ord-1 {
          img {
            max-width: 160px;
            @media screen and (max-width: 768px) {
              display: block;
              margin: 0 auto 2rem;
            }
          }
        }
        &.col-ord-3 {
          .content-cont {
            padding-right: 55px;
            text-align: right;
          }
        }

        @media screen and (max-width: 768px) {
          min-width: 100%;
          &.col-ord-1 {
            order: 2;
          }
          &.col-ord-3 {
            order: 3;
            .content-cont {
              max-width: 200px;
              margin: 0 auto 2rem;
              padding-right: 0;
              text-align: center;
            }
          }
        }
      }
    }

    .full-container {
      position: relative;
      .content-cont {
        padding: 15px;
        font-size: 20px;
        max-width: 675px;
        margin: 0 auto;
      }
      .content-cont:last-child {
        max-width: 400px;
      }
    }

    .table-container {
      position: relative;
      padding: 20px;
      .table {
        background-color: transparent;
        thead {
          th {
            color: #d9bd68;
            font-weight: 700;
            text-transform: uppercase;
            border-color: #d9bd68;
            font-size: 18px;
            padding: 5px;
          }
        }
        tbody {
          td {
            color: #bdbdc3;
            font-size: 20px;
            font-weight: 400;
            padding: 12px 5px;
            border-color: #616891;
          }
        }
        thead th:last-child,
        tbody td:last-child {
          text-align: right;
        }
        @media screen and (max-width: 425px) {
          thead th,
          tbody td {
            font-size: 15px;
          }
        }
      }
    }
  }
}
</style>

