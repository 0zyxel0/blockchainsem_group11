<template>
  <div id="nftMeta">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>Auction NFT Details</h1></v-col>
    </v-row>
    <v-row v-if="dataReady">
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-img
                  max-height="400"
                  max-width="800"
                  contain
                  :src="curNFTMeta.nftUri"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Details</v-card-title>

              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Title</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTAuctionedData.title }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Description</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{
                      curNFTAuctionedData.description
                    }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Likes</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTMeta.likes }}</v-subheader>
                  </v-col>
                  <v-divider></v-divider>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="8">
        <v-row
          ><v-col>
            <v-card>
              <v-card-title>NFT Auction Details</v-card-title>

              <v-divider></v-divider>
              <v-card-text v-if="curNFTAuctionedData">
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Current Bid</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      label="Amount"
                      outlined
                      disabled
                      :value="convertWeiToETH(curNFTAuctionedData.highestBid)"
                      suffix="ETH"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Bid Count</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      outlined
                      disabled
                      :value="curNFTAuctionedData.bidCount"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="4">
                    <v-subheader>Start Price</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      outlined
                      disabled
                      :value="convertWeiToETH(curNFTAuctionedData.startPrice)"
                      suffix="ETH"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Auction End</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      disabled
                      :value="
                        convertToReadableTime(
                          curNFTAuctionedData.auctionEndTime
                        )
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      block
                      color="error"
                      v-if="checkForClaiming(curNFTAuctionedData)"
                      @click="claimNFTBack(curNFTAuctionedData)"
                    >
                      Claim NFT Back</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-card-title>
                  <v-row>
                    <v-col>Comments</v-col>
                    <v-spacer></v-spacer>
                    <v-col align="right">
                      <v-dialog v-model="dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="primary" dark v-bind="attrs" v-on="on">
                            Add Comments
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="text-h5">Comments</span>
                          </v-card-title>
                          <v-card-text>
                            <v-divider> </v-divider>
                            <v-container>
                              <v-row>
                                <v-col>
                                  <v-textarea
                                    outlined
                                    no-resize
                                    v-model="commentVal"
                                    hint="Add Comments Here"
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog = false"
                            >
                              Close
                            </v-btn>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="addNFTComments()"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog></v-col
                    >
                  </v-row>
                </v-card-title>
                <v-divider></v-divider>
                <CommentBox
                  v-for="item in curNFTMeta.comments"
                  :key="item._id"
                  :username="item.by"
                  :comment="item.comment"
                  :timestamp="item.timestamp"
                ></CommentBox>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-dialog v-model="claimDialogLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          <h3>Processing NFT Claim</h3>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
const hexConverter = require("hex2dec");
import { ethers } from "ethers";
const _ = require("lodash");
import moment from "moment";
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import CommentBox from "@/components/CommentBoxComponent";
const provider = new ethers.providers.Web3Provider(window.ethereum);
export default {
  layout: "default",
  middleware: "checkWalletAddress",
  components: {
    NavigationBar: NavigationBar,
    CommentBox: CommentBox,
  },
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      curNFTMeta: (state) => state.modules.profile.curNFTMeta,
      curNFTAuctionedData: (state) => state.modules.profile.curNFTAuctionedData,
    }),
  },
  mounted() {
    this.clearMetadata();
  },
  created() {
    this.initializeData();
  },

  data() {
    return {
      claimDialogLoading: false,
      commentVal: "",
      dialog: false,
      dataReady: false,
      isLoading: false,
      offerPrice: 0,
      startOfferTime: 0,
      items: [
        { timeslot: "1 HR", timeVal: 3600 },
        { timeslot: "2 HRS", timeVal: 7200 },
        { timeslot: "5 HRS", timeVal: 18000 },
        { timeslot: "10 HRS", timeVal: 36000 },
        { timeslot: "12 HRS", timeVal: 43200 },
        { timeslot: "24 HRS", timeVal: 86400 },
      ],
    };
  },
  methods: {
    claimNFTBack(payload) {
      this.claimDialogLoading = true;
      console.log("My Audition");
      console.log(payload);
      this.$store
        .dispatch("modules/profile/CLAIM_WINNING_AUCTIONED_NFT", {
          auctionid: payload.auctionid,
        })
        .then((response) => {
          this.claimDialogLoading = false;
          console.log(response);
          this.$router.push("/profile");
        });
    },
    checkForClaiming(payload) {
      let dateEnd = new Date(payload.auctionEndTime * 1000);
      let endTime = moment(String(dateEnd)).format("YYYY-MM-DD HH:mm:ss");
      let current = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let checkDates = moment(current).isAfter(endTime);

      console.log("Current Moment");
      console.log(current);
      console.log("End Time");
      console.log(endTime);
      console.log(checkDates);
      return checkDates;
      // if ( > payload.auctionEndTime) {
      //   console.log(payload);
      //   console.log(moment.now());
      //   return true;
      // }
    },
    deHex(payload) {
      return hexConverter.hexToDec(payload);
    },
    convertWeiToETH(payload) {
      return ethers.utils.formatEther(payload);
    },
    convertToReadableTime(payload) {
      let date = new Date(payload * 1000);
      return moment(String(date)).format("YYYY-MM-DD HH:mm:ss");
    },
    clearMetadata() {
      this.$store.dispatch("modules/profile/CLEAR_CURRENT_NFT_META");
    },
    initializeData() {
      try {
        console.log(this.$route.params.id);

        this.$store
          .dispatch("modules/profile/GET_USER_AUCTIONED_DETAILS", {
            tokenid: this.$route.params.id,
          })
          .then((response) => {
            console.log("Chain Response");
            console.log();
            this.$store
              .dispatch("modules/profile/GET_NFT_METADATA", response.tokenid)
              .then(() => {
                if (this.curNFTMeta) {
                  this.dataReady = true;
                }
              });
          });

        // this.$store
        //   .dispatch("modules/profile/GET_USER_AUCTIONED_DETAILS")
        //   .then((response) => {
        //     this.dataReady = true;

        //     console.log(response);
        //     let payload = hexConverter.hexToDec(response.tokenid);
        //     this.$store
        //       .dispatch("modules/profile/GET_NFT_METADATA", payload)
        //       .then(() => {
        //         if (this.curNFTMeta) {
        //           this.dataReady = true;
        //         }
        //       });
        //   });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
