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
        email: 'jorenvandeweyer@gmail.com',
        password: 'password',
    }),
    headers: {
        'content-type': 'application/json',
    }
}).then(body => body.json()).then(console.log)
```

# Calls

## Calls /account/...

### POST /account
 
```
username: String
email: String
password: String
```

### POST /account/login

```
username: String
password: String
```

## Calls /calendar/...

### GET /calendar
returns all calendars

### GET /calendar/:calendar
returns calendar with all courses and urls

### POST /calendar
create calendar

```
name: String
```

### POST /calendar/:calendar/url
create url for calendar
```
name: String
value: String
```

### POST /calendar/:calendar/course
create course for calendar
```
name: String
value: String
```

### DELETE /calendar/:calendar
delete calendar

### DELETE /calendar/:calendar/url/:url
delete calendar url

### DELETE /calendar/:calendar/course/:course
delete calendar course
