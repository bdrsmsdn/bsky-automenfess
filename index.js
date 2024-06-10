const cron = require('node-cron');
const { connectClients, postMessage, getDid } = require('./services/bskyServices');
const { getLastConvo, updateRead, sendMessage } = require('./services/chatServices');
const config = require('./config/config');

const main = async () => {
    // await connectClients();
    const unreadConvos = await getLastConvo();
    if (unreadConvos.length > 0) {
        for (let convo of unreadConvos) {
            let txt = convo.lastMessage.text;
            let sender = convo.lastMessage.sender.did;
            if (sender != getDid()) {
                if (txt.includes(config.keyword)) {
                    const post = await postMessage(txt);
                    await updateRead(convo.id);
                    await sendMessage(convo.id, 'Menfess kamu terkirim!')
                } else {
                    console.log('[ERR] keyword tidak ditemukan di convo id', convo.id);
                    await updateRead(convo.id);
                    await sendMessage(convo.id, `[BOT]\n\n\nkeyword salah! gunakan ${config.keyword}`);
                }
            }
        }
    } else {
        console.log('[MSG] There are unread conversations. Message will not be published.');
    }

    }
    
    connectClients();
    setInterval(async () => {
        await main();
    }, 10000);
