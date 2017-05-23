<template>
 <div class="goods">
     <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                    <span class="text" border-1px>
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
     </div>
     <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                      <!--传入到food组件的数据-->
                        <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" class="food-item" border-1px>
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
         
     </div> 
     <!-- v-ref:shopcart 获取子组件的方法 -->
        <shopcart ref='shopcart' :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
   <food :food="selectedFood" ref="food"></food>
 </div>
     
</template>

<script>
    import BScroll from 'better-scroll'   //引入滚动插件
    import shopcart from '../shopcart/shopcart.vue'
    import cartcontrol from '../cartcontrol/cartcontrol.vue'
    import food from '../food/food.vue'
    export default{
        data () {
            return {
                goods:[],
                listHeight:[],  //监听每个区间的高度
                scrollY:0,
                selectedFood:{}
            }
        },
         props:{
           seller:{
              type:Object
           }     
         },
         computed:{
            currentIndex() {
                for(let i=0;i<this.listHeight.length;i++){
                     let height1=this.listHeight[i];
                     let height2=this.listHeight[i+1];
                     //如果滚动到不是区域2 并且是超过区域一不超过区域2的时候返回当前
                     if(!height2 || this.scrollY>=height1&&this.scrollY<height2){
                            return i;  
                     }
                }
                return 0;
            },
            //产品数量的同步
            selectFoods() {
                let foods=[];
                this.goods.forEach((good)=>{       //遍历数据中的goods
                     good.foods.forEach((food)=>{  //遍历这个页面的food
                            if(food.count){
                                foods.push(food);  
                            }
                     })    
                });
                return foods;
            }
         },
         created() {
             this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
             this.$http.get('/api/goods').then((res)=>{
                  res=res.body.data;
                  this.goods=res;
                  this.$nextTick(()=>{
                       this._initScroll();
                       this._calculateHeight();  
                  })
                
             }) 
         },
         methods:{

             //点击左侧的列表
               selectMenu(index,$event) {
                  //pc页面点击的时候click事件会触发两次，不会被better-scroll组织事件，初始化，给better-scroll派发事件
                  //在点击的时候传入$event变量，better-scroll插件中的event事件个原生js的event有属性上的区别
                  //better-scroll插件派发的事件event_constructed为true，原生点击时间是没有这个属性的
                  if(!event._constructed){
                       return
                  }  
                    let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                    let el=foodList[index];
                     this.foodsScroll.scrollToElement(el, 300);
               },
             selectFood(food,$event) {
                 if(!event._constructed){
                      return
                 }
                 this.selectedFood=food;
                 console.log(this.selectedFood+'-------------')
                 this.$refs.food.show();

             },

               //上下滚动
             _initScroll () {
                  this.menuScroll=new BScroll(this.$refs.menuWrapper,{
                        click:true
                  });     //接收两个参数第一个dom对象  json对象
                  this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
                      click:true,
                      probeType:3                 //scroll在滚动的时候能够实时监听滚动的位置
                  });
                  this.foodsScroll.on('scroll',(pos)=>{
                        this.scrollY=Math.abs(Math.round(pos.y));

                  })
             },
             //获取区块的高度
             _calculateHeight() {
                   let foodList=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook"); 
                   let height=0;
                   this.listHeight.push(height);//默认把第一个高度加上去
                   for(let i=0;i<foodList.length;i++){   //循环每一个高度
                        let item=foodList[i];
                        height+=item.clientHeight;
                        this.listHeight.push(height);
                   }
             },
             _drop(target){
                  //访问子组件的方法
                  this.$nextTick(()=>{
                    this.$refs.shopcart.drop(target);
                  })

             }
         },
         components:{
              shopcart,
              cartcontrol,
              food
         },
         events:{
             //下落的动画
              'cart.add'(target){
                   this._drop(target)
              }
         }

    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl";
    .goods
      display:flex
      position:absolute
      width:100%
      top:178px
      bottom:46px
      overflow:hidden
      .menu-wrapper
        flex:0 0 80px
        width:80px
        background:#f3f5f7
        .menu-item
          display:table 
          padding:0 12px      
          height:50px
          width:56px
          line-height:14px
          &.current
           position: relative
           z-index: 10
           margin-top: -1px
           background: #fff
           font-weight: 700
           .text
            border-none()
          .icon
            display: inline-block
            vertical-align:top
            width: 12px
            height: 12px
            margin-right:2px
            background-size:12px 12px
            background-repeat:no-repeat
            &.decrease
               bg-image('decrease_3')
            &.discount
               bg-image('discount_3')
            &.guarantee
               bg-image('guarantee_3')
            &.invoice
               bg-image('invoice_3')
            &.special
               bg-image('special_3') 
          .text
              display:table-cell
              width:56px
              vertical-align:middle
              font-size:12px
              border-1px(rgba(7,17,27.0.1))      
      .foods-wrapper
        flex:1 
        .title
         padding-left:14px
         height:26px
         line-height:26px
         border-left:2px solid #d9dde1
         font-size:13px
         color:rgb(147,153,159)
         background:#f3f5f7
        .food-item
          display:flex
          margin:18px
          padding-bottom:18px
          border-1px(rgba(7,17,27.0.1))
          &.last-child
            border-none()
            margin-bottom:0
          .icon
            flex:0 0 57px
            margin-right:10px
          .content
            flex:1
            .name
              margin:2px 0 8px 0
              height:14px
              line-height:14px
              font-size:14px
              color:rgb(7,17,27)
             .desc, .extra
               line-height:10px
               font-size:10px
               color:rgb(147,153,159)
             .desc
               margin-bottom:8px
               line-height:12px
             .extra
               .count
                 margin-right:8px
             .price
               font-weight:700
               line-height:24px
               .now
                  margin-right:8px
                  font-size:14px
                  color:rgb(240,20,20)
               .old
                  text-decoration:line-through
                  font-size:10px
                  color:rgb(147,153,159)
              .cartcontrol-wrapper
                position:absolute
                right:0
                bottom:12px     
 


</style>    