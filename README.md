# Anguboot

[![Build Status](https://travis-ci.org/fonimus/anguboot2.svg?branch=master)](https://travis-ci.org/fonimus/anguboot2)

> Yeoman generator for a complete Spring Boot project with Angular 4 application

## What's in it

### Back

Module | Details
--- | ---
`Spring boot` | Version 1.5.2
`Spring web` | -
`Spring data jpa` | -
`Spring security ` | None, Basic, Oauth
`Spring actuator` | -
`Spring rest doc` | Build REST documentation from unit tests
`Junit` | With spring boot runner
`Docker` | Build an docker image ready to use

### Front

Module | Details
--- | ---
`Angular` | Version 4.0.2
`I18n` | Native internationalization support (xliff format)
`Bootstrap` | Bootstrap 4
`Font awesome` | Font awesome 4.7.0, for glyphicons
`Sass` | Sass with bootstrap customization
`Ng Bootstrap` | Bootstrap Angular directives
`Toaster` | Notifications
`Ace` | Ace editor, to display code or even edit
`Customization` | Bootstrap Angular directives

## What's coming

* ?

## Installation

### Requirements

```bash
$ npm install -g yo
$ npm install -g gulp-cli
```

### From Npm

```bash
$ npm install -g generator-anguboot
```

### From sources

```bash
# clone project and go to its root directory
$ npm update && npm link
```

## Generation

```bash
$ mkdir angutest && cd angutest
$ yo anguboot

   /\  _  _    |_  _  _ |_
  /--\| )(_)|_||_)(_)(_)|_  v2.0.0
          _/

? Your project name (one word, no space or special characters) : (angutest)
```

## Development

```bash
$ npm install && npm run watch
# and in another console
$ mvn spring-boot:run
```

## Build

```bash
$ mvn clean install
# test generated jar, using dev filtered configuration in test-classes
$ java -jar target/angutest-executable.jar --spring.config.location=target/test-classes/
```
