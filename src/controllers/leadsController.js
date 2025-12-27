const leadService = require('../services/LeadService');

exports.createLead = async (req, res, next) => {
  try {
    const leadData = req.body;
    const newLead = await leadService.createLead(leadData);
    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    next(error);
  }
};

exports.getAllLeads = async (req, res, next) => {
  try {
    // TODO: Add admin check
    const leads = await leadService.getAllLeads(req.query);
    res.status(200).json({ success: true, leads });
  } catch (error) {
    next(error);
  }
};
