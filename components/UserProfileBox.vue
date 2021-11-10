<template>
  <div id="profile-box">
    <v-card max-width="500" tile>
      <v-img
        height="100%"
        src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
      >
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="displayAvatar"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ checkDisplayName }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
  </div>
</template>
<script>
export default {
  props: { displayName: { required: true }, displayAvatar: { required: true }, walletAddr:{ required: true} },
  computed: {
    checkDisplayName:function() {
      return this.displayName || this.walletAddr;
    },
  },
};
</script>
