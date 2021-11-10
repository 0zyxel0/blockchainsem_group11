export default {
    SET_USER_WALLETADDRESS(state, payload) {
        state.userWalletAddress = payload;
    },
    CLEAR_USER_WALLETADDRESS(state){
        state.userWalletAddress = null;
    },
    SET_USER_DATA(state, payload){
        state.user = payload;
    }
}