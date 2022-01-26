export default {
  StaffBirthDate(state) {
    return state.StaffBirthDate
  },
  StaffPending(state) {
    return state.StaffPending
  },
  getPending(state) {
    return state.sendPersonalisedGreetingsPending
  },
  getSent(state) {
    return state.sendPersonalisedGreetingsSent
  },
  StaffBirthDateOfMonth(state) {
    return state.StaffBirthDateOfMonth
  },
  DataReadySendSMS(state) {
    return state.DataReadySendSMS
  },
  isLoading(state) {
    return state.isLoading
  },
  dataStaffForward(state) {
    return state.staffForward
  },
  staffSmsData(state) {
    return state.staffSmsData
  },
  isLoadingSms(state) {
    return state.isLoadingSms
  },
  isLoadingSmsPending(state) {
    return state.isLoadingSmsPending
  },
  getPageStage(state) {
    return state.pageStage
  }
}
