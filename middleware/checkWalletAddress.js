export default function({store, redirect}) {
   if (!store.state.modules.profile.token) {
      return redirect('/')
    }
  }
  