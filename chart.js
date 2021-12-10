var _ = require("underscore");
var Backbone = require("backbone");
var VError = require("verror");
const BrowserFS = require('browserfs');
BrowserFS.install(window)

var XLSXChart = Backbone.Model.extend({
	/*
		Generate XLSX with chart
		chart: column, bar, line, radar, area, scatter, pie
		titles: []
		fields: []
		data: {title: {field: value, ...}, ...}
	*/
	generate: function (opts, cb) {
		let Chart = require("./chart/base");

		if (opts.chart == "columnAvg") {
			Chart = require("./chart/columnAvg");
		}
		if (opts.chart == "columnGroup") {
			Chart = require("./chart/columnGroup");
		}
		if (opts.chart == "columnGroupAvg") {
			Chart = require("./chart/columnGroupAvg");
		}
		let chart = new Chart();

		if (opts.charts) {
			chart.generateMult(opts, cb);
		} else {
			chart.generate(opts, cb);
		}
	},
	writeFile: function (opts, cb) {
		var me = this;
		me.generate(_.defaults({ type: "base64" }, opts), function (err, result) {
			if (err) {
				return cb(new VError(err, "writeFile"));
			}
			const byteCharacters = atob(result);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			let fileURL = window.URL.createObjectURL(new Blob([byteArray]));
			let fileLink = document.createElement('a');

			fileLink.href = fileURL;
			fileLink.setAttribute('download', opts.file);
			document.body.appendChild(fileLink);

			fileLink.click();
			// fs.writeFile(opts.file, result, "base64", function (err) {
			// 	cb(err ? new VError(err, "writeFile") : null);
			// });
		});
	}
});

module.exports = XLSXChart;
