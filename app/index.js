'use strict';

var generator = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends generator {

    constructor(args, opts) {
        super(args, opts);

        this.option('port', { alias: 'p', type: Number, desc: 'Http port - random if not provided', required: false, default: 8000 + Math.floor(Math.random() * 90 + 10) });
        this.option('force', { alias: 'f', type: Boolean, desc: 'Force installation with previous configuration', required: false, default: false });
    }

    initializing() {
        var version = this._globalConfig.name && this._globalConfig.name.split(':').length === 2 ? this._globalConfig.name.split(':')[1] : '';

        this.log('\n   /\\  _  _    |_  _  _ |_\n' +
                   '  /--\\| )(_)|_||_)(_)(_)|_  v'+ version +'\n' +
                   '          _/\n');

        this.languagesChoice = [
             {name:'Français', value:'fr', checked: true},
             {name:'Español', value:'es', checked: true}
        ];

        this.pluginsChoice = [
            {name:'Security', value:'security', checked: true},
            {name:'Jpa', value:'jpa', checked: true},
            {name:'Rest documentation', value:'restDoc', checked: true},
            {name:'Docker', value:'docker', checked: true}
        ];

        this.pluginsAngularChoice = [
            {name:'Tenant customization', value:'custo', checked: true},
            {name:'I18n (internationalization)', value:'translate', checked: true},
            {name:'Ace (code editor and viewer)', value: 'ace', checked: true}
        ];

        this.existingProject = this.config.get('name') !== undefined && this.config.get('artifactId') !== undefined && this.config.get('groupId') !== undefined;
    }

	prompting() {

	    var nameRegex = /^[a-zA-Z0-9]+$/;

		var prompts = [
            {
              when: (response) => {
                  return this.existingProject;
              },
              type: 'confirm',
              name: 'useConfig',
              message: 'Would you like to use saved configuration (.yo-rc.json file) ?',
              default: true
            },
            {
              when: (response) => {
                  return !response.useConfig;
              },
    	      type: 'input',
    		  name: 'name',
    		  message: 'Your project name (one word, no space or special characters) :',
    		  default: this.appname,
              validate: function (input) {
                  return nameRegex.test(input) ? true : 'Please use valid name (' + nameRegex + ')';
              },
            }, {
              when: (response) => {
                  return !response.useConfig;
              },
              type: 'input',
              name: 'description',
              message: 'Your project description :',
              default: 'Spring boot with Angular 4 project'
            }, {
              when: (response) => {
                  return !response.useConfig;
              },
              type: 'input',
              name: 'groupId',
              message: 'Your maven group id :',
              default: 'com.company'
            }, {
              when: (response) => {
                  return !response.useConfig;
              },
              type: 'input',
              name: 'artifactId',
              message: 'Your maven artifact id :',
              default: this.appname
            }, {
              when: (response) => {
                  return !response.useConfig;
              },
              type: 'input',
              name: 'version',
              message: 'Your maven project version :',
              default: '1.0.0-SNAPSHOT'
            }, {
              when: (response) => {
                  return !response.useConfig;
              },
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
                return response.springboot && response.pluginsAnswer.indexOf('security') > -1;
            },
            type: 'list',
            name: 'auth',
            choices: [{ name : 'Basic', value: 'basic' }, { name : 'Oauth', value: 'oauth' }],
            message: 'Authentication : '
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
                return response.angular && response.pluginsAngularAnswer.indexOf('translate') > -1;
            },
            type: 'checkbox',
            name: 'languagesAnswer',
            choices: this.languagesChoice,
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

        if(this.options.force){
            if(this.existingProject){
                this.log('> Generation forced - using existing configuration (.yo-rc.json file)\n');
                this.props = this.config.getAll();
                return;
            } else {
                this.log(chalk.bold.red('> Cannot force project : no existing configuration (.yo-rc.json file)\n'));
                process.exit(1);
            }
        }

        return this.prompt(prompts).then((answers) => {
            if(answers.useConfig){
                this.props = this.config.getAll();
            } else {
                this.props = answers;
                // if never asked !
                this.props.angular = answers.angular || false;
                this.props.generateSql = answers.generateSql || false;
                this.props.report = answers.report || false;

                this.props.plugins = {};
                if(this.props.springboot){
                    for(var i in this.pluginsChoice){
                        this.props.plugins[this.pluginsChoice[i].value] = answers.pluginsAnswer.indexOf(this.pluginsChoice[i].value) > -1;
                    }
                }

                if(this.props.angular){
                    for(var i in this.pluginsAngularChoice){
                        this.props.plugins[this.pluginsAngularChoice[i].value] = answers.pluginsAngularAnswer.indexOf(this.pluginsAngularChoice[i].value) > -1;
                    }
                }

                if(this.props.angular && this.props.plugins.translate){
                    this.props.languages = {};
                    this.props.languagesXlfConf = '["en"';
                    this.props.localesForNavComponent = '[{locale:\'en\', translation: \'English\'}';

                    for(var i in this.languagesChoice){
                        this.props.languages[this.languagesChoice[i].value] = answers.languagesAnswer.indexOf(this.languagesChoice[i].value) > -1;
                        this.props.languagesXlfConf += ', "' + this.languagesChoice[i].value + '"';
                        this.props.localesForNavComponent += ', {locale:\'' + this.languagesChoice[i].value + '\', translation: \'' + this.languagesChoice[i].name + '\'}';
                    }

                    this.props.languagesXlfConf += ']';
                    this.props.localesForNavComponent += ']';
                }

                this.props.nameCap = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
                this.props.nameLow = answers.name.toLowerCase();
                this.props.package = answers.groupId + '.' + this.props.nameLow;
                this.props.packagePath = answers.groupId.replace(/\./g, '/') + '/' + this.props.nameLow;
                this.props.port = this.options.port;

                this.config.set(answers);
                this.config.save();
            }
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
        this.template('_README.md', 'README.md');

        if(this.props.angular){
            this.template('_package.json', 'package.json');
            this.template('_tslint.json', 'tslint.json');
        }

        this.template('src/main/asciidoc/_index.adoc', 'src/main/asciidoc/index.adoc');
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

        if (this.props.springboot) {
            this.template('src/main/java/_Application.java', javaDir + '/' + classPrefix + 'Application.java');
            this.template('src/test/java/_ApplicationTest.java', javaTestDir + '/' + classPrefix + 'ApplicationTest.java');
            this.template('src/main/java/_CustomLoggingListener.java', javaDir + '/CustomLoggingListener.java');
            this.template('src/main/java/config/_Properties.java', javaDir + '/config/' + classPrefix + 'Properties.java');

            this.template('src/main/resources/_application-dev.properties', 'src/main/resources/application-dev.properties');

            this.template('src/main/java/web/_Controller.java', javaDir + '/web/' + classPrefix + 'Controller.java');

            this.copy('src/test/resources/logback-test.xml', 'src/test/resources/logback-test.xml');

            if (this.props.plugins.security) {
                this.template('src/main/java/config/_SecurityConfiguration.java', javaDir + '/config/SecurityConfiguration.java');
                this.template('src/main/java/config/_FrontBasicAuthenticationEntryPoint.java', javaDir + '/config/FrontBasicAuthenticationEntryPoint.java');

                if(this.props.auth === 'oauth'){
                    this.template('src/main/java/config/oauth/_CorsEnabledConfiguration.java', javaDir + '/config/oauth/CorsEnabledConfiguration.java');
                    this.template('src/main/java/config/oauth/_Oauth2Configuration.java', javaDir + '/config/oauth/Oauth2Configuration.java');
                }
            }

            if(this.props.plugins.jpa){
                this.template('src/main/java/jpa/_Entity.java', javaDir +'/jpa/' + classPrefix + 'Entity.java');
                this.template('src/main/java/jpa/_Repository.java', javaDir +'/jpa/' + classPrefix + 'Repository.java');
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

            // java
            this.template('src/main/java/config/_WebMvcConfiguration.java', javaDir + '/config/WebMvcConfiguration.java');

            this.template('src/main/resources/public/_index.html', 'src/main/resources/public/index.html');
            this.template(staticDir + '_index.html', staticDir + 'index.html');

            this.template(staticDir + 'config/_webpack.dev.js', staticDir + 'config/webpack.dev.js');

            this.template(staticDir + '_main.ts', staticDir + 'main.ts');
            this.template(staticDir + 'app/_app.module.ts', staticDir + 'app/app.module.ts');
            this.template(staticDir + 'app/_app-routing.module.ts', staticDir + 'app/app-routing.module.ts');
            this.template(staticDir + 'app/services/_actuator.service.ts', staticDir + 'app/services/actuator.service.ts');
            this.template(staticDir + 'app/services/_notification.service.ts', staticDir + 'app/services/notification.service.ts');
            this.template(staticDir + 'app/services/_api.service.ts', staticDir + 'app/services/api.service.ts');
            this.template(staticDir + 'app/services/_http.service.ts', staticDir + 'app/services/http.service.ts');
            this.template(staticDir + 'app/directives/_raw.directive.ts', staticDir + 'app/directives/raw.directive.ts');
            this.template(staticDir + 'app/components/_metrics.component.ts', staticDir + 'app/components/metrics.component.ts');
            this.template(staticDir + 'app/components/_metrics.component.html', staticDir + 'app/components/metrics.component.html');
            this.template(staticDir + 'app/components/_home.component.ts', staticDir + 'app/components/home.component.ts');
            this.template(staticDir + 'app/components/_home.component.html', staticDir + 'app/components/home.component.html');
            this.template(staticDir + 'app/components/_nav.component.ts', staticDir + 'app/components/nav.component.ts');
            this.template(staticDir + 'app/components/_nav.component.html', staticDir + 'app/components/nav.component.html');

            if (this.props.plugins.security) {
                this.template(staticDir + 'app/beans/_user.ts', staticDir + 'app/beans/user.ts');
                this.template(staticDir + 'app/services/_user.service.ts', staticDir + 'app/services/user.service.ts');
                this.template(staticDir + 'app/services/_auth-routing.service.ts', staticDir + 'app/services/auth-routing.service.ts');
                this.template(staticDir + 'app/components/_user.component.ts', staticDir + 'app/components/user.component.ts');
                this.template(staticDir + 'app/components/_user.component.html', staticDir + 'app/components/user.component.html');
                this.template(staticDir + 'app/components/_login.component.ts', staticDir + 'app/components/login.component.ts');
                this.template(staticDir + 'app/components/_login.component.html', staticDir + 'app/components/login.component.html');
            }

            if(this.props.plugins.custo){
                this.template(staticDir + 'app/services/_custo.service.ts', staticDir + 'app/services/custo.service.ts');
                this.template(staticDir + 'app/components/_custo.component.ts', staticDir + 'app/components/custo.component.ts');
                this.template(staticDir + 'app/components/_custo.component.html', staticDir + 'app/components/custo.component.html');
                // client example
                this.copy('src/clients', 'src/clients', skipTemplates);
            }

            if(this.props.report){
                this.template(staticDir + 'app/beans/_timer.ts', staticDir + 'app/beans/timer.ts');
            }

            // languages
            if(this.props.plugins.translate) {
                this.template(staticDir + 'app/_i18n-providers.ts', staticDir + 'app/i18n-providers.ts');
                this.template(staticDir + 'app/services/_i18n.service.ts', staticDir + 'app/services/i18n.service.ts');
                this.template(staticDir + 'app/pipes/_translate.pipe.ts', staticDir + 'app/pipes/translate.pipe.ts');
                this.template(staticDir + 'config/_xliffmerge.json', staticDir + 'config/xliffmerge.json');
                this.template(staticDir + '_messages.xlf', staticDir + 'messages.xlf');
                this.template(staticDir + 'locale/_messages.en.xlf', staticDir + 'locale/messages.en.xlf');
                for(var l in this.props.languages){
                    if(this.props.languages[l]){
                        this.template(staticDir + 'locale/_messages.' + l +'.xlf', staticDir + 'locale/messages.' + l +'.xlf');
                    }
                }
            }
        }

        if(this.props.plugins.docker) {
            this.template('src/main/docker/_Dockerfile', 'src/main/docker/Dockerfile');
        }
	}
	install() {
        if(this.props.plugins.translate) {
            var displayedLanguages = 'en';
            if(this.props.languages.length > 0){
                displayedLanguages += ', ';
            }
            for(var l in this.props.languages){
                if(this.props.languages[l]){
                    displayedLanguages+= ', ' + l;
                }
            }
        }

        this.log('--------------------------------------------------------------------------------------------------------------------------');
        this.log(' |_ name       : ' + this.props.nameCap);
        this.log(' |_ groupId    : ' + this.props.groupId);
        this.log(' |_ artifactId : ' + this.props.artifactId);
        this.log(' |_ version    : ' + this.props.version);
        this.log(' |_ package    : ' + this.props.package);
        this.log(' |_ http port  : '+ this.props.port);
        if(this.props.plugins.translate) {
            this.log(' |_ languages  :', displayedLanguages);
        }
		this.log('--------------------------------------------------------------------------------------------------------------------------');
		this.log('All done, run "mvn clean install" to compile and download dependencies');
		this.log('--------------------------------------------------------------------------------------------------------------------------');
	}
};
