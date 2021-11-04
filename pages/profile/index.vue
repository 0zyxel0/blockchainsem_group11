<template>
    <div id="userProfile">
        <h1>Profile Page</h1>            
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