# Auth Demo
By Sachindra Ariyasinghe

A simple MEAN stack application that demonstrates Two-Factor Authentication with [Authy](https://www.twilio.com/authy).

&nbsp;
#### Building Locally
[NodeJS](https://nodejs.org/) version 6+ is required for ES6 support.

* Clone the repository and navigate to the source folder.
    ```sh
    $ git clone https://github.com/sachie/auth-demo.git
    $ cd auth-demo/src/
    ```
    
* Install the dependencies and devDependencies.
    ```sh
    $ npm install -d
    ```
    
* Build the site and start the server.
    ```sh
    $ npm run build
    $ npm start
    ```
* Visit [http://localhost:8000](http://localhost:8000).

For easy deployment, sandbox keys for the Mongo database, at [mLab](https://mlab.com/), and Authy API have been commited with the code.

&nbsp;
#### Development

A gulp watch task is available for automatic building on file changes.
```sh
npm run dev
```

If a new database address or Authy API key is to be used, update the values in `src/configs/index.js`.

&nbsp;
#### Dev Information

Details about the application and the development decisions made are explained here.
Code comments are available in all files for futher analysis.

##### Dependencies

NPM is used as the package manager for the app.
The dependencies have been seperated into `devDependencies`, which include modules for the gulp build tasks and lint checking, and normal `dependencies`, which include modules for the angular and express apps.

##### Gulp Tasks

Gulp tasks are available for building html views, javascript files and sass files, checking for lint errors with [Eslint](http://eslint.org/) and cleaning the output folder.
[Browserify](http://browserify.org/) has been used to build the angular app as it allows a clean require() syntax and efficiently bundles the required files.

##### Project Structure

The project contains the following folder structure:
* `.build` - Output folder for build tasks. (git-ignored)
* `api` - API routes. (eg: User API)
* `auth` - Routes and strategies for authentication.
* `configs` - Config files.
* `lib` - Utility modules.
* `middleware` - Addon middleware.
* `models` - Mongoose models with management methods.
* `public` - Frontend app.
    *  `app` - Angular app javascript files. 
        *  `configs` - Angular config modules.
        *  `controllers` - Angular controllers.
        *  `directives` - Angular directives.
        *  `services` - Angular services.
    *  `styles` - Styles for the frontend app.
    *  `views` - HTML views for the frontend app.


##### Authentication
Two step verification has been added to both the login and registration processes. This would ensure security when logging in, and phone number verification when registering. The available verification methods are OneTouch, SoftToken and SMS. When a new user is registering, an authy account will also be created/found for them. Their authy ID will be saved in the database and used for verification requests. A session record is created for each login attempt. Passwords are protected by salted hashing using [bcrypt](https://github.com/kelektiv/node.bcrypt.js) at user creation.

* OneTouch - Once the user fills the login or registration forms with valid data and clicks the submit button, a OneTouch request is created for the user's authy ID. If OneTouch is available, the server responds with a successful status, and the client will wait for approval. An option is available while waiting, to switch to a SoftToken verification. For checking the approval status, two methods are available, a webhook/callback endpoint or polling. As the webhook method will increase local deployment complexity (having to use [ngrok](https://ngrok.com/) to expose the localhost webhook), the polling method has been chosen for this demo.

* SoftToken - If the user has not enabled OneTouch or decides to switch to the SoftToken method, a request is created for the user's authy ID. The user can then type the code from the authy app onto the verification form and submit.

* SMS - If the user has not registered with an authy client, an SMS will be sent to their number with the verification code, which the user can type onto the verification form and submit.

Once logged in, the session token will be stored as a cookie and used for subsequent requests, and the user will be able to see their profile information in the home page. A [Gravatar](http://en.gravatar.com/) image has been added to the profile. Logging out will remove the session cookie and send a session logout request to the server.

##### Design Notes
* All processes on the express app are asynchronous.
* Errors have been handled by responding with accurate HTTP status codes and error messages.
* Asynchronous processes on the client side are indicated with progress spinners.
* The Angular hashbang has been disabled and a catch all route has been added to express which redirects to the website.
* The site has been tested on Google Chrome and Mozilla Firefox.

##### Possible Enhancements
* Adding a country select dropdown for the country code input.
* Set up SSL with [Nginx](https://www.nginx.com/resources/wiki/) and [Lets Encrypt](https://letsencrypt.org/)
