"use strict"

var scouterStats = {}
var matchStats = []

$(document).ready(function(){
	loadEventScores(function(){
		loadEventStats(function(){
			eventMatches.forEach(match => {
				var thisMatch
				;["Red","Blue"].forEach(alliance=>{
					var scoutData = [],
					scoreData
					for (var i=0; i<=3; i++){
						var team = match[alliance.charAt(0)+""+i],
						matchTeam = `${match.Match}-${team}`
						if (eventStatsByMatchTeam[matchTeam])scoutData.push(eventStatsByMatchTeam[matchTeam])
					}
					if (eventScores[match.Match]) eventScores[match.Match].alliances.forEach(dat=>{
						if (dat.alliance.toLowerCase() == alliance.toLowerCase()) scoreData = dat
					})
					if (!thisMatch) thisMatch = {}
					if (scoreData && scoutData.length == 3)thisMatch[alliance]=getScoreDifference(scoutData, scoreData)
					scoutData.forEach(scout=>{
						var scouter = scout.scouter.trim(),
						key = scouter.toLowerCase().replace(/[^0-9a-z]/g,"")
						if (!scouter) scouter="Unknown"
						if (!key) key="unknown"
						if (!scouterStats[key]) scouterStats[key] = {name:scouter,matches:0,scoredMatches:0,error:0}
						scouterStats[key].matches++
						if (thisMatch[alliance]){
							scouterStats[key].scoredMatches++
							scouterStats[key].error+=thisMatch[alliance].diff/3
							scouterStats[key].avgError=Math.round(scouterStats[key].error/scouterStats[key].scoredMatches)
						}
					})
				})
				if (thisMatch) matchStats.push(thisMatch)
			})
			showScouters()
		})
	})
})

function showScouters(){
	$('h1').text($('h1').text().replace(/EVENT/,eventName))
	var table = $('#scouterStats').html("")
	Object.keys(scouterStats).sort((a,b)=>scouterStats[b].matches-scouterStats[a].matches).forEach(key=>{
		var s = scouterStats[key]
		table.append(
			$('<tr>')
			.append($('<td>').text(s.name))
			.append($('<td>').text(s.matches))
			.append($('<td>').text(s.avgError))
		)
	})
}

function getScoreDifference(scoutData, scoreData){
	if (!window.fmsMapping) return 0
	var diff = {diff:0,dat:[]}
	window.fmsMapping.forEach(map=>{
		var dat = {fms:{},scout:{},diff:0}
		map[0].forEach(fms=>{
			dat.fms[fms]=scoreData[fms]||0
			dat.diff+=scoreData[fms]||0
		})
		map[1].forEach(scout=>{
			dat.scout[scout]={total:0,teams:[]}
			scoutData.forEach(scoutDat => {
				dat.scout[scout].teams.push({
					points:scoutDat[scout]||0,
					team:scoutDat.team,
					scouter:scoutDat.scouter
				})
				dat.scout[scout].total+=scoutDat[scout]||0
				dat.diff-=scoutDat[scout]||0
			})
		})
		dat.diff=Math.abs(dat.diff)
		diff.dat.push(dat)
		diff.diff+=dat.diff
	})
	return diff
}