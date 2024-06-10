const { BskyAgent, RichText } = require('@atproto/api');
const config = require('../config/config');

const agent = new BskyAgent({
    service: config.bskyUrl
});

let jwt;
let did;

const connectClients = async () => {
    console.log('[CONN] Connecting to Bluesky…');
    const res = await agent.login({
        identifier: config.identifier,
        password: config.password,
    });
    if (res.success) {
        console.log('[CONN] Connection to Bluesky acquired.');
        jwt = res.data.accessJwt;
        did = res.data.did;
    }
};

const postMessage = async (text) => {
    console.log('[POST] Publishing message on Bluesky…');
    const rt = new RichText({
        text,
    });

    await rt.detectFacets(agent);

    const response = await agent.post({
        text: `[BOT] \n\n\n${rt.text}`,
        facets: rt.facets,
        createdAt: new Date().toISOString()
    });
    console.log('[SUCCESS] Message published on Bluesky.');

    // Return the URI
    return response;
};

module.exports = {
    connectClients,
    postMessage,
    getAgent: () => agent,
    getJwt: () => jwt,
    getDid: () => did
};
