<template>
  <div id="marketPlace">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>Auction House </h1></v-col>
    </v-row>
    <v-divider> </v-divider>
    <v-row>
      <v-col>
      </v-col>
    </v-row>
        <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Bid now 
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap >
              <AuctionItemComponent>
                <template v-slot:asset-options>
                  <v-row>
                    <v-col
                      ><v-btn
                        color="primary"
                        block
                      >
                        Bid
                      </v-btn></v-col
                    >
                  </v-row>
                </template>
              </AuctionItemComponent>
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
             <v-row row wrap >
              <AuctionItemComponent>
                <template v-slot:asset-options>
                  <v-row>
                    <v-col
                      ></v-col
                    >
                  </v-row>
                </template>
              </AuctionItemComponent>
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
import AssetBoxComponent from "@/components/AuctionItemComponent";
const NFTAUCTION_CONTRACT_ABI = require("./../../build/contracts/NFTAuction.json");
const provider = new ethers.providers.Web3Provider(window.ethereum);
export default {
  layout: "default",
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      biddingNFTAction: (state) =>
        state.modules.marketplace.biddingNFTAction,
    }),

    latestBlock() {
      return this.curBlockCount;
    },
  },
  mounted() {
    this.getBlockCount();
    this.getAuction();
  },
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
  },
  data() {
    return {
      curBlockCount: 0,
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
        provider
      );
      let myResult = await contract.getAllAuctions();
      if (myResult) {
          console.log(myResult)
      }
    } catch (err) {
      console.log(err);
    }
  }
  },
 
};
</script>
