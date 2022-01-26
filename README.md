# FEO Portal 



## Build Setup
Environ
create file `.env` from `.env.example`
```
#local or dev or production
APP_ENV=local
# API connection
#host Eg: evoucher.feo.com.sg
API_HOST=http://192.168.50.132
APP_BASE_URL=http://192.168.50.132
#Port API  (default: 80)
API_PORT=8990
#Proxy (if nuxt deploy same server with API domain please set proxy) #true or false
API_PROXY=true
API_PROXY_URL=192.168.50.132
API_PROXY_PORT=8990
API_PROXY_PREFIX=api
#Prefix
API_PREFIX=api
API_HTTPS=false

#Please add file to config path
SAML_IDP_META_PATH=/saml/local/onelogin_metadata_973215.xml
SAML_SP_META_PATH=/saml/local/onelogin_metadata_973215.xml
```

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
