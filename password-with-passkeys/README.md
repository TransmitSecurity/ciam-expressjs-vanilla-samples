# Sample template using ViteJS Vanilla

This sample is created using ViteJS vanilla.

It has the following capabilities:
* Simple structure and readable code (currently pages are under the root folder but we can probably refine it as we please in the future)
* Client side access to env variables, provided they start with VITE_ 
  * E.G. `VITE_TEST_VAR` is accessible from js code using `import.meta.env.VITE_TEST_VAR`
* Backend endpoints using express (entry point under /backend/api.js)
  * [Hello example](http://localhost:8080/api/hello)
  * [Todos example](http://localhost:8080/api/todos) (fetching data from external server)
* SCSS support
* HMR (Hot module reloading) support

### App
[http://localhost:8080](http://localhost:8080)

### Setup
```
yarn
```

### Running development
```
yarn dev
```

### Running production
```
yarn build
yarn start 
```
