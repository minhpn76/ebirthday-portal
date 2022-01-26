import * as type from './type'
export default {
  data_transaction(state) {
    return state.data_transaction
  },
  [type.GET_STAFF_PORTAL](state) {
    return state.staffPortal
  },
  getVoucherStaff(state) {
    return state.voucherStaff
  },
  postVoucherRedemption(state) {
    return state.postVoucherRedemption
  },
  exportExcelTransaction(state) {
    return state.exportExcelTransaction
  },
  exportPdfTransaction(state) {
    return state.exportPdfTransaction
  },
  isLoading(state) {
    return state.isLoading
  }
}
