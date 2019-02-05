<template>
  <div class="main">
    <div class="columns is-variable is-1">
      <div class="column is-2">
        <div class="cont">
          <h1 class="header">Message Box</h1>
          <div class="body">
            <div class="create-msg-btn-cont">
              <b-dropdown>
                <button class="button" slot="trigger">Create Message</button>
                <b-dropdown-item>Custom</b-dropdown-item>
                <b-dropdown-item>Company Team</b-dropdown-item>
                <b-dropdown-item>Members</b-dropdown-item>
                <b-dropdown-item>Company</b-dropdown-item>
              </b-dropdown>
            </div>
            <ul class="items opt-cont">
              <li class="item active">Inbox</li>
              <li class="item">Sent</li>
              <li class="item">Trash</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="cont">
          <h1 class="header">Inbox</h1>
          <div class="body">
            <b-field class="src-cont">
              <p class="control has-icons-right is-expanded">
                <b-input type="search" placeholder="Search"></b-input>
                <span class="icon is-right">
                  <i class="fas fa-search"></i>
                </span>
              </p>
            </b-field>
            <ul class="items msg-cont">
              <li v-for="n in 5" :key="n" class="item read">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <div>
                        <span class="msg-title">This is subject</span>
                        <span class="msg-em">abc@app.com</span>
                      </div>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <span class="msg-date">20 days ago</span>
                    </div>
                  </div>
                </div>

                <p
                  class="msg-body"
                >This is message This is message This is message This is message This is message.ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
              </li>
              <li class="item active">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <div>
                        <span class="msg-title">This is subject</span>
                        <span class="msg-em">abc@app.com</span>
                      </div>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <span class="msg-date">20 days ago</span>
                    </div>
                  </div>
                </div>

                <p
                  class="msg-body"
                >This is message This is message This is message This is message This is message.ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
              </li>
              <li class="item">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <div>
                        <span class="msg-title">This is subject</span>
                        <span class="msg-em">abc@app.com</span>
                      </div>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <span class="msg-date">20 days ago</span>
                    </div>
                  </div>
                </div>

                <p
                  class="msg-body"
                >This is message This is message This is message This is message This is message.ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="column is-7">
        <div class="cont">
          <h1 class="header">Message</h1>
          <div class="body">
            <div class="msg-detail-cont">
              <div class="head">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <div>
                        <h1 class="msg-title">This is Subject</h1>
                        <p class="from-info">
                          <span>Name: Abc Abc</span>
                          <span>Email: abc@app.com</span>
                          <span>MJ ID: 000000001</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <div class="date">23:22:05 22/02/2019</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="msg-body">this is message</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "msg_box"
};
</script>

<style lang="scss" scoped>
.main {
  --paddGap: 0.25rem;
  height: 100%;
  padding-left: var(--paddGap);
  padding-right: var(--paddGap);
  /deep/ {
    & > .columns:first-child {
      margin-top: 0;
      height: 100%;
      .column {
        padding-top: var(--paddGap);
        padding-bottom: var(--paddGap);
        .cont {
          height: 100%;
          background-color: white;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
    }
    .cont {
      & > .header {
        font-weight: 500;
        text-transform: uppercase;
        font-size: 18px;
        padding: 10px 20px;
        border-bottom: 2px solid #d9bd68;
        color: #3d3e5a;
      }
      & > .body {
        .create-msg-btn-cont {
          padding: 10px;
          display: flex;
          justify-content: center;
          .button {
            border-radius: 0;
            background-color: #d9bd68;
            font-size: 16px;
            text-transform: uppercase;
            border-color: transparent;
            color: #3d3e5a;
            font-weight: 500;
            &:focus {
              border-color: #d9bd68;
            }
            &:active {
              border-color: #caa638;
            }
            &:focus:not(:active),
            &.is-focused:not(:active) {
              box-shadow: 0 0 0 0.125em rgba(217, 189, 104, 0.25);
            }
          }
          .dropdown-content {
            border-radius: 0;
            box-shadow: 0 2px 3px rgba(61, 62, 90, 0.25), 0 0 0 1px #3d3e5a;
            background-color: #3d3e5a;
            .dropdown-item {
              color: white;
              font-size: 12px;
              text-transform: uppercase;
              &:hover {
                background-color: white;
                color: #3d3e5a;
              }
            }
          }
        }
        & > hr {
          margin: 0.5rem 0;
          height: 1px;
        }
        & > .src-cont {
          padding: 10px;
          .control {
            .input {
              border-radius: 0;
              box-shadow: none;
              border: 1px solid #eeeeee;
              height: 2.8rem;
            }

            .icon {
              top: 4px;
              color: #d9bd68;
            }

            & > .select {
              &:after {
                border-color: #afafaf;
                top: 22px;
              }

              & > select {
                border-color: #eeeeee;
                height: 2.8rem;

                &:focus,
                &:active {
                  -webkit-box-shadow: none;
                  -moz-box-shadow: none;
                  box-shadow: none;
                }
              }
            }

            &.is-loading {
              .icon {
                display: none;
              }

              &:after {
                top: 14px;
              }
            }
          }
        }
        & > .items {
          .item {
            border-bottom: 1px solid whitesmoke;
            cursor: pointer;
            &:hover {
              background-color: #d9bd687d !important;
            }
            &.active {
              background-color: #d9bd687d !important;
              position: relative;
              &:before {
                content: "";
                position: absolute;
                width: 5px;
                height: 100%;
                background-color: #3d3e5a;
                left: 0;
                top: 0;
              }
            }
            &:first-child {
              border-top: 1px solid whitesmoke;
            }
          }
          &.opt-cont {
            margin-top: 1rem;
            .item {
              padding: 10px 20px;
              &.active {
                font-weight: 500;
              }
            }
          }
          &.msg-cont {
            margin-top: 1rem;
            .item {
              padding: 10px 20px;
              .level {
                align-items: flex-start;
                margin-bottom: 5px;
                @media screen and (min-width: 769px) {
                  .level-left,
                  .level-right {
                    max-width: 50%;
                    .level-item {
                      max-width: 100%;
                      > div:first-child {
                        max-width: 100%;
                      }
                    }
                  }
                }
              }
              &:not(.read) {
                .msg-date,
                .msg-title {
                  font-weight: 500;
                }
                .msg-title,
                .msg-body,
                .msg-date,
                .msg-em {
                  color: #3d3e5a;
                }
              }
              &.read {
                background-color: #e2e2e2;
                color: #6d6d6d;
              }

              .msg-title,
              .msg-body,
              .msg-date,
              .msg-em {
                font-size: 14px;
              }

              .msg-body,
              .msg-title,
              .msg-em {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: normal;
              }
            }
          }
        }

        & > .msg-detail-cont {
          .head {
            border-bottom: 2px solid whitesmoke;
            margin: 15px;
            & > .level {
              align-items: flex-end;
            }
            .date {
              font-size: 14px;
              color: #3d3e5a;
              font-weight: 500;
            }
            .msg-title {
              font-size: 20px;
              margin-bottom: 0.5rem;
              font-weight: 600;
            }
            .from-info {
              font-size: 12px;
              color: #b5b5b5;
              font-weight: 300;
              span {
                display: block;
              }
            }
          }
          .msg-body {
            word-break: break-word;
            margin: 15px;
            font-size: 15px;
          }
        }
      }
    }
  }
}
</style>

