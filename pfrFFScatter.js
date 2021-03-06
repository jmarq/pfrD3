(function(){
  //go to pro football reference if we aren't there already, then this script will have to be run again
  if(!window.location.href.match(/http:\/\/www\.pro-football-reference\.com\/years\/20..\/fantasy\.htm/)){
   var year=prompt("which year?\n(year of season kickoff,\naka '2012' for 2012-2013)");
   
   document.location.href="http://www.pro-football-reference.com/years/"+year+"/fantasy.htm"; 
   return; 
  }
  //we're already at pro football reference
  //colors for use in the visualization
  team_colors = {
  ari: {primary: "B10339", secondary: "FFC40D", tertiary: "000000"},
  atl: {primary: "000000", secondary: "231F20", tertiary: ""},
  bal: {primary: "2B025B", secondary: "F5A329", tertiary: ""},
  buf: {primary: "00133F", secondary: "EE2F2B", tertiary: ""},
  car: {primary: "0097C6", secondary: "101B24", tertiary: "A2A7AB"},
  chi: {primary: "00133F", secondary: "FF652B", tertiary: ""},
  cin: {primary: "FF2700", secondary: "101B24", tertiary: ""},
  cle: {primary: "4C230E", secondary: "FF652B", tertiary: ""},
  dal: {primary: "002E4D", secondary: "FFFFFF", tertiary: ""},
  den: {primary: "002E4D", secondary: "FF652B", tertiary: ""},
  det: {primary: "006EA1", secondary: "F6F6F6", tertiary: "EFF4F8"},
  gnb:  {primary: "294239", secondary: "FFBF00", tertiary: ""},
  hou: {primary: "00133F", secondary: "D6303A", tertiary: ""},
  ind: {primary: "00417E", secondary: "FFFFFF", tertiary: ""},
  jax: {primary: "00839C", secondary: "101B24", tertiary: "FFFFFF"},
  kan:  {primary: "C60024", secondary: "000000", tertiary: ""},
  mia: {primary: "006B79", secondary: "FF642A", tertiary: ""},
  min: {primary: "240A67", secondary: "FFAC2C", tertiary: ""},
  nwe:  {primary: "00295B", secondary: "EE2F2B", tertiary: "C7CACC"},
  nor:  {primary: "C6A876", secondary: "000B17", tertiary: ""},
  nyg: {primary: "003155", secondary: "FFFFFF", tertiary: ""},
  nyj: {primary: "174032", secondary: "FFFFFF", tertiary: ""},
  oak: {primary: "000000", secondary: "B5BBBD", tertiary: "FFFFFF"},
  phi: {primary: "002F30", secondary: "EFEFEF", tertiary: ""},
  pit: {primary: "000000", secondary: "FFBF00", tertiary: ""},
  sdg:  {primary: "05173C", secondary: "0F83B8", tertiary: "FFBF00"},
  sfo:  {primary: "940029", secondary: "D99E77", tertiary: ""},
  sea: {primary: "030F1F", secondary: "283E67", tertiary: ""},
  stl: {primary: "00295B", secondary: "C1A05B", tertiary: ""},
  tam:  {primary: "665C50", secondary: "D6303A", tertiary: ""},
  ten: {primary: "002C4B", secondary: "EE2F2B", tertiary: "0080C0"},
  was: {primary: "8C001A", secondary: "FFBF00", tertiary: ""}
};

//some teams might not be listed in my colors list for various reasons (old team, multiple teams)
// make unmatched teams black
teamColor=function(abv){
    var abvl=abv.toLowerCase();
    var color;
  if(abvl in team_colors){
    color="#"+team_colors[abvl].primary;
  }
  else{
    color="#000";
  }
  
  return(color);
};
  
  var getData=function(){
    //scrape the page table, loading the data into a list of {} objects
    data=[];
    
    $("#fantasy").find("tbody").find("tr").each(function(){if(!$(this).attr("class")){data.push(this)}});
    graphList=$.map(data,function(d){
      var teamABV="";
      //team name might be in a link, might not be
      if(d.children[2].children[0]){
        teamABV=d.children[2].children[0].innerHTML;
      }
      else{
        teamABV=d.children[2].innerHTML;
      }
      return(
      {
       name: d.children[1].children[0].innerHTML,
       team: teamABV,
       color: teamColor(teamABV),
       rushingYards: parseInt(d.children[12].innerHTML),
       receivingYards: parseInt(d.children[16].innerHTML),
       tds: parseInt(d.children[14].innerHTML)+parseInt(d.children[18].innerHTML)
      }
    )});

  };
  
  //d3 fun starts here
  var addGraph=function(){
    getData();
    $("body").find("*").hide();
    $("body").append($("<div>").attr("id","playerInfo").html("player info: ").css({"font-size":"1.5em"}));
    bodyWidth=$("body").width();
    chartWidth=600;
    d3.select("body").append("svg").attr("id","chart").attr("viewBox","0 0 100 100").attr("preserveAspectRatio","xMidYMid").attr("width",chartWidth).attr("height",chartWidth).style("border","2px solid black").style("background","white");
    selection=d3.select("svg").selectAll("circle").data(graphList);
    var scale=d3.scale.linear().domain([0,2500]).range([0,80]);
    var yscale=d3.scale.linear().domain([0,2500]).range([80,0]);
    var xaxis=d3.svg.axis().scale(scale).ticks(5).tickSize(1).orient("bottom");
    var yaxis=d3.svg.axis().scale(yscale).ticks(5).tickSize(1).orient("left");

    d3.select("svg").append("g").call(xaxis)
      .attr("transform","translate(10,90)")
      .attr("class","axis");
    d3.select("svg").append("g").call(yaxis)
      .attr("transform","translate(10,10)")
      .attr("class", "axis")
    selection.enter().append("circle")
     .attr("cx",function(d,i){return(scale(d.rushingYards)+10)})
     .attr("cy",function(d,i){return(yscale(d.receivingYards)+10)})
     .attr("r",function(d,i){return((d.tds+1)/10)})
     .style("fill","none").style("stroke",function(d,i){return(d.color);}).style("stroke-width",0.2);
    selection.exit().remove();
    selection.on("mouseover", function(d,i){
      d3.select(this).style("stroke","#089");
      $("#playerInfo").html("player info: "+d.name+" "
        +d.rushingYards+" rushing, "+d.receivingYards+" receiving, "+d.tds+" touchdowns"
       ); 
    })
      .on("mouseout",function(d,i){d3.select(this).style("stroke",d.color);});
    $(".axis").css({"stroke-width": "0.25px", "font-size": "1px","font-family":"helvetica,arial,sans-serif"});  
    $(".domain").css({"stroke":"black","fill":"none", "stroke-width":"0.25px"});
    $(".tick").css({"stroke-width":"0.25px", "stroke":"black", "font-size":"2px"});
    $("text").css({"stroke-width":"0.1px"});

    $("body").append($("<div>").attr("id","details").html("x axis: rushing yds <br>y axis: receiving yds<br>**note** negative values are marked as zero, I should fix that"));
  };


  $.getScript("http://d3js.org/d3.v3.min.js",addGraph);  
})();
