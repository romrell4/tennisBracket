/**
 * Created by eric on 1/18/16.
 */
var cells = [];
var editable = false;
$(function() {
	$.getJSON("http://localhost:8080/test", function(data) {
		var rounds = Math.log(data.length + 1) / Math.log(2);
		createTable(rounds);
		indexTable();
		populateTable(data);
	});
});

var createTable = function(rounds) {
	var tbody = $("#bracketBody");
	for (var i = 0; i < rounds; i++) {
		var trs = tbody.find("tr");
		if (trs.length == 0) {
			tbody.append(getInputElement(rounds, i));
		} else {
			$.each(trs, function(row, tr) {
				tr = $(tr);
				tr.before(getInputElement(rounds, i));
				tr.prepend($("<td></td>"));
			});
			tbody.append(getInputElement(rounds, i));
		}
	}
};

var getInputElement = function(rounds, i) {
	if (i == rounds - 1) {
		return $("<tr></tr>").append($("<td class='underline'></td>").append($("<input readonly />")));
	} else {
		return $("<tr></tr>").append($("<td class='underline'></td>").append($("<select></select>").change(function() {
			saveBracket($(this));
		})));
	}
};

var indexTable = function() {
	var tbody = $("#bracketBody");
	$.each(tbody.find("tr"), function(row, tr) {
		tr = $(tr);
		cells[row] = [];
		$.each(tr.find("td"), function(col, td) {
			td = $(td);
			cells[row][col] = td;
			td.attr("id", col + "|" + row);
		});
	});
};

var populateTable = function(entries) {
	var rounds = Math.round(Math.log(entries.length + 1) / Math.log(2));
	for (var col = 0; col < rounds; col++) {
		for (var row = 0; row < cells.length; row++) {
			var tds = cells[row];

			//Some rows will only have one td in them. This just prevents errors
			if (tds.length > col) {
				var input = tds[col].find("input");
				if (input.length == 1) {
					input.val(entries[row]);
				}

				var select = tds[col].find("select");
				if (select.length == 1) {
					var options = [""].concat(getOptionsForSelect(row, entries));
					$.each(options, function(index, option) {
						select.append($("<option></option>").append(option));
					});
					select.val(entries[row]);
				}
			}
		}
	}
};

var getOptionsForSelect = function(row, entries) {
	var options = [];
	if (row % 2 == 0) {
		options.push(entries[row]);
		return options;
	}
	var diff = getDifferenceFromParentRow(row);
	options = options.concat(getOptionsForSelect(row - diff, entries));
	options = options.concat(getOptionsForSelect(row + diff, entries));
	return options;
};

var getDifferenceFromParentRow = function(index) {
	var bin = intToBinary(index);
	var depth = 0;
	for (i = bin.length - 1; i >= 0; i--) {
		if (bin.charAt(i) == 1) {
			depth++;
		} else {
			break;
		}
	}
	return depth == 0 ? depth : Math.pow(2, depth - 1);
};

var intToBinary = function(int) {
	return (int >>> 0).toString(2);
};

var saveBracket = function(select) {
	if (editable) {
		$.post("http://localhost:8080/test", JSON.stringify(getTableData()), function() {
			console.log("Saved [" + select.val() + "]");
		});
	}
};

var getTableData = function() {
	var entries = [];
	var tbody = $("#bracketBody");
	$.each(cells, function(index, tds) {

	});


	$.each(tbody.find("tr"), function(row, tr) {
		tr = $(tr);
		var input = tr.find("input");
		if (input.length == 1) {
			entries.push(input.val());
		}

		var select = tr.find("select");
		if (select.length == 1) {
			entries.push(select.val());
		}
	});
	return entries;
};