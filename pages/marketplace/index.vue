<template>
  <div id="marketPlace">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>Auction House</h1></v-col>
    </v-row>
    <v-divider> </v-divider>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Bid now
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col
                row
                wrap
                v-for="(n, index) in biddingNFTAction"
                :key="index"
              >
                <AuctionItemComponent
                  v-if="getItemisEnded(n.auctionEndTime.toString())"
                  :key="n.auctionId.toString()"
                  :auctionTitle="n.nft.title"
                  :highestBidder="n.highestBidder"
                  :highestBid="n.highestBid.toString()"
                  :startPrice="n.startPrice.toString()"
                  :winner="n.winner.toString()"
                  :bids="n.bids.toString()"
                  :ended="!n.ended"
                  :auctionEndTime="n.auctionEndTime.toString()"
                  :tokenID="n.nft.tokenId"
                  :buyBidPrice="n.buyNow.toString()"
                  :tokenUri="n.nft.tokenUri"
                >
                  <template v-slot:asset-options>
                    <v-row
                      class="pa-md-4 mx-lg-auto"
                      align="center"
                      justify="center"
                    >
                      <v-col cols="6">
                        <BiddingComponents
                          block
                          :startPrice="n.startPrice.toString()"
                          :auctionId="n.auctionId.toString()"
                          :highestBid="n.highestBid.toString()"
                          :callbackgetAuction="getAuction"
                        >
                        </BiddingComponents>
                      </v-col>
                      <v-col cols="6">
                        <BuyConfirmationDialog
                          :auctionId="n.auctionId.toString()"
                          :buyBidPrice="n.buyNow.toString()"
                          :callbackgetAuction="getAuction"
                        >
                        </BuyConfirmationDialog>
                      </v-col>
                    </v-row>
                  </template>
                </AuctionItemComponent>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Bidding expried
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col
                row
                wrap
                v-for="(n, index) in biddingNFTEnded"
                :key="index"
              >
                <AuctionItemComponent
                  v-if="!getItemisEnded(n.auctionEndTime.toString())"
                  :key="n.auctionId.toString()"
                  :auctionTitle="n.nft.title"
                  :highestBidder="n.highestBidder"
                  :highestBid="n.highestBid.toString()"
                  :startPrice="n.startPrice.toString()"
                  :winner="n.winner.toString()"
                  :bids="n.bids.toString()"
                  :ended="n.ended"
                  :auctionEndTime="n.auctionEndTime.toString()"
                  :tokenID="n.nft.tokenId"
                  :buyBidPrice="n.buyNow.toString()"
                  :tokenUri="n.nft.tokenUri"
                >
                  <template v-slot:asset-options>
                    <v-row>
                      <v-col></v-col>
                    </v-row>
                  </template>
                </AuctionItemComponent>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Recent Minted NFTs<v-spacer></v-spacer>
            <v-btn color="primary" @click="goToAllNFT()"
              >See All</v-btn
            ></v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="availableNFTItems">
              <ItemBox
                v-for="n in availableNFTItems"
                :key="n._id"
                :assetTitle="n.title"
                :assetDesc="n.description"
                :imageUri="n.tokenUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col>
                      <v-btn
                        @click="goToAssetProfile(n.tokenid)"
                        color="primary"
                        block
                      >
                        View
                      </v-btn>
                    </v-col>                 
                  </v-row>
                </template>
              </ItemBox>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import ItemBox from "@/components/AssetBoxComponent";
import AssetBoxComponent from "@/components/AuctionItemComponent";
import BiddingComponents from "@/components/BiddingComponents";
import BuyConfirmationDialog from "@/components/BuyConfirmationDialog";

const NFTAUCTION_CONTRACT_ABI = require("./../../build/contracts/NFTAuction.json");
const provider = new ethers.providers.Web3Provider(window.ethereum);

export default {
  layout: "default",
  middleware: "checkWalletAddress",
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
    BiddingComponents: BiddingComponents,
    ItemBox: ItemBox,
    BuyConfirmationDialog: BuyConfirmationDialog,
  },
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      availableNFTItems: (state) => state.modules.marketplace.availableNFTItems,
    }),
    biddingNFTAction() {
      return this.biddingNFT;
    },
    latestBlock() {
      return this.curBlockCount;
    },
  },
  mounted() {
    this.getBlockCount();
    this.getAuction();
    this.getAvailableNFTs();
  },

  data() {
    return {
      curBlockCount: 0,
      biddingNFT: [],
      biddingNFTEnded: [],
    };
  },
  methods: {
    async getBlockCount() {
      let currentBlock = await provider.getBlockNumber();
      if (currentBlock) {
        this.curBlockCount = currentBlock;
      }
    },
    async getAuction() {
      try {
        let contract = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
        let myResult = await contract.getAllAuctions();
        if (myResult) {
          console.log("GET_ALL_AUCTION");
          console.log(myResult);
          this.biddingNFT = this.filterAuctionitem(myResult, false);
          this.biddingNFTEnded = this.filterAuctionitem(myResult, true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    getAvailableNFTs() {
      try {
        this.$store.dispatch("modules/marketplace/RECENT_MARKETPLACE_ITEMS");
      } catch (err) {
        console.log(err);
      }
    },
    goToAssetProfile(payload) {
      this.$router.push(`/marketplace/view/${payload}`);
    },
    likeAsset(tokenid) {
      try {
        this.$store.dispatch("modules/marketplace/LIKE_NFT_ASSET", {
          tokenId: tokenid,
          userToken: this.$nuxt.$store.app.store.state.modules.profile.token,
        }).then(() => {
          this.$toast.success("Successfully Sent Likes on NFT");
        });
      } catch (err) {
        console.log(err);
      }
    },
    getItemisEnded(auctionEndTime) {
      var auctionEnddate = new Date(auctionEndTime * 1000);
      var currentdate = new Date();
      return auctionEnddate > currentdate;
    },
    getItemisEndedLessDay(auctionEndTime) {
      var auctionEnddate = new Date(auctionEndTime * 1000);
      var currentdate = new Date();
      var currentdateLessDay = new Date();
      currentdateLessDay.setDate(currentdate.getDate() - 1);
      return (
        auctionEnddate < currentdate && auctionEnddate > currentdateLessDay
      );
    },
    filterAuctionitem(biddingNFT, ended) {
      let tempList = [];
      if (ended) {
        tempList = biddingNFT.filter((biddingNFT) =>
          this.getItemisEndedLessDay(biddingNFT.auctionEndTime.toString())
        );
      } else {
        tempList = biddingNFT.filter((biddingNFT) =>
          this.getItemisEnded(biddingNFT.auctionEndTime.toString())
        );
      }
      return tempList;
    },
    goToAllNFT(){
      this.$router.push("/marketplace/list");
    }
  },
};
</script>
