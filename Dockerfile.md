## Build

```
docker build . -t transmit-samples:latest
```

## Execute

```
docker run -e SAMPLE=hosted-idv -e TS_REDIRECT_URI=http://localhost:8080/complete -e VITE_TS_CLIENT_ID=**** -e TS_CLIENT_SECRET=**** -p 8080:8080 transmit-samples:latest
```
