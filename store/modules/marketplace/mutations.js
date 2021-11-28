export default {
    SET_AUCTION_HOUSE_BIDDING_NFT(state, payload) {
        state.biddingNFTAction = payload;
    },
    SET_AVAILABLE_NFT_LISTS(state, payload) {
        state.availableNFTItems = payload;
    },  
}