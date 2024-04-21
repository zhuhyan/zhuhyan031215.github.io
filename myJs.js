 	//------按用户端设备的实际情况设置基础字体和可视界面大小
	var deviceWidth = document.body.clientWidth ;
    var deviceHeight = window.innerHeight ;
    var fontBase = parseInt(deviceWidth / 21); //窄屏无法显示20个汉字
	
    console.log('AppWidth:'+ deviceWidth);
    console.log('AppHeight:'+ deviceHeight);
	console.log('fontBase:'+ fontBase + 'px');
    document.body.style.height = deviceHeight + "px" ;
	document.body.style.fontSize = fontBase + "px" ;

   //设置下面2行p元素行高与父容器的高度一致，使得文字在垂直方向居中 
        $("lessonName").style.lineHeight = deviceHeight * 0.15 + 'px' ;
        $("chapter").style.lineHeight = deviceHeight * 0.1 + 'px' ;
		$("statusInfo").style.lineHeight = deviceHeight * 0.1 + 'px' ;

	//------提前下载和缓存APP需要的图片
const booksPage = ["pinwheel.jpg","aprilshower.jpg","donquixote.jpg","notalone.jpg","tomorrow.jpg","circles.jpg","fallingflower.jpg","tomyyouth.jpg",
	 ] ;
const musicList = ['SEVENTEEN - 风车.mp3','SEVENTEEN - April shower.mp3', 
'SEVENTEEN - DON QUIXOTE(1).mp3','SEVENTEEN - Not Alone.mp3', 'SEVENTEEN - 现在，即使明天是世界末日-.mp3','SEVENTEEN - Circles.mp3','SEVENTEEN - 落花.mp3','脸红的思春期 - 致我的思春期.mp3',
]
const teachersFace = ['0.jpg' , '1.jpg' , '2.jpg' , '3.jpg' , '4.jpg' , '5.jpg' , '6.jpg' , '7.jpg'  ] ;

 

  //将书封面的宽度设置填满客户设备的main区域，这也导致小尺寸图片back.jpg放大有模糊现象，可等图片加载后，异步更新为清晰的图片
  $('bookPage').style.width = deviceWidth + 'px' ;
  
  setTimeout( ()=>$('teacherFace').src = 'myface/0.jpg' ,3000);
  setTimeout( ()=>$('bookPage').src = 'music/pinwheel.jpg' ,4000);
  setTimeout( ()=>$('myAudio').src = 'mp3/SEVENTEEN - 风车.mp3' ,4000);
  setTimeout(loadImgOneByOne,5000);
  
 //测试封面图片在本地和在github上的巨大区别，分析异步代码的执行流程图
   //函数也可看作对象，下面利用对象的属性，尝试ECMAscript的函数式编程功能
	loadImgOneByOne.timer = new Date() - 1 ;
    loadImgOneByOne.imgIndex = 0 ;
 function loadImgOneByOne(){
	let img = new Image();
	img.src = 'music/' + booksPage[loadImgOneByOne.imgIndex] ;
	if (loadImgOneByOne.imgIndex < booksPage.length - 1){
       loadImgOneByOne.imgIndex ++ ;
       img.addEventListener('load', 
		 ()=>{ 
		  console.log(booksPage[loadImgOneByOne.imgIndex - 1]+' is loaded '+ 'within '+(new Date() - loadImgOneByOne.timer)+ " ms !")
	      loadImgOneByOne.timer = new Date() - 1 ;
		  loadImgOneByOne();
	     });
	}
  }
//--- 下面代码暂时选择不用，在github图片文件太多，导致性能很难改善

/*
    timer = new Date() - 1  ;
for (let face of teachersFace ){
	let img = new Image();
	img.src = 'myFace/' + face ;
	img.addEventListener('load',
	 ()=>console.log(face+' is loaded '+ 'within '+(new Date() - timer)+ " ms !")
		);
}
*/

//执行异步代码，动态显示19个书面图片加载进度，下面代码表现lesson文件夹下的所有文件加载进程
var clock = setInterval(()=>{
      let i = loadImgOneByOne.imgIndex + 1;
      let width = parseInt( i / booksPage.length * 100) ;
      //console.log("progress:" + width) ;
      $('progressBar').style.width = width + '%' ;
      if (width === 100)  {
		   $('progressBar').textContent = "OK, Resource loaded 100%."
		  clearInterval(clock);
      }
    },500);


 

//------touch events register and handel----------

 const chapterDom = $('chapter') ;
 const bookPageDom = $('bookPage') ;
       chapterDom.addEventListener("touchstart",handleStart);
	   chapterDom.addEventListener("touchend",handleEnd);
       chapterDom.addEventListener("touchmove",handleMove);
	   bookPageDom.addEventListener("touchstart",handleStart);
	   bookPageDom.addEventListener("touchend",handleEnd);
       bookPageDom.addEventListener("touchmove",handleMove);
      //---APP开发期间，暂时将底部状态栏设为可无限增加高度的滚动渲染模式。
      $("statusInfo").style.display = "inline" ;
      $("statusInfo").style.overflow = "scroll" ;
	
	 function handleStart(e){
	  touchModel.target = e.touches[0].target ;
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.touches ;
	  output.textContent = '开始摸时，共有'+touches.length + '个点的数据。';
	  output.textContent +=  " Touch" + touches[0].identifier +"begin: "  ;

	  //在touch事件发生时用touchMode.time记录开始时刻
      touchModel.time = new Date() - 1 ;
	  touchModel.ongoingXY = [] ;
	  
		 } //function  handleStart

     function handleEnd(e){
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.changedTouches ;
	  output.textContent += '结束摸时，有'+touches.length + '个点的数据。';
	  output.textContent += "touch" + touches[0].identifier  + "End! " ;
	 //在touch事件结束时用用当前时刻减touchMode.time，记录触摸移动发生的时间
      touchModel.time = new Date() - touchModel.time;

	  touchModel.respondTouch() ;
	 } //function  handleEnd

     function handleMove(e){
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.changedTouches ;
	   
	  for(let i =0 ;i<touches.length;i++){
		  let x = parseInt(touches[i].pageX);
		  let y = parseInt(touches[i].pageY);
	   output.textContent +=  ' (x:' + x +','+'y:'+ y + ') ' ;
	  }
	 //在移动时把触屏捕捉的坐标点记录下来 
	 let x = touches[0].pageX , y = touches[0].pageY ;
         x = parseInt(x) ;
		 y =  parseInt(y) ;
	 touchModel.pushXY(x,y);
	 } //function  handleMove

  //----建立模型响应和处理touch事件产生的数据
 const chapters = ['《风车（Pinwheel）》','《April Shower》','《堂吉诃德》','《Not Alone》','《现在，即使明天是世界末日》','《Circles》','《落花Falling Flower》','《致我的思春期》'] ;
 const books = booksPage ;
 var touchModel = {
   target: null ,
   ongoingXY : [] ,
   deltaX : 0 ,
   deltaY : 0 ,
   time : 0 ,
   pushXY : function (x,y){
	 let xy = {x,y} ;
     this.ongoingXY.push(xy);
   },
   chapterNo : 0 ,
   bookNo : 0 ,
   audioNo : 0 ,
   respondTouch : function(){
    this.deltaX = this.ongoingXY[this.ongoingXY.length-1].x - this.ongoingXY[0].x ;
	this.deltaY = this.ongoingXY[this.ongoingXY.length-1].y - this.ongoingXY[0].y ;
    if (Math.abs(this.deltaX) > deviceWidth / 10) {
		//console.log("有效滑动");
		//console.log(this.target) ;

        if (this.target == $('chapter') ){ //touch target is chapters
		
    		if (this.deltaX > 0){
				this.nextBook();
				this.nextChapter();
				this.nextMusic();
		    }else{
				this.preBook() ;
				this.preChapter();
				this.preMusic();
		    }
		 }
		if (this.target == $('bookPage') ){ //touch target is books
		    if (this.deltaX > 0){
              this.nextBook();
			  this.nextChapter();
			  this.nextMusic();
		    }else{
		      this.preBook() ;
			  this.preChapter();
			  this.preMusic();
		    }
		}
    }
	
   },
   preChapter : function (){
     if (this.chapterNo ===0)  {
		 this.chapterNo = chapters.length -1 ;
     }else{
	     this.chapterNo -- ;
	 }
	 $("chapter").textContent = chapters[this.chapterNo];
	
   },
   nextChapter :function (){
      if (this.chapterNo === chapters.length -1)  {
		 this.chapterNo = 0 ;
     }else{
	     this.chapterNo ++ ;
	 }
	 $("chapter").textContent = chapters[this.chapterNo];

   },
   preBook : function(){
      books
     if (this.bookNo ===0)  {
		 this.bookNo = books.length -1 ;
     }else{
	     this.bookNo -- ;
	 }
	 $("bookPage").src = 'music/' + books[this.bookNo];
   },
   nextBook :function (){
      if (this.bookNo === books.length -1)  {
		 this.bookNo = 0 ;
     }else{
	     this.bookNo ++ ;
	 }
	  $("bookPage").src = 'music/' + books[this.bookNo];
	  
   },
   preMusic : function(){
	musicList
	if (this.audioNo ===0)  {
		this.audioNo = musicList.length -1 ;
	}else{
		this.audioNo -- ;
	}
	$("myAudio").src = 'mp3/' + musicList[this.audioNo];
	$("myAudio").play();
	},
	nextMusic :function (){
		if (this.audioNo === musicList.length -1)  {
		   this.audioNo = 0 ;
	   }else{
		   this.audioNo ++ ;
	   }
		$("myAudio").src = 'mp3/' + musicList[this.audioNo];
		$("myAudio").play();
	 },
 } ; //touchModel定义完毕


  //$(66);检测下面的自定义函数
  function $(eleId){
    if (typeof eleId !== 'string'){
	   throw("$函数调用实参错误，行参必须是字符串！");
	   return 
    }
      return document.getElementById(eleId) ;
   }