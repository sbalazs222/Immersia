# /auth

## POST /login 

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

## POST /register

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

## POST /logout
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

## GET /all
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
  'message': 'SUCCESS', 
  'data': {
    'title': string
    'slug': string
    'is_favourite': bool
  } 
  'pagination': {
    'page': number
    'limit': numnber
    'total': number
    'totalPages': number
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

## GET /sounds/:slug
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

## GET /play/:slug

### Request: 
```
{ }
```

### Response:

```
{ }
```

## GET /thumb/:slug

### Request: 
```
{ }
```

### Response:

```
{ }
```


# /fav
## POST /

### Request: 
```
{
  'slug': string
}
```

### Response:

```
{
  'message': string
}
```
### Message

SUCCESS > successful add or remove

## GET /

### Request: 
```
{ }
```

### Response:

```
{
  'message': string
  'data': [
    'slug': string,
    'title': string
  ]
}
```
### Message

SUCCESS > successful retrieval

# példa
## /

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
