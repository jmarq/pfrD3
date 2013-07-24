(function(){
  if(document.location.href!="http://www.pro-football-reference.com/years/2012/fantasy.htm"){
    document.location.href="http://www.pro-football-reference.com/years/2012/fantasy.htm"; 
    return; 
  }

  alert("on pfr.com");
  data=[];
  $("#fantasy").find("tbody").find("tr").each(function(){if(!$(this).attr("class")){data.push(this)}});
  
  $("body").find("*").hide();
  bodyWidth=$("body").width();
  d3.select("body").append("svg").attr("id","chart").attr("viewBox","0 0 100 100"
).attr("preserveAspectRatio","xMidYMid").attr("width",bodyWidth).attr("height",bodyWidth).style("border","2px solid black").style("background","red");



})();

