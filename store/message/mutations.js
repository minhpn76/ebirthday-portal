import { map, merge, find, isUndefined } from 'lodash'
import * as type from './type'
const mutations = {
  [type.GET_BIRTH_DATE](state, StaffBirthDate) {
    state.StaffBirthDate = StaffBirthDate
  },
  [type.GET_PENDING](state, data) {
    state.sendPersonalisedGreetingsPending = data
  },
  [type.IS_LOADING_SMS_PENDING](state, data) {
    state.isLoadingSmsPending = data
  },
  [type.GET_SENT](state, data) {
    state.sendPersonalisedGreetingsSent = data
  },
  [type.IS_LOADING_SMS](state, data) {
    state.isLoadingSms = data
  },
  [type.DATA_STAFF_OF_MONTH](state, data) {
    state.StaffBirthDateOfMonth = data
  },
  [type.INFO_USER](state, data) {
    state.Info_User = data
  },
  [type.DATA_LOADING](state, isLoading) {
    state.isLoading = isLoading
  },
  [type.DATA_READY_SENTSMS](state, { data, revert = false }) {
    if (revert) {
      state.DataReadySendSMS = []
      return false
    }
    const item = state.DataReadySendSMS.filter(
      i => i.memberID === data.memberID
    )
    if (!item.length) {
      state.DataReadySendSMS.push(data)
    }
  },
  [type.REMOVE_ITEM_DATA_SENTSMS](state, memberID) {
    for (let i = 0; i < state.DataReadySendSMS.length; i++) {
      if (state.DataReadySendSMS[i].memberID === memberID) {
        state.DataReadySendSMS.splice(i, 1)
        i--
      }
    }
  },
  [type.MAP_DATA_SEND_SMS](state, payload) {
    state.send_personalised_greetings.sendPersonalisedGreetings = map(
      state.send_personalised_greetings.sendPersonalisedGreetings,
      value => {
        const change = find(payload, ['staffId', value.staffId])
        if (!isUndefined(change)) {
          return merge(value, change)
        }
        return value
      }
    )
  },
  [type.STAFF_FORWARD](state, data) {
    state.staffForward = data
  },
  [type.STAFF_FORWARD_SMS](state, data) {
    state.staffSmsData = data
  },
  [type.PAGE_STAGE](state, data) {
    state.pageStage = data
  }
}

export default mutations
