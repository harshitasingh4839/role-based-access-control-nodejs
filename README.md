
# Role Based Access Control

This is a Role Based Acces Control application using Nodejs, Expressjs, PassportJs, etc. This project has the implementation of both authentication and authorization. For authentication we have used Email & Password. The application is based on the MVC pattern i.e. Model View Controller. Mongoose is used as an ORM for MongoDB for storing Users in Database. Passport JS is used for local(email, password) authentication.


## To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/harshitasingh4839/role-based-access-control-nodejs
```

Step 2: cd into the cloned repo and run

```bash
npm install
```

Step 3: Put your credentials in the .env file.
```bash
PORT=3000
MONGODB_URI=YOUR_MONGODB_URI(example: mongodb://localhost:27017)
DB_NAME=YOUR_DB_NAME
```

Step 4: Install MongoDB
See https://docs.mongodb.com/manual/installation/ for more infos

Step 5: Start the app
```bash
npm start
```





