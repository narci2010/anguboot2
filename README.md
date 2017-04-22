# Anguboot

[![Build Status](https://travis-ci.org/fonimus/anguboot2.svg?branch=master)](https://travis-ci.org/fonimus/anguboot2)
[![Dependency Status](https://www.versioneye.com/user/projects/58fb201b710da2402c670588/badge.svg)](https://www.versioneye.com/user/projects/58fb201b710da2402c670588)

> Yeoman generator for a complete Spring Boot application with Angular 4

## What's in it

### Back

Module | Details
--- | ---
`Spring boot` | Version 1.5.3
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

## Installation

### Requirements

```bash
$ npm install -g yo
```

### From Npm

```bash
$ npm install -g generator-anguboot2
```

### From sources

```bash
# clone project and go to its root directory
$ npm update && npm link
```

## Generation

```bash
$ mkdir angutest && cd angutest
$ yo anguboot2

   /\  _  _    |_  _  _ |_
  /--\| )(_)|_||_)(_)(_)|_  v2.0.0
          _/

? Your project name (one word, no space or special characters) : (angutest2)
```

## Development

```bash
$ npm install && npm run start
# and in another console
$ mvn spring-boot:run
```

## Build

```bash
$ mvn clean install
$ java -jar target/angutest-executable.jar
```

## What's coming next

???
