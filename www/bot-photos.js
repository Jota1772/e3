"use strict"

$(document).ready(function(){
	var teams = /(?:(?:^\#)|(?:\&teams\=))([0-9]+(?:,[0-9]+)*)$/g.exec(location.hash)
	if (teams) teams = teams[1].split(/,/)
	for (var i=1; teams && i<teams.length; i++){
		addTeam(teams[i]);
	}
	$('#add').click(function(e){
		e.preventDefault()
		addTeam($('#team').val())
		return false
	})
	if (eventId && !teams){
		loadEventSchedule(function(){
			for(var i=0; i<eventTeams.length; i++){
			   addTeam(eventTeams[i])
			}
		})
	}
	$('#showInstructions').click(function(){
		showLightBox($('#instructions'))
		return false
	})
	$('#fullPhoto').click(closeLightBox)
})

function showFullPhoto(){
	showLightBox($('#fullPhoto').attr('src',$(this).attr('src')))
}

function addTeam(team){
	if (!/^[0-9]+$/.test(team)) return
	var year = $('#yearInp').val()
	$('#teams').append(
		$('<tr>').append(
			$('<th>').append(`<h2>Team ${team}</h2>`)
		).append(
			$('<td>')
				.append($(`<img class=photoPreview src=/data/${year}/${team}.jpg>`).click(showFullPhoto))
				.append(`<input type=file name=${team} accept="image/*">`)
		).append(
			$('<td>')
				.append($(`<img class=photoPreview src=/data/${year}/${team}-top.jpg>`).click(showFullPhoto))
				.append(`<input type=file name=${team}-top accept="image/*">`)
		)
	)
	$('#team').val("")
}
