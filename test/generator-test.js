var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

var path = require('path');

var defaultFiles = [
  '.yo-rc.json', '.gitignore', 'pom.xml', 'README.md', 'src/main/assembly/assembly.xml', 
  'src/main/filters/dev.properties', 'src/main/filters/delivery.properties', 'src/main/asciidoc/index.adoc',
  'src/main/java/com/company/anguboot/exception/AngubootApplicativeException.java', 
  'src/main/java/com/company/anguboot/exception/AngubootTechnicalException.java'
];
var noSpringBootFiles = [
  'src/main/config/config.xml',
  'src/main/java/com/company/anguboot/AngubootMain.java',
  'src/test/java/com/company/anguboot/AngubootMainTest.java'
];
var springBootFiles = [
  'src/main/config/application.conf', 'src/main/config/application.yml', 'src/main/resources/application.yml',
  'src/main/resources/application-dev.properties', 'src/test/resources/logback-test.xml',
  'src/main/resources/banner.txt', 'src/main/resources/logback-spring.xml',
  'src/main/java/com/company/anguboot/AngubootApplication.java',
  'src/main/java/com/company/anguboot/CustomLoggingListener.java',
  'src/test/java/com/company/anguboot/AngubootApplicationTest.java',
  'src/main/java/com/company/anguboot/web/AngubootController.java',
  'src/main/java/com/company/anguboot/config/AngubootProperties.java'
];
var angularFiles = [
  'src/main/web/', 'tslint.json', 'package.json', 'src/main/resources/public/index.html',
  'src/main/web/main.ts', 'src/main/web/polyfills.ts', 'src/main/web/vendor.ts', 'src/main/java/com/company/anguboot/config/WebMvcConfiguration.java',
  'src/main/web/index.html', 'src/main/web/tsconfig.json',
  'src/main/web/config/helpers.js', 'src/main/web/config/karma-test-shim.js', 'src/main/web/config/karma.conf.js',
  'src/main/web/config/webpack.common.js', 'src/main/web/config/webpack.dev.js', 'src/main/web/config/webpack.prod.js',
  'src/main/web/config/webpack.test.js', 'src/main/web/assets/',
  
  'src/main/web/app/app-routing.module.ts', 'src/main/web/app/app.component.ts', 'src/main/web/app/app.module.ts',
  'src/main/web/app/constants.ts',

  'src/main/web/app/beans/dump.ts', 'src/main/web/app/beans/error.ts', 'src/main/web/app/beans/loggers.ts', 'src/main/web/app/beans/env.ts',
  'src/main/web/app/beans/table.ts', 'src/main/web/app/beans/trace.ts', 'src/main/web/app/beans/audit.ts', 'src/main/web/app/beans/beans.ts',
  
  'src/main/web/app/components/contact.component.ts', 'src/main/web/app/components/contact.component.html',
  'src/main/web/app/components/health.component.ts', 'src/main/web/app/components/health.component.html',
  'src/main/web/app/components/home.component.ts', 'src/main/web/app/components/home.component.html',
  'src/main/web/app/components/loggers.component.ts', 'src/main/web/app/components/loggers.component.html',
  'src/main/web/app/components/metrics.component.ts', 'src/main/web/app/components/metrics.component.html',
  'src/main/web/app/components/nav.component.ts', 'src/main/web/app/components/nav.component.html',
  'src/main/web/app/components/contact.component.ts', 'src/main/web/app/components/contact.component.html',
  'src/main/web/app/components/dump.component.ts', 'src/main/web/app/components/dump.component.html',
  'src/main/web/app/components/trace.component.ts', 'src/main/web/app/components/trace.component.html',
  'src/main/web/app/components/audit.component.ts', 'src/main/web/app/components/audit.component.html',
  'src/main/web/app/components/beans.component.ts', 'src/main/web/app/components/beans.component.html',
  'src/main/web/app/components/env.component.ts', 'src/main/web/app/components/env.component.html',
  'src/main/web/app/components/mappings.component.ts', 'src/main/web/app/components/mappings.component.html',

  'src/main/web/app/directives/confirm.directive.ts', 'src/main/web/app/directives/raw.directive.ts', 'src/main/web/app/directives/spinner.directive.ts',
  'src/main/web/app/directives/table.directive.ts', 'src/main/web/app/directives/check.directive.ts',

  'src/main/web/app/pipes/filter.pipe.ts', 'src/main/web/app/pipes/size.pipe.ts', 'src/main/web/app/pipes/time.pipe.ts',

  'src/main/web/app/services/actuator.service.ts', 'src/main/web/app/services/api.service.ts', 'src/main/web/app/services/mock.service.ts',,
  'src/main/web/app/services/http.service.ts', 'src/main/web/app/services/logger.service.ts', 'src/main/web/app/services/util.service.ts',
  'src/main/web/app/services/notification.service.ts', 'src/main/web/app/services/spinner.service.ts'
];
var angularCustoFiles = [
  'src/clients/',
  'src/main/web/app/components/custo.component.ts', 'src/main/web/app/components/custo.component.html',
  'src/main/web/app/services/custo.service.ts'
];
var dockerFiles = ['src/main/docker/Dockerfile'];
var restDocFiles = ['src/main/asciidoc/rest-api.adoc'];
var securityFiles = [
  'src/main/java/com/company/anguboot/config/SecurityConfiguration.java', 'src/main/java/com/company/anguboot/config/FrontBasicAuthenticationEntryPoint.java'
];
var angularSecurityFiles = [
  'src/main/web/app/components/login.component.ts', 'src/main/web/app/components/login.component.html',
  'src/main/web/app/components/user.component.ts', 'src/main/web/app/components/user.component.html',
  'src/main/web/app/components/user.component.ts', 'src/main/web/app/components/user.component.html',
  'src/main/web/app/services/auth-routing.service.ts', 'src/main/web/app/services/user.service.ts',
  'src/main/web/app/beans/user.ts'
];
var oauthFiles = ['src/main/java/com/company/anguboot/config/oauth/CorsEnabledConfiguration.java',
  'src/main/java/com/company/anguboot/config/oauth/Oauth2Configuration.java'];
var reportFiles = [
  'src/main/java/com/company/anguboot/jpa/Timer.java', 'src/main/java/com/company/anguboot/jpa/TimerRepository.java',
  'src/main/java/com/company/anguboot/metrics/DatabaseReporter.java',
  'src/main/java/com/company/anguboot/metrics/MetricsConfiguration.java', 'src/main/java/com/company/anguboot/metrics/MetricsController.java'
];
var angularReportFiles = ['src/main/web/app/beans/timer.ts'];
var angularTranslateFiles = ['src/main/web/messages.xlf', 'src/main/web/app/i18n-providers.ts','src/main/web/config/xliffmerge.json',
'src/main/web/app/services/i18n.service.ts', 'src/main/web/app/pipes/translate.pipe.ts'];
var jpaFiles = ['src/main/java/com/company/anguboot/jpa/AngubootEntity.java','src/main/java/com/company/anguboot/jpa/AngubootRepository.java'];

describe('Tests without springboot or angular >', function() {
  describe('Minimal options', function() {
    beforeEach(function () {
      return buildGenerator(false, false, {
        'pluginsAnswer': [],
        'languagesAnswer': [],
        'pluginsAngularAnswer': []
      });
    })
    it('Should create files and contain some content', function() {
      assertNoSpringBoot();
      assertOptions();
      assertAngularOptions();
    });
  });
});

describe('Tests with spring boot >', function() {

  const options = [
    [], ['security'], ['restDoc'], ['docker'], ['jpa'], ['security','restDoc','docker','jpa']
  ];

  options.forEach((option) => {
    describe('Options : < '+ option.toString() + ' >', function() {
      beforeEach(function () {
        return buildGenerator(true, false, {
          'report': false,
          'generateSql': false,
          'pluginsAnswer': option,
          'languagesAnswer': [],
          'pluginsAngularAnswer': []
        });
      })
      it('Should create files and contain some content', function() {
        assertSpringBoot();
        assertOptions(option);
        assertAngularOptions();
      });
    });
  });
});

describe('Tests with spring boot, oauth, reports and sql generation >', function() {

  const options = [
    [], ['security'], ['restDoc'], ['docker'], ['jpa'], ['security','restDoc','docker','jpa']
  ];

  options.forEach((option) => {
    describe('Options : < '+ option.toString() + ' >', function() {
      beforeEach(function () {
        return buildGenerator(true, false, {
          'report': true,
          'generateSql': true,
          'pluginsAnswer': option,
          'languagesAnswer': [],
          'pluginsAngularAnswer': []
        }, 'oauth');
      })
      it('Should create files and contain some content', function() {
        assertSpringBoot();
        assertOptions(option, true, true, 'oauth');
        assertAngularOptions();
      });
    });
  });
});

describe('Tests with spring boot and angular >', function() {

  var options = [
    [], ['custo'], ['ace'], ['translate'], ['custo','ace','translate'] 
  ];

  options.forEach((option) => {
    describe('Options : < '+ option.toString() + ' >', function() {
      beforeEach(function () {
        return buildGenerator(true, true, {
          'report': false,
          'generateSql': false,
          'pluginsAnswer': [],
          'languagesAnswer': [],
          'pluginsAngularAnswer': option
        });
      })
      it('Should create files and contain some content', function() {
        assertAngular();
        assertOptions();
        assertAngularOptions(option, false, false, ['en']);
      });
    });
  });
});

describe('Tests with spring boot and angular, security and report and languages >', function() {

  var options = [
    [], ['custo'], ['ace'], ['translate'], ['custo','ace','translate'] 
  ];

  options.forEach((option) => {
    describe('Options : < '+ option.toString() + ' >', function() {
      beforeEach(function () {
        return buildGenerator(true, true, {
          'report': true,
          'generateSql': false,
          'pluginsAnswer': ['security','jpa'],
          'languagesAnswer': ['fr'],
          'pluginsAngularAnswer': option
        });
      })
      it('Should create files and contain some content', function() {
        assertAngular();
        assertOptions(['security','jpa'], true);
        assertAngularOptions(option, true, true, ['fr', 'en']);
      });
    });
  });
});

function buildGenerator(springboot, angular, prompts, auth){
  var useAuth = auth || auth;
  Object.assign(prompts, {'name': 'anguboot','artifactId': 'anguboot', 'springboot': springboot, 'angular': angular, 'auth': auth});
  return helpers.run(path.join(__dirname, '../app'))
      .withOptions({force: false, port: 8765})
      .withArguments([])
      .withPrompts(prompts); 
}

function assertNoSpringBoot(){
  assert.file(defaultFiles);
  assert.file(noSpringBootFiles);
  assert.noFile(springBootFiles);
  assert.noFile(angularFiles);
  assert.noFileContent('pom.xml', /spring-boot/);
  assert.noFileContent('pom.xml', /npm/);
}

function assertSpringBoot(){
  assert.file(defaultFiles);
  assert.noFile(noSpringBootFiles);
  assert.file(springBootFiles);
  assert.noFile(angularFiles);
  assert.fileContent('pom.xml', /spring-boot/);
  assert.noFileContent('pom.xml', /npm/);
}

function assertAngular(){
  assert.file(defaultFiles);
  assert.noFile(noSpringBootFiles);
  assert.file(springBootFiles);
  assert.file(angularFiles);
  assert.file(angularFiles);
  assert.fileContent('pom.xml', /npm/);
}

function assertOptions(options, report, generateSql, auth){
  if(options && options.indexOf('docker') > -1){
    assert.file(dockerFiles);
    assert.fileContent('pom.xml', /docker/);
  } else {
    assert.noFile(dockerFiles);
    assert.noFileContent('pom.xml', /docker/);
  }
  if(options && options.indexOf('security') > -1){
    assert.file(securityFiles);
    if(auth === 'oauth'){
      assert.file(oauthFiles);
    } else {
      assert.noFile(oauthFiles);
    }
  } else {
    assert.noFile(securityFiles);
    assert.noFile(oauthFiles);
  }
  if(options && options.indexOf('jpa') > -1){
    assert.file(jpaFiles);
    assert.fileContent('pom.xml', /mysql/);
    assert.fileContent('pom.xml', /spring-boot-starter-data-jpa/);

    if(generateSql){
      assert.fileContent('pom.xml', /hibernate-maven-plugin/);
    } else {
      assert.noFileContent('pom.xml', /hibernate-maven-plugin/);
    }
    if(report){
      assert.file(reportFiles);
    } else {
      assert.noFile(reportFiles);
    }
  } else {
    assert.noFile(jpaFiles);
    assert.noFileContent('pom.xml', /mysql/);
    assert.noFileContent('pom.xml', /spring-boot-starter-data-jpa/);
    assert.noFileContent('pom.xml', /hibernate-maven-plugin/);
    assert.noFile(reportFiles);
  }
  if(options && options.indexOf('restDoc') > -1){
    assert.file(restDocFiles);
    assert.fileContent('pom.xml', /spring-restdocs-mockmvc/);
  } else {
    assert.noFile(restDocFiles);
    assert.noFileContent('pom.xml', /spring-restdocs-mockmvc/);
  }
}

function assertAngularOptions(options, report, security, languages){
  if(options && options.indexOf('custo') > -1){
    assert.file(angularCustoFiles);
  } else {
    assert.noFile(angularCustoFiles);
  }
  if(options && options.indexOf('translate') > -1){
    assert.file(angularTranslateFiles);
    assert.fileContent('src/main/web/main.ts', /getTranslationProviders/);
    assert.fileContent('src/main/web/app/app.module.ts', /I18nService/);
    assert.fileContent('src/main/web/app/app.module.ts', /TranslatePipe/);
    if(languages){
      for(var i in languages){
        assert.file(['src/main/web/locale/messages.' + languages[i] + '.xlf']);
      }
    } else {
      assert.noFile(['src/main/web/locale/messages.fr.xlf','src/main/web/locale/messages.es.xlf','src/main/web/locale/messages.en.xlf']);
    }
  } else {
    assert.noFile(angularTranslateFiles);
    assert.noFile(['src/main/web/locale/messages.fr.xlf','src/main/web/locale/messages.es.xlf','src/main/web/locale/messages.en.xlf']);
    if(options){
      assert.noFileContent('src/main/web/main.ts', /getTranslationProviders/);
      assert.noFileContent('src/main/web/app/app.module.ts', /I18nService/);
      assert.noFileContent('src/main/web/app/app.module.ts', /TranslatePipe/);
    }
  }
  if(options && options.indexOf('ace') > -1){
      assert.fileContent('package.json', /ace/);
      assert.fileContent('src/main/web/app/app.module.ts', /Ace/);
      assert.fileContent('src/main/web/app/directives/raw.directive.ts', /ace/);
  } else {
    if(options){
      assert.noFileContent('package.json', /ace/);
      assert.noFileContent('src/main/web/app/app.module.ts', /Ace/);
      assert.noFileContent('src/main/web/app/directives/raw.directive.ts', /ace/);
    }
  }
  if(security){
    assert.file(angularSecurityFiles);  
  } else {
    assert.noFile(angularSecurityFiles);
  }
  if(report){
    assert.file(angularReportFiles);
    assert.fileContent('src/main/web/app/components/metrics.component.ts', /graph/);
    assert.fileContent('src/main/web/app/services/actuator.service.ts', /timers()/);
    assert.fileContent('src/main/web/app/components/metrics.component.html', /Services over time/);
  } else {
    assert.noFile(angularReportFiles);
    if(options){
      assert.noFileContent('src/main/web/app/components/metrics.component.ts', /graph/);
      assert.noFileContent('src/main/web/app/services/actuator.service.ts', /timers()/);
      assert.noFileContent('src/main/web/app/components/metrics.component.html', /Services over time/);
    }
  }
}