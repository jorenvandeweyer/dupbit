# Table of Contents Account
| Call | description |
|------|-------------|
| [POST /account](#post-account) | signup |

# Models

## req.auth

```js
{
    upm: Number, 
    exp: Date,
    iat: Date,
    jti: Number,
    toe: Date,
    uid: Number,
    raw(), //raw token
    destory(), //async //removes session and logs out
    user(), //async //returns user from db
    hasPermissions([perm, ...]) // check if user has certain permission(s)
}
```

# Example fetch

```js
fetch('https://api.dev.dupbit.com/account', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
        username: 'joren',
        email: 'jorenvandewEyer@gmail.com',
        password: 'password',
    }),
    headers: {
        'content-type': 'application/json',
    }
}).then(body => body.json()).then(console.log)
```

# Calls

## Calls /account/...

