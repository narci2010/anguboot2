'use strict';

var generator = require('yeoman-generator');

module.exports = class extends generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        var version = this._globalConfig.name && this._globalConfig.name.split(':').length === 2 ? this._globalConfig.name.split(':')[1] : '';
        this.log('\n   /\\  _  _    |_  _  _ |_\n' +
                   '  /--\\| )(_)|_||_)(_)(_)|_  v'+ version +'\n' +
                   '          _/\n');
        this.languagesChoice = [
             {name:'Français', value:'fr', checked: true},
             {name:'Deutsch', value:'de', checked: true},
             {name:'Español', value:'es', checked: true}
        ];

        this.pluginsChoice = [
            {name:'Security', value:'security', checked: true},
            {name:'Jpa', value:'jpa', checked: true},
            {name:'Rest documentation', value:'restDoc', checked: true},
            {name:'Docker', value:'docker', checked: true}
        ];

        this.pluginsAngularChoice = [
            {name:'Tenant customization', value:'custo', checked: true}
        ];
    }

	prompting() {

	    var nameRegex = /^[a-zA-Z0-9]+$/;

		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'Your project name (one word, no space or special characters) :',
			default: this.appname,
            validate: function (input) {
                return nameRegex.test(input) ? true : 'Please use valid name (' + nameRegex + ')';
            },
		}, {
			type: 'input',
			name: 'description',
			message: 'Your project description :',
			default: 'Spring boot with angular project'
		}, {
			type: 'input',
			name: 'groupId',
			message: 'Your maven group id :',
			default: 'com.worldline.edoc'
		}, {
			type: 'input',
			name: 'artifactId',
			message: 'Your maven artifact id :',
			default: this.appname
		}, {
			type: 'input',
			name: 'version',
			message: 'Your maven project version :',
			default: '1.0.0-SNAPSHOT'
		}, {
			type: 'confirm',
			name: 'springboot',
			message: 'Would you like to use spring boot ?',
			default: true
		}, {
            when: function (response) {
                return response.springboot;
            },
            type: 'checkbox',
            name: 'pluginsAnswer',
            choices: this.pluginsChoice,
            message: 'Spring boot plugins : '
        }, {
			when: function (response) {
				return response.springboot;
			},
			type: 'confirm',
			name: 'angular',
			message: 'Would you like to use angular ?',
			default: true
		}, {
            when: function (response) {
                return response.springboot && response.angular;
            },
            type: 'checkbox',
            name: 'pluginsAngularAnswer',
            choices: this.pluginsAngularChoice,
            message: 'Angular plugins : '
        }, {
            when: function (response) {
                return response.angular;
            },
            type: 'checkbox',
            name: 'languagesAnswer',
            choices: this.languagesChoice
            message: 'Languages i18n (in addition to english) : '
        }, {
            when: function (response) {
                return response.springboot && response.pluginsAnswer.indexOf('jpa') > -1;
            },
            type: 'confirm',
            name: 'generateSql',
            message: 'Would you like to use sql maven plugin generation ?',
            default: true
        }, {
            when: function (response) {
                return response.springboot && response.pluginsAnswer.indexOf('jpa') > -1;
            },
            type: 'confirm',
            name: 'report',
            message: 'Would you like to use metrics report in database ?',
            default: true
        }];

        return this.prompt(prompts).then((answers) => {
            this.props = answers;

            this.props.languages = {};
            if(this.props.angular){
                for(var i in this.languagesChoice){
                    this.props.languages[this.languagesChoice[i].value] = answers.languagesAnswer.indexOf(this.languagesChoice[i].value) > -1;
                }
            }

            this.props.plugins = {};
            for(var i in this.pluginsChoice){
                this.props.plugins[this.pluginsChoice[i].value] = answers.pluginsAnswer.indexOf(this.pluginsChoice[i].value) > -1;
            }
            if(this.props.angular){
                for(var i in this.pluginsAngularChoice){
                    this.props.plugins[this.pluginsAngularChoice[i].value] = answers.pluginsAngularAnswer.indexOf(this.pluginsAngularChoice[i].value) > -1;
                }
            }

			this.props.nameCap = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
			this.props.nameLow = answers.name.toLowerCase();
			this.props.package = answers.groupId + '.' + this.props.nameLow;
			this.props.packagePath = answers.groupId.replace(/\./g, '/') + '/' + this.props.nameLow;
			var random = Math.floor(Math.random() * 90 + 10);
			this.props.port = '80' + random;
        });
     }

	writing() {
        var skipTemplates = {
            globOptions: {
                ignore: ['**/_*', '_*']
            }
        };

        this.copy = function(src, dest, opts){
            this.fs.copy(this.templatePath(src), this.destinationPath(dest), opts);
        };

        this.template = function(src, dest, props){
            this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), props ? props : this.props);
        };

        this.copy('.gitignore', '.gitignore');

        this.template('_pom.xml', 'pom.xml');

        if(this.props.angular){
            this.template('_package.json', 'package.json');
            this.template('_tslint.json', '_tslint.json');
        }

        if(this.props.plugins.restDoc) {
            this.template('src/main/asciidoc/_rest-api.adoc', 'src/main/asciidoc/rest-api.adoc');
        }

        this.copy('src/main/filters', 'src/main/filters', skipTemplates);
        this.template('src/main/assembly/_assembly.xml', 'src/main/assembly/assembly.xml');

        if (this.props.springboot) {
            this.copy('src/main/resources', 'src/main/resources', skipTemplates);

            this.template('src/main/config/_application.yml', 'src/main/config/application.yml');
            this.template('src/main/resources/_application.yml', 'src/main/resources/application.yml');
            this.template('src/main/config/_application.conf', 'src/main/config/application.conf');
        } else {
            this.copy('src/main/config/_config.xml', 'src/main/config/config.xml');
        }

        var javaDir = 'src/main/java/' + this.props.packagePath;
        var javaTestDir = 'src/test/java/' + this.props.packagePath;
        var classPrefix = this.props.nameCap;

        // java
        this.template('src/main/java/exception/_ApplicativeException.java', javaDir +'/exception/'+classPrefix+'ApplicativeException.java');
        this.template('src/main/java/exception/_TechnicalException.java', javaDir +'/exception/'+classPrefix+'TechnicalException.java');
        this.copy('src/test/resources/logback-test.xml', 'src/test/resources/logback-test.xml');

        if (this.props.springboot) {
            this.template('src/main/java/_Application.java', javaDir + '/' + classPrefix + 'Application.java');
            this.template('src/test/java/_ApplicationTest.java', javaTestDir + '/' + classPrefix + 'ApplicationTest.java');
            this.template('src/main/java/_CustomLoggingListener.java', javaDir + '/CustomLoggingListener.java');
            this.template('src/main/java/config/_Properties.java', javaDir + '/config/' + classPrefix + 'Properties.java');

            this.template('src/main/resources/_application-dev.properties', 'src/main/resources/application-dev.properties');

            this.template('src/main/java/web/_Controller.java', javaDir + '/web/' + classPrefix + 'Controller.java');
            
            if (this.props.plugins.security) {
                this.template('src/main/java/config/_SecurityConfiguration.java', javaDir + '/config/SecurityConfiguration.java');
                this.template('src/main/java/config/_FrontBasicAuthenticationEntryPoint.java', javaDir + '/config/FrontBasicAuthenticationEntryPoint.java');
                this.template('src/main/java/config/oauth/_CorsEnabledConfiguration.java', javaDir + '/config/oauth/CorsEnabledConfiguration.java');
                this.template('src/main/java/config/oauth/_Oauth2Configuration.java', javaDir + '/config/oauth/Oauth2Configuration.java');
            }

            if(this.props.report){
                this.template('src/main/java/jpa/_Timer.java', javaDir +'/jpa/Timer.java');
                this.template('src/main/java/jpa/_TimerRepository.java', javaDir +'/jpa/TimerRepository.java');
                this.template('src/main/java/metrics/_MetricsController.java', javaDir +'/metrics/MetricsController.java');
                this.template('src/main/java/metrics/_DatabaseReporter.java', javaDir +'/metrics/DatabaseReporter.java');
                this.template('src/main/java/metrics/_MetricsConfiguration.java', javaDir +'/metrics/MetricsConfiguration.java');
            }
        } else {
            this.template('src/main/java/_Main.java', javaDir + '/' + classPrefix + 'Main.java');
            this.template('src/test/java/_MainTest.java', javaTestDir + '/' + classPrefix + 'MainTest.java');
        }

        if (this.props.angular) {

            // app
            var staticDir = 'src/main/web/';
            this.copy(staticDir + '**/*', 'src/main/web', skipTemplates);

            this.template(staticDir + '_index.html', staticDir + 'index.html');

            if(this.props.plugins.custo){
                this.template(staticDir + 'app/components/_custo.component.ts', staticDir + 'app/components/custo.component.ts');
                this.template(staticDir + 'app/components/_custo.component.html', staticDir + 'app/components/custo.component.html');
                // java
                this.template('src/main/java/config/_WebMvcConfiguration.java', javaDir + '/config/WebMvcConfiguration.java');
                // client example
                this.copy('clients', 'clients', skipTemplates);
            }

            // languages
            for(var l in this.props.languages){
                if(this.props.languages[l]){
                    this.template(staticDir + 'locale/_messages.' + l +'.xlf', staticDir + 'locale/messages.' + l +'.xlf');
                }
            }
        }

        if(this.props.plugins.docker) {
            this.template('src/main/docker/_Dockerfile', 'src/main/docker/Dockerfile');
        }
	}
	install() {
        var displayedLanguages = 'en';
        if(this.props.languages.length > 0){
            displayedLanguages += ', ';
        }
        for(var l in this.props.languages){
            if(this.props.languages[l]){
                displayedLanguages+= ', ' + l;
            }
        }

        this.log('--------------------------------------------------------------------------------------------------------------------------');
        this.log(' |_ name       : ' + this.props.nameCap);
        this.log(' |_ groupId    : ' + this.props.groupId);
        this.log(' |_ artifactId : ' + this.props.artifactId);
        this.log(' |_ version    : ' + this.props.version);
        this.log(' |_ package    : ' + this.props.package);
        this.log(' |_ http port  : '+ this.props.port);
        this.log(' |_ languages  :', displayedLanguages);
		this.log('--------------------------------------------------------------------------------------------------------------------------');
		this.log('All done, run "mvn clean install" to compile and download dependencies');
		this.log('--------------------------------------------------------------------------------------------------------------------------');
	}
};