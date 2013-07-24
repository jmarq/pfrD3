/*remember, in bookmarkets, comments have to be like this. */
/* single line comments end the input */

/*ok, so you have to add d3 to the page, and wait til it's there to call its functions */

(function(){
  if(document.location.href!="http://www.pro-football-reference.com/years/2012/fantasy.htm"){
    document.location.href="http://www.pro-football-reference.com/years/2012/fantasy.htm"; 
    return; 
  }

  
  var getData=function(){
    data=[];
    
    $("#fantasy").find("tbody").find("tr").each(function(){if(!$(this).attr("class")){data.push(this)}});
    graphList=$.map(data,function(d){return(
      {
       name: d.children[1].children[0].innerHTML,
       rushingYards: parseInt(d.children[12].innerHTML),
       receivingYards: parseInt(d.children[16].innerHTML),
       tds: parseInt(d.children[14].innerHTML)+parseInt(d.children[18].innerHTML)
      }
    )});

  };
  var addGraph=function(){
    getData();
    $("body").find("*").hide();
    $("body").append($("<div>").attr("id","playerInfo").html("player info: ").css({"font-size":"1.5em"}));
    bodyWidth=$("body").width();
    chartWidth=Math.floor(bodyWidth*0.7);
    d3.select("body").append("svg").attr("id","chart").attr("viewBox","0 0 100 100").attr("preserveAspectRatio","xMidYMid").attr("width",chartWidth).attr("height",chartWidth).style("border","2px solid black").style("background","#222225");
    selection=d3.select("svg").selectAll("rect").data(graphList);
    var scale=d3.scale.linear().domain([0,2500]).range([0,100]);
    selection.enter().append("circle")
     .attr("cx",function(d,i){return(scale(d.rushingYards))})
     .attr("cy",function(d,i){return(100-scale(d.receivingYards))})
     .attr("r",function(d,i){return((d.tds+1)/10)})
     .style("fill","none").style("stroke","white").style("stroke-width",0.2);
    selection.exit().remove();
    selection.on("mouseover", function(d,i){

      d3.selectAll("circle").style("stroke","white");
      d3.select(this).style("stroke","#089");
      $("#playerInfo").html("player info: "+d.name+" "
       +d.rushingYards+" rushing, "+d.receivingYards+" receiving, "+d.tds+" touchdowns"
       ); 
    });
    
  };
  $.getScript("http://d3js.org/d3.v3.min.js",addGraph);  
})();

