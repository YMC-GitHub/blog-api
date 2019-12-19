# blog-api

## desc

my blog api with nodejs

## qucik start

```sh
# Install dependencies
npm install

# Start the api server(dev)
npm run start

# Start the api server(pro)
npm run  pm2
#or
npm run  koa
#...

```

## add admin user

Add admin http://localhost:4000/api/backend

After the success of the administrator to add, will automatically generate the admin.

Lock file locking, if you need to continue to add, please just delete the file

note:get more details on [api-docs(todos)]().


## the project construtor

```
|--README.md #read me before
|--app.js #the app index file
|--bin #run the app index file
| |--run
| |--www
|--license
|--package.json
|--server
| |--api #some api handle files
| | |--backend-article.js
| | |--backend-category.js
| | |--backend-user.js
| | |--frontend-article.js
| | |--frontend-comment.js
| | |--frontend-like.js
| | |--frontend-user.js
| | |--general.js
| |--config  #some config for cunstom app
| | |--index.js
| | |--mpapp.js
| | |--secret.js
| |--middlewares #some custom middlewares files
| | |--admin.js
| | |--check.js
| | |--return.js
| | |--user.js
| |--models #some data model files
| | |--admin.js
| | |--article.js
| | |--category.js
| | |--comment.js
| | |--user.js
| |--mongoose.js # connect database
| |--routes # map the url path to handle files/functions with router
| | |--backend.js
| | |--frontend.js
| | |--index.js
| |--utils #some useful tool
|--views #some views
|--admin-add.ejs
|--favicon.ico
```


## the lifecricle of the app

- map the url path to handle files/functions with route
- connect database

```
req url->route->model->view->res uri
```

## some custom koa middleware

admin:
```
// ================ admin ================
// this is a custom koa middleware admin
// ================ admin ================
// task:
// check if user is admin:
// 01.need to login first
// 02.need to check the user
// if true,goto next middleware
```

check:
```
// ================ check ================
// this is a custom koa middleware check
// ================ check ================
// task:
// verify the token with some config
```

user:
```
// ================ user ================
// this is a custom koa middleware user
// ================ user ================
// task:
// check if user is user:
// 01.need to login first
// 02.need to check the user
// if true,goto next middleware
```


return:
```
// ================ return ================
// this is a custom koa middleware return
// ================ return ================
// task:
// bind error,success function to ctx to uniform the return result
// and goto next middleware
```
