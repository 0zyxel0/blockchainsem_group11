export default {
    SET_AUCTION_HOUSE_BIDDING_NFT(state, payload) {
        state.biddingNFTAction = payload;
    },
    SET_AVAILABLE_NFT_LISTS(state, payload) {
        state.availableNFTItems = payload;
    },
    CLEAR_NFT_DETAILS(state, payload) {
        state.curNFTMeta = {};
    },
    INCREASE_NFT_LIKES(state) {
        state.curNFTMeta.likes = state.curNFTMeta.likes + 1;
    },
    SET_NFT_CUR_META(state, payload) {
        state.curNFTMeta = payload;
    }

}