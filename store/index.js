// import axios from 'axios'
import * as type from './message/type'
import {
  LOGOUT_AUTH,
  STAFF_AUTH,
  PAGE_ACTIVE,
  PREFERRED_NAME
} from './admin/type'

export const state = () => ({
  locales: ['en'],
  locale: 'en',
  authToken: '',
  authRole: {},
  Info_User: {},
  staffId: {},
  logOut: false,
  preferredName: '',
  staffAuth: {},
  pageActive: ''
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  [type.INFO_USER](state, data) {
    state.Info_User = data
  },
  [type.AUTH_TOKEN](state, token) {
    state.authToken = token
  },
  [type.ROLE_AUTH](state, roles) {
    state.authRole = roles
  },
  [type.STAFF_ID](state, staffID) {
    state.staffId = staffID
  },
  [LOGOUT_AUTH](state, data) {
    state.logOut = data
  },
  [STAFF_AUTH](state, data) {
    state.staffAuth = data
  },
  [PAGE_ACTIVE](state, data) {
    state.pageActive = data
  },
  [PREFERRED_NAME](state, data) {
    state.preferredName = data
  }
}

export const getters = {
  [type.INFO_USER](state) {
    return state.Info_User
  },
  [type.ROLE_AUTH](state) {
    return state.authRole
  },
  [type.STAFF_ID](state) {
    return state.staffId
  },
  [LOGOUT_AUTH](state) {
    return state.logOut
  },
  [STAFF_AUTH](state) {
    return state.staffAuth
  },
  [PREFERRED_NAME](state) {
    return state.preferredName
  },
  [PAGE_ACTIVE](state) {
    return state.pageActive
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.cookies.info_user) {
      if (typeof req.cookies.info_user === 'object') {
        commit(type.INFO_USER, req.cookies.info_user)
      } else {
        commit(type.INFO_USER, JSON.parse(req.cookies.info_user))
      }
    }
    if (req.cookies.access_token) {
      commit(type.AUTH_TOKEN, req.cookies.access_token)
    }
    if (req.cookies.roleAuth) {
      if (typeof req.cookies.roleAuth === 'object') {
        commit(type.ROLE_AUTH, req.cookies.roleAuth)
      } else {
        commit(type.ROLE_AUTH, JSON.parse(req.cookies.roleAuth))
      }
    }
    if (req.cookies.staffId) {
      commit(type.STAFF_ID, req.cookies.staffId)
    }
    if (req.cookies.logOut || req.cookies.log === undefined) {
      commit(LOGOUT_AUTH, req.cookies.logOut)
    }
    if (req.cookies.staff_account) {
      commit(STAFF_AUTH, req.cookies.staff_account)
    }
    if (req.cookies.pageActive) {
      commit(PAGE_ACTIVE, req.cookies.pageActive)
    }
    if (req.cookies.preferredName) {
      commit(PREFERRED_NAME, req.cookies.preferredName)
    }
  },
  browserInit(context) {
    context.commit(LOGOUT_AUTH, true)
  }
}
export const strict = false
