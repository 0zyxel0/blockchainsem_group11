<template>
  <v-row justify="center">
    <v-col>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" x-large v-bind="attrs" v-on="on" block>
            Change Display Name
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h6">Change Display Name</span>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-card-subtitle>
                    <span v-if="currentDisplayName"
                      >Current Name : {{ currentDisplayName }}</span
                    >
                    <span v-else>Current : {{ currentWalletDisplayName }}</span>
                  </v-card-subtitle>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Display Name*"
                    required
                    v-model="displayName"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialog = false"> Close </v-btn>
            <v-btn color="success" @click="updateDisplayName()"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    dialog: false,
    displayName: "",
  }),
  computed: {
    ...mapState({
      currentDisplayName: (state) => state.modules.profile.user.sub.displayName,
      currentWalletDisplayName: (state) =>
        state.modules.profile.user.sub.walletAddr,
      userToken: (state) => state.modules.profile.token,
    }),
  },
  mounted() {},
  methods: {
    async updateDisplayName() {
      try {
        let app = this;
        let myResult = await this.$axios.$put(
          "/api/v1/user/changename",
          { displayName: this.displayName },
          {
            headers: {
              Authorization: `Bearer ${app.userToken}`,
            },
          }
        );
        if (myResult) {
          this.$toast.success("Successfully Updated Display Name");
          this.dialog = false;
          this.$store.dispatch("modules/profile/UPDATE_DISPLAY_NAME", {
            displayName: myResult.payload.displayName,
          });
        }
      } catch (err) {
        console.log(err);
        this.dialog = false;
      }
    },
  },
};
</script>
