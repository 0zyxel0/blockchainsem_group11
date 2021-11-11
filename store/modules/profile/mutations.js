export default {
    SET_USER_WALLETADDRESS(state, payload) {
        state.userWalletAddress = payload;
    },
    CLEAR_USER_WALLETADDRESS(state) {
        state.userWalletAddress = null;
    },
    SET_USER_DATA(state, payload) {
        state.user = payload;
    },
    SET_USER_DISPLAY_NAME(state, payload) {
        state.user.sub.displayName = payload;
    },
    SET_USER_TOKEN(state, payload) {
        state.token = payload;
    },
    SET_USER_NFT(state, payload) {
        state.userNFT = payload;
    },
    SET_USER_NFT_UNMINTED(state, payload) {
        state.userNFTUnminted = payload;
    },

}