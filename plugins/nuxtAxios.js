export default function({ $axios, app, store }) {
  $axios.onRequest(config => {
    if (store.state.authToken) {
      config.headers.common.Authorization = `Bearer ${store.state.authToken}`
    }
  })
}
