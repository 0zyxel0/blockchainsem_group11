export default function({store, redirect}) {
   if (!store.state.modules.profile.userWalletAddress) {
      return redirect('/')
    }
  }
  