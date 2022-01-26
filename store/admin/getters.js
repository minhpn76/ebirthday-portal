const getters = {
  StaffBirthDateTotal(state, getters) {
    return state.StaffBirthDateTotal
  },
  StaffBirthDateOfMonth(state) {
    return state.StaffBirthDateOfMonth
  },
  RecentSms(state) {
    return state.recent_sms
  },
  PersonalisedGreetingData(state) {
    return state.data_personalised
  },
  Manager(state) {
    return state.Manager
  },
  Department(state) {
    const array = []
    state.Department.forEach(element => {
      array.push(element || '')
    })
    return array
  },
  Info_User(state) {
    return state.Info_User
  },
  Access_Token(state) {
    return state.Access_Token
  },
  AuthRole(state) {
    return state.authRole
  },
  getStaffBySearch(state) {
    return state.staffBySearch
  },
  getRoleStaff(state) {
    return state.roleStaff
  },
  sentSMS(state) {
    return state.sentSMS
  },
  searchFunctionalId(state) {
    return state.searchFunctionalId
  },
  createFunctionalId(state) {
    return state.createFunctionalId
  },
  getOutLets(state) {
    return state.outLets
  },
  getListTemplates(state) {
    return state.dataTemplates
  },
  createOrUpdateTemplate(state) {
    return state.createOrderUpdateTemplate
  },
  isLoading(state) {
    return state.loading
  },
  dataSendSms(state) {
    return state.dataSendSms
  }
}
export default getters
