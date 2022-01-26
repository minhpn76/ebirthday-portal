import { map, isUndefined } from 'lodash'
// import serverConfig from '../config/server'

const exceptLink = [
  '/staff',
  '/staff/OTP',
  '/staff/step',
  '/staff/profile',
  '/slide',
  '/logout',
  '/failed',
  '/adfs/acs'
]

const timeExpired = 60 * 20

export default function({ app, store, redirect, route }) {
  /**
   * Check except URL not check auth data
   */

  if (!exceptLink.includes(route.fullPath)) {
    if (
      isUndefined(app.$cookies.get('roleAuth')) ||
      isUndefined(app.$cookies.get('access_token')) ||
      isUndefined(app.$cookies.get('staff_account'))
    ) {
      if (!isUndefined(app.$cookies.get('info_user'))) {
        if (process.server) {
          return redirect('/adfs/sls')
        } else {
          return (window.location = '/adfs/sls')
        }
      } else {
        /**
         * Check process of nuxtjs
         */
        // eslint-disable-next-line no-lonely-if
        if (!process.server) {
          return (window.location = '/adfs/acs')
        } else {
          return redirect('/adfs/acs')
        }
      }
    }
    /**
     * Logic logout after 20min idle
     */
    const cookies = app.$cookies.getAll()
    map(cookies, (value, key) => {
      if (key !== 'updateRoles' && key !== 'info_user') {
        app.$cookies.set(key, value, {
          path: '/',
          maxAge: timeExpired
        })
      }
      if (key === 'info_user') {
        // user info_user for logout
        app.$cookies.set(key, value, {
          path: '/',
          maxAge: timeExpired * 20
        })
      }
    })

    /**
     * Active page
     * @type {string}
     */
    let pageActive = ''
    if (route.fullPath.includes('admin')) {
      pageActive = 'admin'
      store.commit('PAGE_ACTIVE', 'admin')
    } else if (route.fullPath.includes('message')) {
      pageActive = 'message'
      store.commit('PAGE_ACTIVE', 'message')
    } else if (route.fullPath.includes('redemption')) {
      pageActive = 'redemption'
      store.commit('PAGE_ACTIVE', 'redemption')
    }
    app.$cookies.set('pageAtive', pageActive, {
      path: '/',
      maxAge: timeExpired
    })

    /**
     * Check Roles redirect to home page
     */
    if (route.fullPath.includes('admin')) {
      if (store.state.authRole.staff_Benefits === false) {
        return redirect('/')
      }
    } else if (route.fullPath.includes('message')) {
      if (
        store.state.authRole.reporting_Manager === false &&
        store.state.authRole.staff_Benefits === false &&
        store.state.authRole.staff_Member === false
      ) {
        return redirect('/')
      }
    } else if (route.fullPath.includes('redemption')) {
      if (
        store.state.authRole.finance === true &&
        store.state.authRole.frontStaff === false &&
        store.state.authRole.staff_Benefits === false &&
        !route.fullPath.includes('redemption/transaction')
      ) {
        return redirect('/redemption/transaction')
      }
      if (
        store.state.authRole.frontStaff === false &&
        store.state.authRole.finance === false &&
        store.state.authRole.staff_Benefits === false
      ) {
        return redirect('/')
      }
    } else if (route.fullPath.includes('logout')) {
      if (store.state.logOut === false) {
        return redirect('/failed')
      }
    }
  } else if (route.fullPath.includes('staff/profile')) {
    if (Object.keys(store.state.staff.data_staff).length === 0) {
      return redirect('/staff')
    }
  }
}
