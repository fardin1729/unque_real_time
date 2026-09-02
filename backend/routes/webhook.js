const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

module.exports = (io) => {
  router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.META_VERIFY_TOKEN || 'meta_leads_secret_token_12345';

    console.log('Webhook verification request from Meta:', { mode, token });

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully by Meta challenge!');
      return res.status(200).send(challenge);
    } else {
      console.log('Verification failed: Token does not match.');
      return res.status(403).send('Forbidden');
    }
  });

  router.post('/', async (req, res) => {
    const body = req.body;

    res.status(200).send('EVENT_RECEIVED');

    if (body.object === 'page') {
      const entryList = body.entry || [];

      for (let i = 0; i < entryList.length; i++) {
        const changes = entryList[i].changes || [];

        for (let j = 0; j < changes.length; j++) {
          const change = changes[j];

          if (change.field === 'leadgen') {
            const leadValue = change.value || {};
            const leadgenId = leadValue.leadgen_id;

            console.log('Received new leadgen event from Meta! Lead ID:', leadgenId);

            try {
              const leadData = await metaService.fetchLeadDetails(leadgenId, leadValue);
              io.emit('new_lead', leadData);
              console.log('Lead broadcasted to React Native app successfully:', leadData.fullName);
            } catch (err) {
              console.log('Error while processing lead:', err.message);
            }
          }
        }
      }
    }
  });

  return router;
};
