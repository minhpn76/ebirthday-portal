import * as type from './type'

const actions = {
  async data_transaction(context, payload) {
    context.commit(type.DATA_LOADING, true)
    let sort = {}
    switch (payload.sortBy) {
      case 'staffId':
        sort = {
          IsStaffIdDesc: !payload.sortDesc
        }
        break
      case 'staffName':
        sort = {
          IsStaffNameDesc: !payload.sortDesc
        }
        break
      case 'voucherName':
        sort = {
          IsVoucherNameDesc: !payload.sortDesc
        }
        break
      case 'voucherId':
        sort = {
          IsVoucherIdDesc: !payload.sortDesc
        }
        break
      case 'voucherExpiryDate':
        sort = {
          IsVoucherExpDesc: !payload.sortDesc
        }
        break
      case 'transactionNo':
        sort = {
          IsTransactionNoDesc: !payload.sortDesc
        }
        break
      case 'transactionDate':
        sort = {
          IsTransactionDateDesc: !payload.sortDesc
        }
        break
      default:
        break
    }
    payload = {
      ...payload,
      ...sort
    }

    await this.$axios
      .post('/v1/RedemptionPortal/GetTransactionRedeem', payload)
      .then(result => {
        context.commit(type.GET_DATA_TRANSACTION, result.data.result.data)
        context.commit(type.DATA_LOADING, false)
      })
      .catch(e => {
        console.log(e)
      })
  },
  async getStaffPortal(context, query) {
    await this.$axios
      .get(
        `GetStaffPortal?StaffID=${query.staffId}&VoucherNumber=${query.voucherId}`
      )
      .then(rs => {
        context.commit(type.GET_STAFF_PORTAL, rs.data.result)
      })
      .catch(e => {
        console.log(e)
      })
  },

  async getVoucherStaff(context, params) {
    await this.$axios
      .get('/v1/RedemptionPortal/GetVoucherStaff', { params: params.params })
      .then(result => {
        context.commit(type.GET_VOUCHER_STAFF, result.data.result.data)
      })
      .catch(e => {
        console.log(e)
      })
  },
  resetVoucherStaff(context) {
    context.commit(type.GET_VOUCHER_STAFF, {})
  },
  postVoucherRedemption(context, payload) {
    this.$axios
      .post('/v1/RedemptionPortal/VoucherRedemption', payload)
      .then(result => {
        if (result.data.result.code === 200) {
          this.$toast.success('Redeemed')
        } else {
          this.$toast.error(result.data.result.message)
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  async exportExcelTransactionRedeem(context, payload) {
    await this.$axios
      .post(
        '/v1/RedemptionPortal/ExportExcelTransactionRedeem',
        payload.payload
      )
      .then(result => {
        context.commit(type.EXPORT_EXCEL, result.data.result)
      })
      .catch(e => {
        console.log(e)
      })
  },
  async exportPdfTransactionRedeem(context, payload) {
    await this.$axios
      .post('/v1/RedemptionPortal/ExportPdfTransactionRedeem', payload.payload)
      .then(result => {
        context.commit(type.EXPORT_PDF, result.data.result)
      })
      .catch(e => {
        console.log(e)
      })
  },
  extendVoucher(context, payload) {
    this.$axios
      .post('/v1/RedemptionPortal/VoucherExtension', payload)
      .then(res => {
        this.$toast.success(`Update succesfuly`)
      })
      .catch(err => {
        console.log(err)
        this.$toast.error(`Expiry date is required`)
      })
  }
}

export default actions
