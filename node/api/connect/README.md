# Dupbit Connect API Endpoint

## Endpoint
The new endpoint is:  
`/api/connect/open`

## Method
`POST`
## Body

```json
{
    "tid": 1, 
    "call": "screen/lock",  
    "body": {
       //optional
    }
}
```

`tid`   the token id for the connection  
`call`  call for the connected instance  
`body`  if necessary any other variables needed for the instance 

there can be used any other field in the body sent to the api endpoint, only `tid` and `call` are reserved fields.

The whole body gets passed to the connected instance. 

When the `call` field is not necessary for the instance setting it to true can be hack to bypass the requirements for a call

```json
{
    "tid": 1,
    "call": true
}
```

## Library

The only supported library at the moment is:  
https://github.com/jorenvandeweyer/Dupbit_API_NodeJS 

This library has a built in connection with a websocket too which can be disabled. This way the library can be used for only sending api calls. 

## Notes

Every instance need to use it's own token, using the same token for multiple instances will make the behaviour of the API unpredictable, so it's not supported in any way.
