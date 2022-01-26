import * as type from './type'

const mutations = {
  [type.GET_DATA_TRANSACTION](state, data) {
    state.data_transaction = data
  },
  [type.GET_STAFF_PORTAL](state, data) {
    state.staffPortal = data
  },
  [type.GET_VOUCHER_STAFF](state, data) {
    state.voucherStaff = data
  },
  [type.POST_VOUCHER_REDEMPTION](state, data) {
    state.postVoucherRedemption = data
  },
  [type.EXPORT_EXCEL](state, data) {
    state.exportExcelTransaction = data
  },
  [type.EXPORT_PDF](state, data) {
    state.exportPdfTransaction = data
  },
  [type.DATA_LOADING](state, isLoading) {
    state.isLoading = isLoading
  }
}

export default mutations
