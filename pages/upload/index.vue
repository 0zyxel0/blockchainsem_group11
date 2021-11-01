<template>
<div id="upload-page"></div>
</template>
<script>
import {NFTStorage, File} from "nft.storage";
export default {
    data(){
        return{

        }
    },
    methods:{
        uploadImageToStorage({ $config: { nftTokenKey } }){
            const client = new NFTStorage({token:nftTokenKey});
        },
        mintNFTToken(){

        }
    }
}

</script>