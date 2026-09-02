const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

module.exports = (io) => {
  router.get('/leads', (req, res) => {
    const leads = metaService.getStoredLeads();
    res.json({
      success: true,
      total: leads.length,
      leads: leads,
    });
  });

  router.post('/test-lead', (req, res) => {
    const lead = metaService.createMockLead(req.body);

    console.log('Manual test lead created:', lead.fullName);

    io.emit('new_lead', lead);

    res.status(201).json({
      success: true,
      message: 'Lead sent to mobile app via socket successfully',
      lead: lead,
    });
  });

  router.get('/health', (req, res) => {
    const totalClients = io.engine ? io.engine.clientsCount : 0;
    res.json({
      status: 'healthy',
      uptime: Math.floor(process.uptime()) + ' seconds',
      connectedClients: totalClients,
    });
  });

  return router;
};
