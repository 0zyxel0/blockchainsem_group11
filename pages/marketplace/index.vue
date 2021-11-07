<template>
    <div id="marketPlace">
        <h1>Marketplace</h1>            
    <NavigationBar></NavigationBar>
    <v-row>
      <AssetBoxComponent></AssetBoxComponent>
    </v-row>
    </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar";
import AssetBoxComponent from "@/components/AssetBoxComponent";
export default {
  layout: "default",
  components: {
    NavigationBarL: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
  },
    
}
</script>