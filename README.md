# NYX

##Smart Download Manager

Web application runs by nodejs. ExpressJS framework use for rapid development.

To run,

On MacOS or Linux, run the app with this command:

    npm install
    DEBUG=myapp:* npm start

On Windows, use this command:

    npm install
    set DEBUG=myapp:* & npm start

Then load http://localhost:3000/ in your browser to access the app.

Run aria2c with rpc config.

    aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all --rpc-secret=#####
