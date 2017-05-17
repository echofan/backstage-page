/*
* @Author: lifan
* @Date:   2016-11-01 16:14:04
* @Last Modified by:   lifan
* @Last Modified time: 2016-11-09 09:45:35
*/
 $(function(){     
      var getCookie=function(name){
         var arr, reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
           if(arr = document.cookie.match(reg)){
             return unescape(arr[2]);
             return unescape(arr[2]);
                 }
                    else{
                      return null;
             }
             }
       var userid=getCookie("userid");
       var stockid=getCookie("stockid");
         console.log(userid);
 
       var param = {
          "jsonrpc": "2.0",
          "method": "Push.BankerExploreData",    //返回值的属性
          "id": 54321,
          "params" : {
              "stockid": stockid, //"600169.SH",
              "count":200
          }
      };  
       var jsonData = {
          "id": 54321,
          "jsonrpc": "2.0",
          "method": "Push.BankerExplore",
          "params": {
              "userid": userid
          }
      };                       
     $.ajax({
         url:"http://app.api.gupiaoxianji.com/v3.7",   //接口地址
         type:"POST",
         contentType: "application/json",
         dataType: "json",
         data: JSON.stringify(jsonData),
         success:function(res){
             var result=res.result;
               console.log(result);                             
             $(".header_left").append("<img src='" + result.pictureurl + "'/>");
             $(".header_right_bottom").append(result.timestr);
             $(".Subscribe").append(result.adstr);
             $(".npm_l").append(result.invitedNum);
             $(".npm_r").append(result.needInviteNum);
             var bili=result.invitedNum/result.needInviteNum*100;                                                        
                // console.log(20);
                $(".red").css("width",bili+'%');                                    
             //推荐好友
             // console.log(userid);
             $(".btn").click(function(){
                 console.log(userid);
              location.href="http://res.gupiaoxianji.com/ddlbaf/share/index.html?userid="+userid;
             });       
         },
         error:function(res){
                  console.log(res);
         }                                   
     });           
    //推送的消息
    var jsonKd={
        "id":54321,
        "jsonrpc":"2.0",
        "method":"Push.BankerExploreData",
        "params":{
        "userid":userid,
        "count":200
                  }
    };
    $.ajax({
        url:"http://app.api.gupiaoxianji.com/v3.7",
        type:"POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonKd),
        success:function(res){
            var result=res.result.data;
              // console.log(result);                      
                            //期数
        var listInfo=result;

        var info={
            list:listInfo,
        }
        console.log(info);
        var text=template("tempId",info);  

        var html=template("templateId",info);
                                                                                     
        // querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素
        document.querySelector(".nav").innerHTML=text;
        document.querySelector("section").innerHTML=html;  
       }
        // },
        // error:function(res){
        //        console.log(res);   
        // }
         });
          
     }); 
