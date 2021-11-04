export default {
  async GET_USER_WALLETADDRESS({ commit }) {
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        console.error(err.message);
        return;
      });
    if (!accounts) {
      console.log("No Accounts Found");
      return;
    }
    console.log("Accounts: " + accounts[0]);
    commit("SET_USER_WALLETADDRESS", accounts[0]);
    this.$router.push('/dashboard');
  },
  SIGNOUT_USER_WALLETADDRESS({ commit }) {
    window.userWalletAddress = null;

  }
};
