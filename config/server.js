/**
 * use only for Express config
 *
 * Need env file ( file .env) or config env on windows server
 *
 * tutorial env: https://lsdbtech.wordpress.com/2015/05/28/windows-server-2012-r2-change-environment-variables/
 */
// eslint-disable-next-line no-path-concat
module.exports = {
  /**
   * Config axios server
   * https://github.com/axios/axios
   */
  axios: {
    baseURL: process.env.API_HOST + '/' + process.env.API_PREFIX,
    headers: {
      accept: 'text/plain',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    }
  },
  proxyEnable: process.env.API_PROXY,
  proxy: {
    host: process.env.API_PROXY_URL,
    port: process.env.API_PROXY_PORT
  },
  saml: {
    // eslint-disable-next-line no-path-concat
    ipdMetaPath: __dirname + process.env.SAML_IDP_META_PATH,
    // eslint-disable-next-line no-path-concat
    privateKeyPath: __dirname + process.env.SAML_PRIVATE_KEY,
    // eslint-disable-next-line no-path-concat
    spMetaPath: __dirname + process.env.SAML_SP_META_PATH
  },
  timeExpired: 1000 * 60 * 20
}
