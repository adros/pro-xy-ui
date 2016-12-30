/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
	System.config({
		paths: {
			// paths serve as alias
			'npm:': 'node_modules/'
		},
		// map tells the System loader where to look for things
		map: {
			// our app is within the app folder
			app: 'lib/app',
			// angular bundles
			'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
			'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
			'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
			'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
			'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
			'@angular/http': 'npm:@angular/http/bundles/http.umd.js',
			'@angular/router': 'npm:@angular/router/bundles/router.umd.js',
			'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
			'@angular/material': 'npm:@angular/material/bundles/material.umd.js',
			// other libraries
			'rxjs': 'npm:rxjs',
			'angular2-modal': 'npm:angular2-modal/bundles/angular2-modal.umd.js',
			'angular2-modal/plugins/bootstrap': 'npm:angular2-modal/bundles/angular2-modal.bootstrap.umd.js',
			'angular2-highcharts': 'npm:angular2-highcharts',
			'angular-2-data-table': 'npm:angular-2-data-table/dist',
			'highcharts': 'npm:highcharts',
			'lodash': 'npm:lodash',
			'socket.io-client': 'npm:socket.io-client/dist/socket.io.js',
			'dragula': 'npm:dragula/dist/dragula.js',
            'ng2-dragula': 'npm:ng2-dragula/bundles/ng2-dragula.umd.js'
		},
		// packages tells the System loader how to load when no filename and/or no extension
		packages: {
			app: {
				main: './main.js',
				defaultExtension: 'js'
			},
			rxjs: {
				defaultExtension: 'js'
			},
			highcharts: {
				defaultExtension: 'js'
			},
			'angular2-highcharts': {
				main: './index.js',
				defaultExtension: 'js'
			},
			'lodash': {
				main: './lodash.js',
				defaultExtension: 'js'
			},
			'angular-2-data-table': {
				format: 'cjs',
				defaultExtension: 'js',
				main: 'index.js'
			},
			'dragula': {
				defaultExtension: 'js'
			},
			'ng2-dragula': {
				defaultExtension: 'js'
			}
		}
	});
})(this);
