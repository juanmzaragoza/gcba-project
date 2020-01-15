# Core

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

Core Library is located in the heart of the project. Every package depends on the Core. 
The Core must not depend on any other packages. I want to explain with an example.

Core can depend on `@ngrx/store` ,`just-compare` , `ngx-context` . 
But can’t depend on our `auth` library.

We will add useful directives, pipes, services, components to the Core. 
The Core Library must contain files that all packages can use. 
This case is important. Otherwise, our Core Library will grow unnecessarily.

## Code scaffolding

Run `ng generate component component-name --project core` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project core`.
> Note: Don't forget to add `--project core` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build core` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build core`, go to the dist folder `cd dist/core` and run `npm publish`.

## Running unit tests

Run `ng test core` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
