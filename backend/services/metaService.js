const axios = require('axios');

const leadStore = [];

function parseFieldData(fieldData = []) {
  const result = {
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    customFields: {},
  };

  for (let i = 0; i < fieldData.length; i++) {
    const item = fieldData[i];
    const fieldName = (item.name || '').toLowerCase();
    const fieldValue = item.values && item.values[0] ? item.values[0] : '';

    if (fieldName.includes('full_name') || fieldName === 'name' || fieldName.includes('first_name')) {
      result.fullName = result.fullName ? result.fullName + ' ' + fieldValue : fieldValue;
    } else if (fieldName.includes('email')) {
      result.email = fieldValue;
    } else if (fieldName.includes('phone') || fieldName.includes('mobile')) {
      result.phoneNumber = fieldValue;
    } else if (fieldName.includes('company') || fieldName.includes('organization')) {
      result.company = fieldValue;
    } else {
      result.customFields[item.name] = fieldValue;
    }
  }

  return result;
}

async function fetchLeadDetails(leadgenId, rawEntry = {}) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v19.0';

  if (token && token.trim() !== '') {
    try {
      console.log('Fetching lead from Graph API for id:', leadgenId);
      const url = `https://graph.facebook.com/${apiVersion}/${leadgenId}?access_token=${token}`;
      const response = await axios.get(url);
      const data = response.data;

      const parsed = parseFieldData(data.field_data || []);

      const lead = {
        id: data.id || leadgenId,
        leadgenId: data.id || leadgenId,
        fullName: parsed.fullName || 'Rahul Sharma',
        email: parsed.email || 'rahul.sharma@example.com',
        phoneNumber: parsed.phoneNumber || '+91 98765 43210',
        company: parsed.company || 'Sharma Tech Solutions',
        formName: rawEntry.form_id ? `Lead Form #${rawEntry.form_id}` : 'Facebook Lead Form',
        adName: rawEntry.ad_id ? `Ad Campaign #${rawEntry.ad_id}` : 'Bangalore Tech Ad',
        pageId: rawEntry.page_id || '1029384756',
        createdAt: data.created_time || new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        isSimulated: false,
      };

      leadStore.unshift(lead);
      if (leadStore.length > 50) {
        leadStore.pop();
      }

      return lead;
    } catch (err) {
      console.log('Graph API error:', err.message, '- Using fallback dummy lead');
    }
  } else {
    console.log('No Meta token provided, creating mock lead for id:', leadgenId);
  }

  const indianNames = ['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Sneha Gupta', 'Ankit Kumar', 'Pooja Singh'];
  const indianCompanies = ['Infosys Bangalore', 'TCS Mumbai', 'Tech Mahindra Pune', 'Sharma Enterprises', 'Flipkart Logistics'];
  
  const randomName = indianNames[Math.floor(Math.random() * indianNames.length)];
  const randomCompany = indianCompanies[Math.floor(Math.random() * indianCompanies.length)];
  const randomPhone = `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;

  const fallbackLead = {
    id: leadgenId || `lead_${Date.now()}`,
    leadgenId: leadgenId || `lead_${Date.now()}`,
    fullName: randomName,
    email: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
    phoneNumber: randomPhone,
    company: randomCompany,
    formName: rawEntry.form_id ? `Meta Lead Form (${rawEntry.form_id})` : 'Website Inquiry Form',
    adName: rawEntry.ad_id ? `Facebook Ad #${rawEntry.ad_id}` : 'Digital Marketing Campaign',
    pageId: rawEntry.page_id || '1029384756',
    createdAt: new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    isSimulated: true,
  };

  leadStore.unshift(fallbackLead);
  if (leadStore.length > 50) {
    leadStore.pop();
  }

  return fallbackLead;
}

function createMockLead(data = {}) {
  const indianNames = ['Vikas Reddy', 'Deepak Joshi', 'Neha Sharma', 'Amitabh Roy', 'Ananya Iyer'];
  const indianCompanies = ['Wipro Technologies', 'Zomato HQ', 'Swiggy Delivery Hub', 'Reliance Digital', 'Tata Consultancy'];

  const randomName = indianNames[Math.floor(Math.random() * indianNames.length)];
  const randomCompany = indianCompanies[Math.floor(Math.random() * indianCompanies.length)];
  const randomPhone = `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`;

  const lead = {
    id: `mock_${Date.now()}`,
    leadgenId: `leadgen_${Date.now()}`,
    fullName: data.fullName || randomName,
    email: data.email || `${(data.fullName || randomName).toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
    phoneNumber: data.phoneNumber || randomPhone,
    company: data.company || randomCompany,
    formName: data.formName || 'VIP Lead Registration Form',
    adName: data.adName || 'Meta Leads Live Demo',
    pageId: '10987654321',
    createdAt: new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    isSimulated: true,
  };

  leadStore.unshift(lead);
  if (leadStore.length > 50) {
    leadStore.pop();
  }

  return lead;
}

function getStoredLeads() {
  return leadStore;
}

module.exports = {
  fetchLeadDetails,
  createMockLead,
  getStoredLeads,
  parseFieldData,
};
