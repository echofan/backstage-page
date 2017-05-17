/*
* @Author: lifan
* @Date:   2016-11-10 16:20:37
* @Last Modified by:   lifan
* @Last Modified time: 2016-11-11 00:56:33
*/
function init(){
	var oli=document.getElementsByTagName("li"),
         reset=document.querySelector(".reset"),
         btn=document.querySelector(".btn"),
         odl=document.querySelectorAll(".dl"),
         Let=10,H=20,first=3,second=5,
         third=8,cf=cs=ct=0,timer=null,str="";
         // document.getElementById("audio1").play();
        for (var i = 0; i < odl.length; i++) {
            var html=odl[i].innerHTML;
                odl[i].innerHTML="";
                ck=stradd(html,2);
                odl[i].innerHTML=ck;
         }; 
        function stradd(str,size){
            if(Object.prototype.toString.call(str)
                =="[object String]"){
                for (var i = 0; i < size; i++) {
                    str+=str;
                }; 
            }else{
                return "数据类型错误";
            }
             return str;
        }
        function getStyle(obj,name){
           return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
        }
        function starmove(obj,json,funEnd){
            clearInterval(obj.timer);
            var Bstop=true;
           obj.timer=setInterval(function(){
                for(var attr in json){
                   var speed=0;
                   if(attr=="opacity"){
                       var cur=Math.round(parseFloat(getStyle(obj,attr)*100));
                   }else{
                       var cur=parseInt(getStyle(obj,attr));
                   }
                   speed=(json[attr]-cur)/20;
                   speed=speed>0?Math.ceil(speed):Math.floor(speed); 
                   if(cur!=json[attr]){
                        Bstop=false;
                   }else{
                        Bstop=true;
                   }

                   if(attr=="opacity"){
                       obj.style.opacity=(cur+speed)/100;
                   }else{
                       obj.style[attr]=cur+speed+"px";
                   }
                }
              
                if(Bstop){
                      clearInterval(obj.timer);
                      if(funEnd)funEnd();
                }
            },30)
         }
         function run(){
            for (var i = 0; i < oli.length; i++) {
                oli[i].value=Math.floor(Math.random()*10);
            var Num=parseInt(oli[i].value),
                odl=oli[i].getElementsByTagName("dl")[0],
                odd=odl.getElementsByTagName("dd"),
                size=odd.length,
                height=odl.offsetHeight,
                tops=odd[Num+(size-Let)].offsetTop;
                odl.style.top=0;
                str+=Num; 
               starmove(odl,{"top":-(tops)},function(){
                     var Result=parseInt(str);
                      console.log(Result);
                      // reset.innerText="";
                        // if(Result<97000){
                        //    reset.innerText="上公交，一定记得买票！！";
                        // }else if(Result>97000&&Result<98000){
                        //   ct++;
                        //   if(ct>third){
                        //     reset.innerText="上公交，一定记得买票！！";
                        //   }
                        //   reset.innerText="恭喜获得了3等奖";
                        // }else if(Result>98000&&Result<99500){
                        //   cs++;
                        //   if(cs>second){
                        //     reset.innerText="上公交，一定记得买票！！";
                        //   }
                        //   reset.innerText="恭喜获得了2等奖";
                        // }else{
                        //   cf++;
                        //   if(cf>first){
                        //     reset.innerText="上公交，一定记得买票！！";
                        //   }
                        //   reset.innerText="恭喜获得了1等奖"; 
                        // }
                        // reset.style.display="block";
                        // btn.className="btn";
                        // 
                });


           };
    
         }

             $(".delete").on("click",function(res){
             	   // $(this).parent().hide();  
             	   $(".pho").hide();
             	
             });
          //跳转到规则页面
          $(".one").click(function(){
                  window.location.href="guize.html";
          });
          $(".three").click(function(){
                     var phone=$("#phone").val();
                  phone = phone.replace(/(^\s+)|(\s+$)/g,'');
                  var isonKd=
                  	    {"id":54321,"jsonrpc":"2.0","method":"Activity.JoinActivity","params":{"activityname":"getwinner","userid":phone}}
                 
                $.ajax({
                    url:"http://test.app.api.gupiaoxianji.com/server/",  //接口地址
                    type:"POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(isonKd),
                    success:function(res){
                           console.log(res);  
                           }  
                });



          });

         btn.onclick=function(){
         	
           var phone=$("#phone").val();
                  phone = phone.replace(/(^\s+)|(\s+$)/g,'');
                     console.log(phone);
                        判断手机号是否正确
                        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;                  
                          if(!myreg.test(phone)){
                          	  // alert("请输入正确的手机号！")
                          	  $(".phone").val("");
                          	    return false;
                          }else{

                          	      var jsonData={"id":54321,"jsonrpc":"2.0","method":"Activity.JoinActivity","params":{"activityname":"act_double11draw","userid":phone}};
                                   $.ajax({
                                          url:"http://test.app.api.gupiaoxianji.com/server/",  //接口地址
                                         type:"POST",
                                         contentType: "application/json",
                                         dataType: "json",
                                         data: JSON.stringify(jsonData),
                                         success:function(res){
                                                console.log(res);  
                                         }
                                   })
 
                         run(); 
                          }
                     
                                
            
         }
      }
     
     init()