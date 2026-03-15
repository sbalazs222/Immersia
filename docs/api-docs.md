# /auth

## /login

#### Request: 
```
{
  'email': string
  'password': string
}
```

### Response:

```
{
  'message': string
  'data': {
    'role': number
  }
}
```
### Message
SUCCESS > Successful login\
INVALID_CREDENTIALS > Password or username invalid\
ACCOUNT_DISABLED > Account is disabled\
ACCOUNT_NOT_VERIFIED > Account email verification did not happen

### Role
0 > Admin\
1 > User

## /register

### Request: 
```
{
  'email': string
  'password': string
}
```

### Response:

```
{
  'message': string
  'data': {
    'role': number
  }
}
```
### Message
SUCCESS > Successful register\
USER_EXISTS > Account with email exists\
INCORRECT_EMAIL > Provided email in incorrect format\
INCORRECT_PASSWORD > Password not up to requirements

## /refresh

### Request: 
```
{ }
```

### Response:

```
{
  'message': string
}
```
### Message
SUCCESS > Successful refresh\
NO_REFRESH_TOKEN > No refresh token provided\
INVALID_REFRESH_TOKEN > Provided refresh token invalid\
REFRESH_TOKEN_REVOKED > Refresh token version old\

## /logout
Protected

### Request: 
```
{ }
```

### Response:

```
{ }
```
### Message
SUCCESS > Successful logout\

# /content

## /all
Protected

### Query: 
```
c: kategória
page: kért oldalszám
limit: oldalanként megjelenített hangok
```

### Request: 
```
{ }
```

### Response:
```
{
  message: 'SUCCESS', 
  data: {
    title: string
    slug: string
  } 
  pagination: {
    page: number
    limit: numnber
    total: number
    totalPages: number
  } 
}
```

title > name of the object
slug > unique identifier of the object, used for requests

page > current page\
limit > current limit\
total > number of total sounds\
totalPages: number of total pages

### Message
SUCCESS > Successful retrieval\
INVALID_CATEGORY > Provided category does not exist

## /sounds/:slug
Protected

### Request: 
```
{ }
```

### Response:

```
{
  'message': string
  'data': {
    'slug': string
    'title': string
    'duration_seconds': number
    'loopable': bool
    'type': string
  }
}
```
slug > unique identifier of the object, used for requests\
title > name of the object\
duration_seconds > duration of given sound object\
loopable > is the media loopable\
type > type of the sound ['oneshot', 'ambience', 'scene']

### Message
SUCCESS > Successful \
SOUND_NOT_FOUND > Invalid slug

## /play/:slug

### Request: 
```
{ }
```

### Response:

```
{ }
```
### Message
SUCCESS > Successful \

## /thumb/:slug

### Request: 
```
{ }
```

### Response:

```
{ }
```


# példa
## /

### Request: 
```
{

}
```

### Response:

```
{

}
```
### Message
SUCCESS > Successful \
