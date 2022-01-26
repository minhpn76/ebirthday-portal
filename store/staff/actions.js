import * as type from './type'

const actions = {
  async verifyOTP(context, payload) {
    await this.$axios
      .post('/v1/TokenAuth/StaffVerifyLogin', payload.payload)
      .then(result => {
        if (result.data.code === 200 && result.data.data !== null) {
          context.commit(type.DATA_STAFF, result.data.data)
          return result.data.data
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  async loginStaffOTP(context, payload) {
    await this.$axios
      .post('/v1/TokenAuth/StaffLogin', {
        staffId: payload.payload
      })
      .then(result => {
        if (result.status === 200 && result.data.data !== null) {
          context.commit(type.LOGIN_STAFF_OTP, result.data.data)
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  /**
   * check staff id
   * @param context
   * @param payload
   * @return {Promise<void>}
   * @constructor
   */
  CheckStaff(context, payload) {
    // console.log(app.$cookies.get('staffId'))
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/v1/TokenAuth/CheckStaff?staffId=100381')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default actions
