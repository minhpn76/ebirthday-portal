import * as type from './type'

const mutations = {
  [type.DATA_STAFF](state, data) {
    state.data_staff = data
  },
  [type.LOGIN_STAFF_OTP](state, data) {
    state.data_staff_OTP = data
  }
}

export default mutations
