export default {
  SET_USER_WALLETADDRESS(state, payload) {
    state.userWalletAddress = payload;
  },
  CLEAR_USER_WALLETADDRESS(state) {
    state.userWalletAddress = null;
    state.user = null;
    state.token = null;
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
  SET_USER_UNMINTED_NFT(state, payload) {
    state.userNFTUnminted = payload;
  },
  SET_USER_RECENT_UNMINTED_NFT(state, payload) {
    state.userRecentUnminted = payload;
  },
  SET_USER_RECENT_MINTED_NFT(state, payload) {
    state.userRecentMinted = payload;
  },
  SET_USER_MINTED_NFT(state, payload) {
    state.userNFTMinted = payload;
  },
  SET_NFT_DETAILS(state, payload) {
    state.nftDetails = payload;
  },
  CLEAR_NFT_DETAILS(state, payload) {
    state.nftDetails = {};
    state.curNFTMeta = {};
  },
  SET_USER_OWNED_NFT(state, payload) {
    state.userOwnedNFT = payload;
  },
  SET_NFT_CUR_META(state, payload) {
    state.curNFTMeta = payload;
  },
  SET_USER_UNMINTED_ITEMS(state, payload) {
    state.unmintedItems = payload;
  },
  SET_USER_AUCTIONED_NFT(state, payload) {
    state.userNFTInAuction = payload;
  },
  SET_USER_WON_AUCTION(state, payload) {
    state.userNFTWonAutction = payload;
  },
};
