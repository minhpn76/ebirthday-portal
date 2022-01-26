export default function({ store, route, redirect }) {
  if (
    store.state.authRole.reporting_Manager === false &&
    store.state.authRole.staff_Benefits === false
  ) {
    return redirect('/message/send')
  }
}
