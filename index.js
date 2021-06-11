'use strict'

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const { jsontransform } = require('./views/helpers/jsontransform')

const start = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    
    const swaggerOptions = {
        info: {
            title: "Test API",
            version: Pack.version
        }
    }

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        helpersPath: './views/helpers'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            return h.view('index', { title: 'Github Search API' });
        }
    });

    server.route({
        method: 'POST',
        path: '/jsontransform',
        options: {
            handler: (request, h) => {
                const payload = request.payload;
                return jsontransform(payload);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri)

    process.on('unhandleRejection', (err) => {
        console.log(err);
        process.exit(1);
    });
}

start();