<template>
    <div class="shopcart">
          <div class="content" @click="toggleList()">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                        </div>
                        <div class="num" v-show="totalCount>0" :class="{'highlight':totalCount>0}">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass">
                           {{payDesc}}
                    </div>
                </div>
          </div>  
          <div class="ball-container">
                <div v-for="ball in balls" v-show="ball.show" class="ball" transition="drop">
                    <div class="inner inner-hook"></div>
                </div>
          </div>
        <transition name="fade">
          <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods" border-1px>
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price * food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                        </li>
                    </ul>
                </div>
          </div>
        </transition>
    </div>
</template>


<script>
import BScroll from 'better-scroll'   //引入滚动插件
import cartcontrol from '../cartcontrol/cartcontrol.vue'
    export default {
        data () {
            return {
                balls:[
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    }
                ],
                dropBalls:[],
                fold:true
            }
        },
        components:{
              cartcontrol
         },
         props:{
             
             selectFoods:{
                type:Array,
                default(){
                    return []
                }
             },
             deliveryPrice:{
                 type:Number,
                 default:0
             },
             minPrice:{
                 type:Number,
                 default:0 
             } 
         },
         computed:{
             listShow(){
                 if(!this.totalCount){
                     this.fold=true;
                     return false;
                 }
                 let show=!this.fold;
                 if(show){
                      this.$nextTick(()=>{
                          if(!this.scroll){
                               this.scroll=new BScroll(this.$refs.listContent,{
                                click:true
                           })
                        }else{
                           this.scroll.refresh();  
                       }
                    });     
                 }  
                    return show;
             },
             totalPrice() {
                  let total=0;
                  this.selectFoods.forEach((food)=>{
                       total+=food.price*food.count
                  });
                  return total
             },
             totalCount() {
                  let count=0;
                  this.selectFoods.forEach((food)=>{
                      count+=food.count;  
                  });    
                  return count
             },
             payDesc() {
                  console.log(this.minPrice)
                  console.log(this.totalPrice)

                  if(this.totalPrice===0){
                       return `￥${this.minPrice}元起送`;
                      
                  } else if (this.totalPrice < this.minPrice){
                       let kobe=this.minPrice - this.totalPrice;
                       console.log(kobe)
                       return `还差￥${kobe}元起送`;
                  }else{
                       return `去结算`;
                  }
             },
             payClass() {
                  if(this.totalPrice<this.minPrice){
                        return 'not-enough'
                  }else{
                       return 'enough'
                  }
             }
         },
         methods:{
              drap(el){
                    for(let i=0;i<this.balls.length;i++){
                        let ball=this.balls[i];
                        if(!ball.show){
                             ball.show=true;
                             ball.el=el;
                             this.dropBalls.push(ball);
                             return;
                        }
                    }    
              },
              toggleList() {
                  if(!this.totalCount){
                       return;
                  }
                  this.fold=!this.fold;
              }
         },
         transition:{
     drop: {
        beforeEnter(el){
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left - 32;
              let y = -(window.innerHeight - rect.top - 22);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
              el.style.transform = `translate3d(0,${y}px,0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter(el){
          let rf = el.offsetHeight;
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterEnter(el){
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
         }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
    .shopcart
      position:fixed
      left:0
      bottom:0
      z-index:99
      width:100%
      height:48px
      .content
        display:flex
        background:#141d27
        font-size:0
        .content-left
          flex:1
          .logo-wrapper
            display:inline-block
            position:relative
            top:-10px
            margin:0 12px
            padding:6px
            width:56px
            height:56px
            box-sizing:border-box
            vertical-align:top
            border-radius:50%
            background:#141d27
            .num
              position:absolute;
              top:0
              right:0
              wisth:24px
              height:16px
              line-height:16px
              text-align:center
              border-radius:16px
              color:#fff
              font-weight:700
              font-size:9px
              padding:1px 2px;
              background:rgb(240,20,20)
              box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
            .logo
              width:100%
              height:100%
              border-radius:50%
              background:#2b343c
              &.highlight
                background:rgb(0,160,220)
              .icon-shopping_cart
                text-align:center
                line-height:44px
                font-size:24px
                color:#80858a
                margin-left:10px
                &.highlight
                  color:#ffffff
          .price
            display:inline-block
            vertical-align:top
            line-height:24px
            margin-top:12px
            color:rgba(255,255,255,0.4)
            padding-right:12px
            box-sizing:border-box
            font-size:16px
            font-weight:700
            border-right:1px solid rgba(255,255,255,0.1)
            &.highlight
                  color:#fff
          .desc
            display:inline-block
            vertical-align:top
            margin:12px 0 0 12px
            font-weight:500
            line-height:24px
            color:rgba(255,255,255,0.4)
            font-size:10px   
        .content-right
          flex:0 0 105px      
          width:105px
          .pay
            height:48px
            line-height:48px
            text-align:center
            font-size:14px
            color:rgba(255,255,255,0.4)
            &.not-enough
              background:#2b333b
            &.enough
              background:#00b43c
              color:#fff  
     .ball-container
       .ball
         position: fixed
         left: 32px
         bottom: 22px
         z-index: 200
         .inner
           width: 16px
           height: 16px
           border-radius: 50%
           background: rgb(0, 160, 220)
      .shopcart-list
        position:absolute
        bottom:120%
        left:0
        z-index:-1
        width:100%      
        .list-header
         height:40px
         line-height:40px
         padding:0 18px
         background:#f3f5f7  
         border-bottom:1px solid rgba(7,17,27,0.1)
         .title
           float:left
           font-size:14px
           color:rgb(7,17,27)
         .empty
           float:right
           font-size:12px
           color:rgb(0,160,220)
        .list-content
          padding:0 18px
          max-height:217px
          overflow:hidden
          background:#fff
          .food 
            position:relative
            padding:12px 0
            box-sizing:border-box
            border-1px(rgba(7,17,27,0.1))
            .name
              line-height:24px
              font-size:14px
              color:rgb(7,17,27)
            .price
              position:absolute
              right:90px
              bottom:12px
              line-height:24px
              font-weight:700
              font-size:14px
              color:rgb(240,20,20) 
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 6px  


                  




</style>