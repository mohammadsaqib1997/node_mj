import {
  DateTime
} from 'luxon'

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
    commit('set_timer_interval', setInterval(function () {
      let date = DateTime.local().setZone('UTC+5');
      let end = DateTime.local().setZone('UTC+5').set({
        year: 2018,
        month: 12,
        day: 31,
        hour: 23,
        minute: 59,
        second: 59
      })
      let diff_timer = end.diff(date, ['hour', 'minute', 'second']).toObject()
      let diff_sec = parseInt(end.diff(date, 'second').toObject().seconds);

      commit('set_diff_in_sec', diff_sec)
      if (diff_sec > 0) {
        if (state.is_timer === false) {
          commit('set_is_timer', true)
        }
        commit('set_timer', {
          hour: parseInt(diff_timer.hours),
          minute: parseInt(diff_timer.minutes),
          second: parseInt(diff_timer.seconds)
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