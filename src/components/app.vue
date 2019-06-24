<template>
    <div> 
    	<img src="../assets/img/close.png" alt="">
    luckfine 
    </div>
</template>
<script>
    export default {
        data () {
            return {

            }
        },
        mounted() {
        	document.title='你好' 
        	console.log('345678') 
        	setTimeout(() => {
        		console.log("message");
        	},1000)
        }
    }
</script>
<style type="text/css">
@import '../assets/css/index.css';
body{
	background-image: url('../assets/img/a.jpg') !important;
}
img{
	width: 20px;
	height: 20px;
}
</style>
<style>
@import '../assets/css/base.scss';
</style>