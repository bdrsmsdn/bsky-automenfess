const { RichText } = require('@atproto/api');
const axios = require('axios');
const { getJwt, getAgent } = require('./bskyServices');

const getLastConvo = async () => {
    console.log('[MSG] Getting last message');
    try {
        const response = await axios.get('https://boletus.us-west.host.bsky.network/xrpc/chat.bsky.convo.listConvos', {
            headers: {
                'Authorization': `Bearer ${getJwt()}`,
                'Atproto-proxy': 'did:web:api.bsky.chat#bsky_chat'
            }
        });
        const unreadConvos = response.data.convos.filter((item) => item.unreadCount > 0);
        return unreadConvos;
    } catch (err) {
        console.log(err);
    }
};

const updateRead = async (id) => {
    await axios.post('https://boletus.us-west.host.bsky.network/xrpc/chat.bsky.convo.updateRead', {
        convoId: id,
    }, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`,
            'Atproto-proxy': 'did:web:api.bsky.chat#bsky_chat'
        }
    });
};

const sendMessage = async (id, text) => {
    const rt = new RichText({
        text,
    });
    await rt.detectFacets(getAgent);
    // if(status != 'sucess'){
        await axios.post('https://boletus.us-west.host.bsky.network/xrpc/chat.bsky.convo.sendMessage', {
            convoId: id,
            message: {
                text: rt.text,
                facets: rt.facets,
            }
        }, {
            headers: {
                'Authorization': `Bearer ${getJwt()}`,
                'Atproto-proxy': 'did:web:api.bsky.chat#bsky_chat'
            }
        });
    // } else {
    //     await axios.post('https://boletus.us-west.host.bsky.network/xrpc/chat.bsky.convo.sendMessage', {
    //         convoId: id,
    //         message: {
    //             text: rt.text,
    //             facets: [
    //                 {
    //                   index: {
    //                     byteStart: 31,
    //                     byteEnd: 34
    //                   },
    //                   features: [{
    //                     $type: 'app.bsky.richtext.facet#link',
    //                     uri
    //                   }]
    //                 }
    //               ],
    //         }
    //     }, {
    //         headers: {
    //             'Authorization': `Bearer ${getJwt()}`,
    //             'Atproto-proxy': 'did:web:api.bsky.chat#bsky_chat'
    //         }
    //     });
    // }
};

module.exports = {
    getLastConvo,
    updateRead,
    sendMessage
};
