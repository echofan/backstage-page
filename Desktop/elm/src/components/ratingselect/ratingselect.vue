<template>
    <div class="ratingselect">
        <div class="rating-type" border-1px>
            <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.username}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.posttive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent($event)" class="switch"  :class="{'on':onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看内容部分</span>
        </div>
    </div>
</template>

<script>
// const posttive=0;
// const negative=1;
const all=2;
     export default{
        props:{
          ratings:{
              type:Array,
              default() {   
                  return [];
              }
          },
          selectType:{
              type:Number,
              default:all
          },
          onlyContent:{
              type:Boolean,
              default:false
          },
          desc:{
              type:Object,
              default() {
                  return {
                      all: '全部',
                      posttive:'满意',
                      negative:"不满意"
                  } 
              }
          }   
        },
        computed:{
            positives() {
                return this.ratings.filter((rating)=>{
                    return rating.rateType===positive;
                })
            },
            negatives() {
                return this.ratings.filter((rating)=>{
                    return rating.rateType===negative;
                })
            }
        },
        methods:{
             select(type,event){
                 if(!event._constructed){
                     return
                 }
                 this.selectType=type;
                 this.$emit("ratingtype.select",type);       //通过$dispatch  想父组件传递这个方法
             },
             toggleContent(event){
                  if(!event._constructed){
                     return
                 }
                 console.log(123)
                 this.onlyContent=!this.onlyContent;
                 this.$emit("content.toggle",this.onlyContent); 
             }
        }


     }
</script> 

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
    .ratingselect
      .rating-type
        padding:18px 0
        margin:0 18px
        border-1px(rgba(7,17,27,0.1))
        font-size:0
        .block
          display:inline-block
          padding:8px 12px
          border-radius:2px
          font-size:12px
          margin-right:8px
          color:rgb(77,85,93)
          .count
            fpnt-size:8px
          &.positive
            background: rgba(0, 160, 220, 0.2)
            &.active
              background: rgb(0, 160, 220)
          &.negative
            background: rgba(77, 85, 93, 0.2)
            &.active
              background: rgb(77, 85, 93)
              color:#fff
      .switch
        padding:12px 18px
        line-height:24px
        border-bottom:1px solid rgba(7,17,27,0.1)
        color:rgb(147,153,150)
        font-size:0
        &.on
         color:#00a0dc
        .icon-check_circle
         display:inline-block
         vertical-align:top
         argin-right:4px
         font-size:24px
        .text           
          font-size:12px
          color:rgb(147,153,159)
</style>