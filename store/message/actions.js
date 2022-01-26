import * as type from './type'

const actions = {
  /**
   * Get Birthday data dashboard
   *
   * @param context
   */
  async getBirthDayData(context) {
    await this.$axios
      .get('/v1/Dashboard/GetDashboard?dashboardType=1')
      .then(res => {
        context.commit(
          type.GET_BIRTH_DATE,
          res.data.result.messagePortalDashboard
        )
      })
      .catch(e => {
        console.log(e)
      })
  },
  async getDataStaffBirthdayOfMonth(context, payload) {
    context.commit(type.DATA_LOADING, true)
    let sort = {}
    switch (payload.sortBy) {
      case 'name':
        sort = {
          IsNameDesc: !payload.sortDesc
        }
        break
      case 'birthday':
        sort = {
          IsBirthdateDesc: !payload.sortDesc
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
      .get(`/v1/MessagePortal/GetBirthdays`, { params: payload })
      .then(res => {
        context.commit(type.DATA_STAFF_OF_MONTH, res.data.result)
        context.commit(type.DATA_LOADING, false)
      })
      .catch(e => {
        console.log(e)
      })
  },
  async GetPersonalisedGreetingPending(context, query) {
    context.commit(type.IS_LOADING_SMS_PENDING, true)
    await this.$axios
      .get(`/v1/MessagePortal/GetPersonalisedGreetingPending`, {
        params: query.params
      })
      .then(res => {
        if (res.data.success) {
          context.commit(type.GET_PENDING, res.data.result)
        }
        context.commit(type.IS_LOADING_SMS_PENDING, false)
      })
      .catch(e => {
        console.log(e)
      })
  },
  async GetPersonalisedGreetingSent(context, query) {
    context.commit(type.IS_LOADING_SMS, true)
    await this.$axios
      .get(`/v1/MessagePortal/GetPersonalisedGreetingSend`, {
        params: query.params
      })
      .then(res => {
        if (res.data.success) {
          context.commit(type.GET_SENT, res.data.result)
        }
        context.commit(type.IS_LOADING_SMS, false)
      })
      .catch(e => {
        console.log(e)
      })
  },
  sendGreeting(context, payload) {
    context.commit(type.IS_LOADING_SMS, true)
    this.$axios.post('/v1/MessagePortal/SendGreeting', payload).then(res => {
      if (res.data.result.code === 200) {
        this.$toast.success('Sent successfully !')
      } else {
        this.$toast.error(res.data.result.message)
      }
      context.commit(type.IS_LOADING_SMS, false)
    })
  },
  getStaffForward(context, staffIdTake) {
    context.commit(type.DATA_LOADING, true)
    this.$axios
      .get('/v1/MessagePortal/GetMemberForward', { params: staffIdTake })
      .then(res => {
        if (res.data.result) {
          context.commit(type.STAFF_FORWARD, res.data.result)
        }
        context.commit(type.DATA_LOADING, false)
      })
  },
  /**
   * Update staff forward
   *
   * @param context
   * @param staffSelected
   */
  updateStaffForward(context, staffSelected) {
    this.$axios
      .post('/v1/MessagePortal/PostForward', staffSelected)
      .then(res => {
        if (res.data.result.code === 200) {
          this.$toast.success('forwarded !')
        } else {
          this.$toast.error(res.data.result.message)
        }
      })
  },
  /**
   * get staff forward sms
   *
   * @param context
   * @param staffData
   */
  getStaffForwardSms(context, staffData) {
    context.commit(type.DATA_LOADING, true)
    this.$axios
      .get('/v1/MessagePortal/GetForwardSms', { params: staffData })
      .then(res => {
        if (res.data.result) {
          context.commit(type.STAFF_FORWARD_SMS, res.data.result)
        }
        context.commit(type.DATA_LOADING, false)
      })
  },
  /**
   * update staff forward sms
   *
   * @param context
   * @param staffData
   */
  updateStaffForwardSms(context, staffData) {
    this.$axios
      .post('/v1/MessagePortal/PostForwardSms', staffData)
      .then(res => {
        if (res.data.result.code !== 2000) {
          this.$toast.error(res.data.result.messages)
        }
      })
  },
  updatePageStage(context, stage) {
    context.commit(type.PAGE_STAGE, stage)
  }
}

export default actions
