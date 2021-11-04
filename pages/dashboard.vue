<template>
    <div id="dashboardPage">
        
        <h1>Dashboard</h1>
<NavigationBar></NavigationBar>
    </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar";
export default {
    layout:"default",
    components:{
        NavigationBarL:NavigationBar,
    }
}
</script>