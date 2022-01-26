import * as type from './type'

const actions = {
  /**
   * dashboard
   * @param {*} context
   */
  async getTotalStaffBirthdays(context) {
    await this.$axios
      .get('/v1/Dashboard/GetDashboard?dashboardType=2')
      .then(res => {
        if (res.status === 200) {
          context.commit(
            type.TOTAL_BIRTH_DATE,
            res.data.result.adminPortalDashboard
          )
        }
      })
      .catch(error => {
        console.log('error--', error)
      })
  },
  /**
   *  view birthday
   *
   */
  async getDataStaffBirthdayOfMonth(context, payload) {
    context.commit(type.DATA_LOADING, true)
    let sort = {}
    switch (payload.sortBy) {
      case 'name':
        sort = {
          IsNameDesc: !payload.sortDesc
        }
        break
      case 'birthdate':
        sort = {
          IsBirthdateDesc: !payload.sortDesc
        }
        break
      case 'department':
        sort = {
          IsDepartmentDesc: !payload.sortDesc
        }
        break
      case 'manager':
        sort = {
          IsManagerDesc: !payload.sortDesc
        }
        break
      case 'service_since':
        sort = {
          IsInServiceSinceDesc: !payload.sortDesc
        }
        break
      case 'service_duration':
        sort = {
          IsServiceDurationDesc: !payload.sortDesc
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
      .get('/v1/AdminPortal/ViewBirthdays', { params: payload })
      .then(res => {
        if (res.status === 200) {
          context.commit(type.DATA_STAFF_OF_MONTH, res.data.result)
          context.commit(type.DATA_LOADING, false)
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  /**
   * Get Resent data
   *
   * @param context
   * @param payload
   * @returns {Promise<void>}
   */
  async getDataRecentSms(context, payload) {
    context.commit(type.DATA_LOADING, true)
    let sort = {}
    switch (payload.sortBy) {
      case 'department':
        sort = {
          IsDepartmentDesc: !payload.sortDesc
        }
        break
      case 'manager':
        sort = {
          IsManagerDesc: !payload.sortDesc
        }
        break
      case 'name':
        sort = {
          IsNameDesc: !payload.sortDesc
        }
        break
      case 'birthdate':
        sort = {
          IsBirthdateDesc: !payload.sortDesc
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
      .get(`/v1/AdminPortal/GetResend`, { params: payload })
      .then(res => {
        if (res.status === 200) {
          context.commit(type.DATA_RECENT_SMS, res.data.result)
        }
        context.commit(type.DATA_LOADING, false)
      })
      .catch(error => {
        console.log('error', error)
      })
  },

  /**
   * Get data personalised
   * @param context
   * @param payload
   * @returns {Promise<void>}
   */
  async getDataPersonalised(context, payload) {
    context.commit(type.DATA_LOADING, true)
    let sort = {}
    switch (payload.sortBy) {
      case 'department':
        sort = {
          IsDepartmentDesc: payload.sortDesc
        }
        break
      case 'yearToDate':
        sort = {
          IsYearToDateDesc: payload.sortDesc
        }
        break
      case 'name':
        sort = {
          IsNameDesc: payload.sortDesc
        }
        break
      case 'before2Month':
        sort = {
          IsBefore2MonthDesc: payload.sortDesc
        }
        break
      case 'before1Month':
        sort = {
          IsBefore1MonthDesc: payload.sortDesc
        }
        break
      case 'thisMonth':
        sort = {
          IsThisMontDesc: payload.sortDesc
        }
        break
      case 'totalReportingStaff':
        sort = {
          IsTotalReportingStaffDesc: payload.sortDesc
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
      .get('/v1/AdminPortal/PersonalisedGreetings', { params: payload })
      .then(res => {
        if (res.status === 200) {
          context.commit(type.DATA_PERSONALISED_STATS, res.data.result)
          context.commit(type.DATA_LOADING, false)
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  async getListManager(context) {
    const data = []
    await this.$axios
      .get('v1/AdminPortal/GetManager')
      .then(res => {
        if (res.status === 200) {
          const dataManager = res.data.result
          if (dataManager.length === 0) {
            const result = data
            context.commit(type.DATA_MANAGER, result)
          } else {
            context.commit(type.DATA_MANAGER, dataManager)
          }
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  async getListDepartment(context) {
    const data = []
    await this.$axios
      .get('/v1/AdminPortal/GetDepartment')
      .then(res => {
        if (res.status === 200) {
          const dataDeparment = res.data.result
          if (dataDeparment.length === 0) {
            context.commit(type.DATA_DEPARTMENT, data)
          } else {
            context.commit(type.DATA_DEPARTMENT, dataDeparment)
          }
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  async logoutAuth(context) {
    await this.$axios
      .post('/v1/TokenAuth/LogOut')
      .then(res => {
        if (res.status === 200) {
          context.commit(type.INFO_USER, {})
          context.commit(type.ACCESS_TOKEN, '')
          context.commit(type.LOGOUT_AUTH)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  async getRoleStaff(context, params) {
    await this.$axios
      .get('v1/AdminPortal/GetStaffRole', { params: params.params })
      .then(result => {
        if (
          result.data.result.code === 200 &&
          result.data.result.data !== null
        ) {
          context.commit(type.DATA_ROLE_STAFF, result.data.result.data)
        } else {
          this.$toast.error(result.data.result.message)
          context.commit(type.DATA_ROLE_STAFF, {})
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  resetRoleStaff(context) {
    context.commit(type.DATA_ROLE_STAFF, {})
  },
  async updateRoleStaff(context, payload) {
    await this.$axios
      .post('v1/AdminPortal/PostSetRole', payload.payload)
      .then(result => {
        if (result.data.result.code === 200) {
          context.commit(type.UPDATE_ROLE_STAFF, result.data.result)
          this.$toast.success('Update Role Staff Successfully!')
        } else {
          this.$toast.error(result.data.result.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  async resendSMS(context, params) {
    await this.$axios
      .get('/v1/AdminPortal/ResentSMS', { params: params.params })
      .then(result => {
        if (result.data.result.code === 200) {
          context.commit(type.SENT_SMS, result.data)
          this.$toast.success('Re-send of SMS is successfully!')
        } else {
          this.$toast.error(result.data.result.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  async createFunctionalId(context, payload) {
    await this.$axios
      .post('/v1/AdminPortal/CreateFunctionalId', payload.payload)
      .then(res => {
        if (res.data.result.code === 200) {
          context.commit(type.CREATE_FUNCTION_ID, res.data)
          this.$toast.success('Functional ID created successfully!')
        } else {
          this.$toast.error(res.data.result.message)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  searchFunctionalId(context, payload) {
    context.commit(type.DATA_LOADING, true)
    this.$axios
      .get('/v1/AdminPortal/SearchFunctionalId', { params: payload })
      .then(res => {
        if (res.data.result.code === 200) {
          context.commit(type.SEARCH_FUNCTION_ID, res.data.result.data)
        } else {
          context.commit(type.SEARCH_FUNCTION_ID, {})
          this.$toast.error(`There is no email address or staff ID entered.`)
        }
        context.commit(type.DATA_LOADING, false)
      })
      .catch(error => {
        console.log(error)
        context.commit(type.DATA_LOADING, false)
      })
  },
  resetSearchFunctionId(context, objectReset = {}) {
    context.commit(type.SEARCH_FUNCTION_ID, objectReset)
  },
  async getOutLets(context) {
    await this.$axios
      .get('/v1/AdminPortal/GetOutletCode')
      .then(res => {
        if (res.status === 200 && res.data.success === true) {
          context.commit(type.GET_OUTLET_CODE, res.data.result)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  deactiveFunctionalId(context, payload) {
    this.$axios
      .post('/v1/AdminPortal/DeactiveFunctionalId', payload)
      .then(res => {
        if (res.data.result.code === 200) {
          context.commit(type.DEACTIVE_FUNCTION_ID, res.data)
        } else {
          this.$toast.error(res.data.result.message)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  async createOrUpdateTemplate(context, payload) {
    await this.$axios
      .post('/v1/AdminPortal/CreateOrUpdateTemplate', payload.params)
      .then(res => {
        if (res.status === 200 && res.data.result.code === 200) {
          context.commit(type.CREATE_OR_UPDATE_TEMPLATE, res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  async getListTemplate(context, params) {
    await this.$axios
      .get('/v1/AdminPortal/GetTemplate', { params: params.params })
      .then(res => {
        console.log(res)
        if (res.status === 200 && res.data.success === true) {
          context.commit(type.DATA_TEMPLATES, res.data.result)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  getDaySendSms(context) {
    this.$axios.get('/v1/AdminPortal/GetDaySendSms').then(res => {
      context.commit(type.DATA_SEND_SMS, res.data.result.data)
    })
  },
  updateDaySendSms(context, payload) {
    this.$axios.post('/v1/AdminPortal/UpdateDaySendSms', payload).then(res => {
      context.commit(type.DATA_SEND_SMS, res.data.result.data)
      this.$toast.success('Update successfully')
    })
  }
}

export default actions
