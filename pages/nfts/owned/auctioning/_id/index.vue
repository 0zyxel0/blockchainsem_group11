<template>
  <div id="nftMeta">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>NFT Details</h1></v-col>
    </v-row>
    <v-dialog
      v-model="auctionDialogLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card color="primary" dark>
        <v-card-text>
          <h3>Processing NFT Auction Post</h3>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
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
            </v-card> </v-col
        ></v-row>
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
                    <v-subheader>{{ curNFTMeta.title }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Description</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTMeta.description }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Likes Count</v-subheader>
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
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>NFT Auction Details</v-card-title>

              <v-divider></v-divider>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="4">
                      <v-subheader>Auction Start Price</v-subheader>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="Price"
                        hint="Starting Auction Bidding Price"
                        v-model="offerPrice"
                        :rules="priceRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-subheader>Auction Buy Now Price</v-subheader>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="Price"
                        hint="Buy Now Price Should be Larger than Start Price"
                        :rules="buyNowRules"
                        v-model="buyPrice"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-subheader>Auction End Time</v-subheader>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        :items="items"
                        item-text="timeslot"
                        item-value="timeVal"
                        v-model="startOfferTime"
                        label="Set Auction Length"
                        outlined
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col v-if="isLoading">
                    <v-btn color="primary" block>
                      <v-progress-circular
                        indeterminate
                        color="red"
                      ></v-progress-circular
                    ></v-btn>
                  </v-col>
                  <v-col v-else
                    ><v-btn
                      v-if="validatingPrices()"
                      color="red"
                      block
                      dark
                      @click="showToast()"
                      >Auction Item</v-btn
                    >
                    <v-btn
                      v-else
                      color="red"
                      block
                      dark
                      @click="
                        auctionNFT(
                          curNFTMeta.tokenid,
                          offerPrice,
                          buyPrice,
                          startOfferTime
                        )
                      "
                      >Auction Item</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
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
  </div>
</template>
<script>
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import CommentBox from "@/components/CommentBoxComponent";
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
      priceRules: [
        (v) => !v || v != 0 || "Start Price Should Be Larger Than 0",
      ],
      buyNowRules: [
        (v) =>
          !parseFloat(v) ||
          parseFloat(v) > this.offerPrice ||
          `Buy Now Price Should Be Larger Than ${this.offerPrice}`,
      ],
      auctionDialogLoading: false,
      myPriceCheck: false,
      valid: true,
      dialog: false,
      commentVal: "",
      dataReady: false,
      isLoading: false,
      offerPrice: 0,
      buyPrice: 0,
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
    showToast() {
      this.$toast.error("Please Check Start Price and Buy Now Price.");
    },
    validatingPrices() {
      if (parseFloat(this.buyPrice) > parseFloat(this.offerPrice)) {
        return false;
      } else {
        return true;
      }
    },
    clearMetadata() {
      this.$store.dispatch("modules/profile/CLEAR_CURRENT_NFT_META");
    },
    auctionNFT(nftId, offerPrice, buyPrice, bidDuration) {
      try {
        this.auctionDialogLoading = true;
        this.isLoading = true;
        let payload = {
          nftId: nftId,
          startPrice: offerPrice,
          buyNowPrice: buyPrice,
          bidDuration: bidDuration,
        };
        // Approve the Contract to Auction the Tokenid or NFT
        this.$store
          .dispatch("modules/profile/APPROVE_NFT_FOR_CONTRACT", {
            tokenId: nftId,
          })
          .then((response) => {
            console.log("Token Approval Successful")
            console.log(response);
            this.$store
              .dispatch("modules/profile/CREATE_USER_AUCTION_NFT", payload)
              .then((response) => {
                this.auctionDialogLoading = false;
                this.isLoading = false;
                this.$router.push("/profile");
              });
          });
      } catch (err) {
        console.log(err);
      }
    },
    initializeData() {
      try {
        let payload = this.$route.params.id;
        this.$store
          .dispatch("modules/profile/GET_NFT_METADATA", payload)
          .then((response) => {
            if (this.curNFTMeta) {
              this.dataReady = true;
            }
          });
      } catch (err) {
        console.log(err);
      }
    },
    addNFTComments() {
      let payload = {
        tokenid: this.$route.params.id,
        userToken: this.$nuxt.$store.app.store.state.modules.profile.token,
        comments: this.commentVal,
      };

      this.$store
        .dispatch("modules/marketplace/ADD_NFT_COMMENTS", payload)
        .then(() => {
          this.dialog = false;
          this.initializeData();
          this.$toast.success("Successfully Added Comment");
        });
    },
  },
};
</script>
