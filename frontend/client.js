$(function() {
	loadBrackets();

	$("#loadBracket").click(function() {
		$("#bracketBody").empty();
		$.getJSON("http://localhost:8080/" + $("#tournaments").find("option:selected").val(), function(data) {
			var rounds = Math.log(data.length + 1) / Math.log(2);
			createTable(rounds);
			populateTable(data);
		});
	});

	$("#createBracket").click(function() {
		$("#bracketBody").empty();
		createTable($("#rounds").val());
	});

	$("#saveBracket").click(function() {
		$.post("http://localhost:8080/" + $("#bracketId").val(), JSON.stringify(getTableData()), function() {
			alert("Successfully created bracket");
			loadBrackets();
		});
	});

	$("#deleteBracket").click(function() {
		console.log($("#bracketId").val());
		$.ajax({
			type: "Delete",
			url: "http://localhost:8080/" + $("#tournaments").find("option:selected").val(),
			success: function() {
				alert("Successfully deleted bracket");
				loadBrackets();
			}
		});
	});
});

var loadBrackets = function() {
	$("#tournaments").empty();
	$.getJSON("http://localhost:8080/", function(data) {
		$.each(data, function(index, tournamentName) {
			$("#tournaments").append($("<option></option>").append(tournamentName));
		});
	});
};

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

var getTableData = function() {
	var entries = [];
	var tbody = $("#bracketBody");
	$.each(tbody.find("tr"), function(row, tr) {
		tr = $(tr);
		$.each(tr.find("td"), function(col, td) {
			td = $(td);
			var input = td.find("input");
			if (td.find("input").length == 1) {
				entries.push(input.val());
			}
		});
	});
	return entries;
};