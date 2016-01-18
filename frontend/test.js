$(function() {
	var dropdown = $("#tournaments");
	var tournaments = {};
	$.getJSON("http://students.cs.byu.edu/~romrell4/tennisBracket/test.json", function(data) {
		tournaments = data;
		$.each(data, function(tournamentName, tournamentEntries) {
			dropdown.append($("<option></option>").append(tournamentName));
		});
	});

	$("#loadBracket").click(function() {
		$("#bracketBody").empty();
		var tournament = tournaments[$("#tournaments").find("option:selected").val()];
		var rounds = Math.log(tournament.length + 1) / Math.log(2);
		createTable(rounds);
		populateTable(tournament);
	});

	$("#createBracket").click(function() {
		$("#bracketBody").empty();
		createTable($("#rounds").val());
	});

	$("#saveBracket").click(function() {

	});
});

var createTable = function(rounds) {
	var tbody = $("#bracketBody");
	for (var i = 0; i < rounds; i++) {
		var trs = tbody.find("tr");
		if (trs.length == 0) {
			tbody.append($("<tr></tr>").append("<td><input /></td>"));
		} else {
			$.each(trs, function(row, tr) {
				tr = $(tr);
				tr.before($("<tr><td><input /></td></tr>"));
				tr.prepend($("<td></td>"));
			});
			tbody.append($("<tr><td><input /></td></tr>"));
		}
	}
};

var populateTable = function(entries) {
	var i = 0;
	var tbody = $("#bracketBody");
	$.each(tbody.find("tr"), function(row, tr) {
		tr = $(tr);
		$.each(tr.find("td"), function(col, td) {
			td = $(td);
			var input = td.find("input");
			if (td.find("input").length == 1) {
				input.val(entries[i++]);
			}
		});
	});
};