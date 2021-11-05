<template>
    <div id="marketPlace">
        <h1>Marketplace</h1>            
    <NavigationBar></NavigationBar>
    </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar";
export default {
  layout: "default",
  components: {
    NavigationBarL: NavigationBar,
  },
    
}
</script>