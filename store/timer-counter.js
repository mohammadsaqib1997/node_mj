import moment from 'moment'

export const state = () => ({
  initTimerOnce: false,
  is_timer: false,
  diffInSec: 0,
  timer: {
    hour: 0,
    minute: 0,
    second: 0
  },
  timerInterval: null
})

export const mutations = {
  set_init_timer_once(state, pld) {
    state.initTimerOnce = pld
  },
  set_is_timer(state, pld) {
    state.is_timer = pld
  },
  set_timer_interval(state, pld) {
    state.timerInterval = pld
  },
  set_timer(state, pld) {
    state.timer = pld
  },
  set_diff_in_sec(state, pld) {
    state.diffInSec = pld
  }
}

export const actions = {
  async getServerTime({
    commit,
    state
  }) {
    let s_time = await this.$axios.$get('/api/web/server-time')
    let date = moment(s_time.datetime).utcOffset("+05:00");
    
    commit('set_timer_interval', setInterval(function () {
      date.add(1, 'seconds')

      let end = moment("2018-12-31 23:59:59");
      let diff_sec = end.diff(date, "seconds");
      commit('set_diff_in_sec', diff_sec)
      if (diff_sec > 0) {
        if (state.is_timer === false) {
          commit('set_is_timer', true)
        }
        let duration = moment.duration(end.diff(date));
        commit('set_timer', {
          hour: duration.get("hours"),
          minute: duration.get("minutes"),
          second: duration.get("seconds")
        })
      } else {
        clearInterval(state.timerInterval);
        commit('set_timer_interval', null)
        commit('set_is_timer', false)
      }
    }, 1000))
    commit('set_init_timer_once', true)
  }
}