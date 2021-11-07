<template>
  <div id="userProfile">
    <h1>Profile Page</h1>
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-btn @click="goToUploader()">Create NFT</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar";
export default {
  layout: "default",
  components: {
    NavigationBarL: NavigationBar,
  },
  methods: {
    goToUploader(){
     this.$router.push('/upload');
    }
  }
};
</script>
