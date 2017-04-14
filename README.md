# Anguboot

> Yeoman generator for a complete Spring-Boot project with Angular application

## What's in it

### Back

Module | Details
--- | ---
`Spring boot` | -
`Spring web` | -
`Spring data jpa` | -
`Spring security ` | (basic)
`Spring actuator` | -
`Spring rest doc` | -
`Junit` | With spring boot runner
`Docker` | Build an docker image ready to use

### Front

Module | Details
--- | ---
`Angular` | -
`Angular translate` | -
`Angular ui bootstrap` | -
`UI router` | -
`Bootstrap` | -
`Karma` | For js unit tests
`Browser Sync` | Browser auto-reload

## What's coming

* ?

## Installation

## Requirements

```bash
$ npm install -g yo
$ npm install -g gulp-cli
```

### Npm

```bash
$ npm install -g generator-anguboot
```

### Manual

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
