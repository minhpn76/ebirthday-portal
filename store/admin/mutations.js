import * as type from './type'

const mutations = {
  [type.TOTAL_BIRTH_DATE](state, StaffBirthDateTotal) {
    state.StaffBirthDateTotal = StaffBirthDateTotal
  },
  [type.DATA_STAFF_OF_MONTH](state, data) {
    state.StaffBirthDateOfMonth = data
  },
  [type.DATA_RECENT_SMS](state, data) {
    state.recent_sms = data
  },
  [type.DATA_PERSONALISED_STATS](state, data) {
    state.data_personalised = data
  },
  [type.DATA_DEPARTMENT](state, data) {
    state.Department = data
  },
  [type.DATA_MANAGER](state, data) {
    state.Manager = data
  },
  [type.INFO_USER](state, data) {
    state.Info_User = data
  },
  [type.ACCESS_TOKEN](state, data) {
    state.Access_Token = data
  },
  [type.PREFERRED_NAME](state, data) {
    state.preferredName = data
  },
  [type.LOGOUT_AUTH](state, data) {
    state.logoutAuth = data
  },
  [type.ROLE_AUTH](state, data) {
    state.authRole = data
  },
  [type.GET_STAFF_BY_SEARCH](state, data) {
    state.staffBySearch = data
  },
  [type.DATA_ROLE_STAFF](state, data) {
    state.roleStaff = data
  },
  [type.UPDATE_ROLE_STAFF](state, data) {
    state.dataSetRoleStaff = data
  },
  [type.SENT_SMS](state, data) {
    state.sentSMS = data
  },
  [type.CREATE_FUNCTION_ID](state, data) {
    state.createFunctionalId = data
  },
  [type.DEACTIVE_FUNCTION_ID](state, data) {
    state.deactiveFunctionalId = data
  },
  [type.SEARCH_FUNCTION_ID](state, data) {
    state.searchFunctionalId = data
  },
  [type.GET_OUTLET_CODE](state, data) {
    state.outLets = data
  },
  [type.DATA_TEMPLATES](state, data) {
    state.dataTemplates = data
  },
  [type.CREATE_OR_UPDATE_TEMPLATE](state, data) {
    state.createOrderUpdateTemplate = data
  },
  [type.DATA_LOADING](state, loading) {
    state.loading = loading
  },
  [type.DATA_SEND_SMS](state, dataSendSms) {
    state.dataSendSms = dataSendSms
  }
}

export default mutations
