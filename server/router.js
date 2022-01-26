const fs = require('fs')
const express = require('express')
const router = express.Router()
const saml = require('samlify')
const axios = require('axios')
const _ = require('lodash')

/**
 * Config axios
 */
const serverConfig = require('../config/server')
const axiosConfig = serverConfig.axios
if (serverConfig.proxyEnable !== 'false') {
  axiosConfig.proxy = serverConfig.proxy
}

const timeExpired = serverConfig.timeExpired // 20 minutes
/**
 * Saml Config
 */
const idp = saml.IdentityProvider({
  metadata: fs.readFileSync(serverConfig.saml.ipdMetaPath),
  // privateKey: fs.readFileSync(serverConfig.saml.privateKeyPath),
  // encPrivateKey: fs.readFileSync(serverConfig.saml.privateKeyPath),
  // isAssertionEncrypted: true,
  // wantLogoutRequestSigned: true,
  // wantLogoutResponseSigned: true
})
const sp = saml.ServiceProvider({
  metadata: fs.readFileSync(serverConfig.saml.spMetaPath),
  // privateKey: fs.readFileSync(serverConfig.saml.privateKeyPath),
  // encPrivateKey: fs.readFileSync(serverConfig.saml.privateKeyPath)
})

/**
 * Middleware check exist account token
 */
const checkExitsAccount = function(req, res, next) {
  if (req.cookies.access_token && !req.cookies.logOut) {
    return res.redirect('/')
  } else {
    next()
  }
}
/**
 * Home Page
 *
 * Default check cookie and redirect to portal
 */
router.get('/', (req, res) => {
  const roleAuth = req.cookies.roleAuth
  // Check Cookie and redirect login if need
  if (typeof roleAuth === 'undefined' || _.isEmpty(roleAuth)) {
    return res.redirect('/adfs/acs')
  } else if (roleAuth.staff_Benefits) {
    return res.redirect('/admin')
  } else {
    return res.redirect('/select-portal')
  }
})

/**
 * Saml route
 *
 * Login
 * SP Post
 */
router.post('/adfs/acs', async (req, res, next) => {
  try {
    /**
     * Reset logout
     */
    res.cookie('logOut', false, {
      maxAge: timeExpired,
      path: '/'
    })
    // eslint-disable-next-line no-unused-vars
    await sp.parseLoginResponse(idp, 'post', req).then(parseResult => {
      const params = {
        email: parseResult.extract.attributes.uid,
        username: parseResult.extract.attributes.uid
      }
      // info user exist one day = 86400000
      res.cookie('info_user', parseResult.extract, {
        maxAge: 86400000,
        path: '/'
      })
      return axios
        .post('v1/TokenAuth/Authenticate', params, axiosConfig)
        .then(rs => {
          if (rs.data.result) {
            res.cookie(
              'preferredName',
              rs.data.result.preferredName || rs.data.result.name,
              {
                maxAge: timeExpired,
                path: '/'
              }
            )
            res.cookie('roleAuth', rs.data.result.roleStaff, {
              maxAge: timeExpired,
              path: '/'
            })
            res.cookie('access_token', rs.data.result.accessToken, {
              maxAge: timeExpired,
              path: '/'
            })
            // include staffID's account authentication
            res.cookie('staff_account', rs.data.result.staffId, {
              maxAge: timeExpired,
              path: '/'
            })
            return res.redirect('/')
          } else {
            return res.redirect('/failed')
          }
        })
        .catch(e => {
          console.log(e)
          const error = new Error()
          error.status = 403
          next(error)
        })
    })
  } catch (e) {
    console.log(e)
    const error = new Error()
    error.status = 403
    next(error)
  }
})

/**
 * Saml route
 *
 * Login
 * SP redirect
 */
router.get('/adfs/acs', checkExitsAccount, async (req, res) => {
  const { context } = await sp.createLoginRequest(idp, 'redirect')
  return res.redirect(context)
})

/**
 * Saml route
 *
 * Logout
 * SP redirect
 */
router.get('/adfs/sls', function(req, res, next) {
  // eslint-disable-next-line no-unused-vars
  // if (req.query.SAMLResponse) {
  //   try {
  //     await sp.parseLogoutResponse(idp, 'redirect', req).then(parseResult => {
  //       res.cookie('logOut', true)
  //       console.log('SSO result logout :::::::', parseResult)
  //       if (
  //         parseResult.extract.statusCode !==
  //         'urn:oasis:names:tc:SAML:2.0:status:Success'
  //       ) {
  //         console.log('SSO result logout :::::::', parseResult)
  //       }
  //       return res.redirect('/adfs/logout')
  //     })
  //   } catch (e) {
  //     console.log('Error:::::::', e)
  //     res.cookie('logOut', true)
  //     const error = new Error()
  //     error.status = 500
  //     next(error)
  //   }
  // } else {
  try {
    // const { context } = await sp.createLogoutRequest(idp, 'redirect', {
    //   logoutNameID: req.cookies.info_user.nameID,
    //   sessionIndex: req.cookies.info_user.sessionIndex
    // })
    /**
     * Clear data
     */
    res.clearCookie('roleAuth')
    res.clearCookie('access_token')
    res.clearCookie('staff_account')
    res.clearCookie('preferredName')
    res.cookie('logOut', true)
    return res.redirect('/adfs/logout')

    //   return res.redirect(context)
  } catch (e) {
    console.log('log Error', e)
    res.clearCookie('roleAuth')
    res.clearCookie('access_token')
    res.clearCookie('staff_account')
    res.clearCookie('preferredName')
    res.cookie('logOut', true)
    const error = new Error()
    error.status = 500
    next(error)
  }
})

router.get('/adfs/logout', function(req, res, next) {
  res.status(200)
  res.render('logout')
})
/**
 * Meta data sp
 */
router.get('/sp/metadata', (req, res) => {
  res.header('Content-Type', 'text/xml').send(sp.getMetadata())
})
/**
 * Meta data idp
 */
router.get('/adfs/metadata', (req, res) => {
  res.header('Content-Type', 'text/xml').send(idp.getMetadata())
})
// handled callback url /stf/?staffid=acb
router.get('/staff/', (req, res, next) => {
  // console.log(req.query)
  const query = req.query
  const queryLowerCase = {}
  Object.keys(query).forEach(element => {
    queryLowerCase[element.toLowerCase()] = query[element]
  })
  if (req.query && queryLowerCase.staffid) {
    res.cookie('staffId', queryLowerCase, {
      maxAge: 1000 * 60 * 20
    })

    return axios
      .get(
        `/v1/TokenAuth/CheckStaff?staffId=${queryLowerCase.staffid}`,
        axiosConfig
      )
      .then(result => {
        res.cookie('BackgroundStaff', result.data.result.data.backgroundStaff, {
          maxAge: 1000 * 60 * 20
        })
        return res.redirect('/staff')
      })
      .catch(err => {
        console.log(err)
      })
  }
  next()
})

module.exports = router
