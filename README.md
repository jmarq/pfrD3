pfrD3
=====
hey this needs to be fixed, I think the table structure changed on the stats site, so the scraping is off.  

check it out at 
http://jmarq.github.io/pfrD3/

pro-football-reference.com D3 charting/visualization


http://www.pro-football-reference.com/years/2012/fantasy.htm
(substitute other years for 2012)

using jquery to scrape
data=[];
$("#fantasy").find("tbody").find("tr").each(function(){if(!$(this).attr("class")){data.push(this)}});

this grabs the rows from the table of interest, leaving out the spacer and heading rows.



tds within row:  (want to graph any of these? right now it grabs rushing/receiving yds and touchdowns)
0: rank

1: name

2: team abbv

3: age

4: games played

5: games started

6: passes completed

7: passes attempted

8: passing yards

9: passing tds

10: interceptions

11: rushing attempts

12: rushing yards

13: yards per attempt

14: rushing tds

15: receptions

16: receiving yards

17: yards per reception

18: receiving tds
 
19: fantasy position

20: fantasy points

21: fantasy points - fantasy points of 'baseline player'

22: fantasy position rank

23: fantasy overall rank 


