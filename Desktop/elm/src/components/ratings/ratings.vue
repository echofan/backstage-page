<template>
    <div class="ratings" >
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <div class="score">{{seller.score}}</div>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达事件</span>
                        <span class="delivery">{{seller.delivery}}分钟</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect'
import star from '../star/star'
    export default{
        props:{
          seller:{
              type:Object
          }      
        },
        components:{
           star,split,ratingselect
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .ratings
    position:absolute
    top:174px
    bottom:0
    left:0
    width:100%
    overflow:hidden
    .overview
      display:flex
      padding:18px 0
      .overview-left
        flex:0 0 137px
        padding:6px 0
        width:137px
        border-right:1px solid rgba(7,17,27.0.1)
        text-align:center 
        @media only screen and (max-width:320px)
          flex:0 0 120px
          width:120px
        .score
          margin-bottom:6px
          line-height:28px
          font-size:24px
          color:rbg(255,153,0)
        .title
          margin-bottom:8px
          line-height:12px
          font-size:12px
          color:rgb(7,17,27)
        .rank
          line-height:10px
          font-size:10px
          color:rgb(147,153,159)
      .overview-right
        flex:1
        padding:6px 0 6px 24px
        

</style>