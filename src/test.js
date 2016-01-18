$(function() {
	var dropdown = $("tournaments");
	$.getJSON("test.json", function(data) {
		$.each(data, function(index, tournament) {
			dropdown.append($("<option></option>".append(data[index])));

		});
	});

	$("#loadBracket").click(function() {
		var tournament = $("#tournaments").find("option:selected");
		alert(tournament);
	});

	$("#createBracket").click(function() {
		$("#bracketBody").empty();
		addEntries($("#rounds").val());
	});

	$("#saveMaster").click(function() {

	});
});

var addEntries = function(rounds) {
	var tbody = $("#bracketBody");
	for (var i = 0; i < rounds; i++) {
		var trs = tbody.find("tr");
		if (trs.length == 0) {
			tbody.append($("<tr></tr>").append("<td><input /></td>"));
		} else {
			$.each(trs, function(row, tr) {
				tr = $(tr);
				tr.before(createRow(tr));
				tr.prepend($("<td></td>"));
			});
			tbody.append(createRow(tbody.find("tr:last")));
		}
	}
};

var createRow = function(row) {
	var tr = $("<tr></tr>");
	tr.append("<td><input /></td>");
	for (var i = 0; i < row.length; i++) {
		tr.append("<td></td>");
	}
	return tr;
	//row.before(tr);
};