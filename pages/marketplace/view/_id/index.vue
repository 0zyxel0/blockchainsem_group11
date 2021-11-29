<template>
  <div id="marketplace-nft">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>NFT Details</h1></v-col>
    </v-row>
    <v-row v-if="dataReady">
      <v-col cols="4">
        <v-row
          ><v-col>
            <v-card>
              <v-card-text>
                <v-img
                  max-height="400"
                  max-width="800"
                  contain
                  :src="curNFTMeta.nftUri"
                />
                <v-card-actions>
                  <v-btn
                    color="pink lighten-1"
                    block
                    dark
                    @click="likeNFT(curNFTMeta.tokenid)"
                  >
                    <v-icon class="pr-5">mdi-thumb-up</v-icon> Like
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col></v-row
        >
      </v-col>
      <v-col cols="8">
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
      curNFTMeta: (state) => state.modules.marketplace.curNFTMeta,
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
      dialog: false,
      commentVal: "",
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
    clearMetadata() {
      this.$store.dispatch("modules/marketplace/CLEAR_CURRENT_NFT_META");
    },
    initializeData() {
      try {
        let payload = {
          tokenid: this.$route.params.id,
          userToken: this.$nuxt.$store.app.store.state.modules.profile.token,
        };
        this.$store
          .dispatch("modules/marketplace/GET_NFT_METADATA", payload)
          .then((response) => {
            if (this.curNFTMeta) {
              this.dataReady = true;
            }
          });
      } catch (err) {
        console.log(err);
      }
    },
    likeNFT() {
      let payload = {
        tokenid: this.$route.params.id,
        userToken: this.$nuxt.$store.app.store.state.modules.profile.token,
      };
      this.$store.dispatch("modules/marketplace/LIKE_NFT_ASSET", payload).then(() => {
        this.$toast.success("Successfully Sent Likes to NFT");
      });
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
          this.$toast.success("Successfully Added Comment");
        });
    },
  },
};
</script>
