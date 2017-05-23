<template>
  <div>
         <v-header :seller="seller"></v-header>
         <div class="tab" border-1px>
             <div class="tab-item">
                  <router-link :to="{path:'/goods'}">
                      商品
                  </router-link>
             </div> 
             <div class="tab-item">
                  <router-link :to="{path:'/ratings'}">
                      评论
                  </router-link>
             </div> 
             <div class="tab-item">
                  <router-link :to="{path:'/seller'}">
                      商家
                  </router-link>
             </div> 
         </div>
         <router-view :seller="seller"></router-view>
  </div>
</template>
<script>
import header from './components/header/header'
const ERR_OK = 0;
export default {
  data () {
     return {
       seller:[],
       pho:[]
     }
  },
  mounted(){
    this.$nextTick(()=>{
        this.$http.get('/api/seller').then((response)=>{
            var jsons=response.body.data;
            var pho=jsons.name;
            // console.log(jsons);
            // console.log(pho);
            // console.log(123)
             this.seller=jsons
            // if(jsons.erron===ERR_OK){
            //   var jsons=response.body.data;
            //     this.seller=jsons;
            // }
        }).then((res)=>{
           console.log(res);
        })  
    })
  },
  components:{
    "v-header":header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "./common/stylus/mixin.styl";
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(1, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
