let authToken = '';

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function display(data) {
  document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

// Member 1
async function registerTenant() {
  const body = {
    companyName: document.getElementById('m1_company').value,
    slug: document.getElementById('m1_slug').value,
    adminName: document.getElementById('m1_name').value,
    email: document.getElementById('m1_email').value,
    password: document.getElementById('m1_pass').value
  };
  const res = await fetch('/api/auth/register-tenant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.token) authToken = data.token;
  display(data);
}

// Member 2
async function fetchPlans() {
  const res = await fetch('/api/plans');
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    document.getElementById('m3_planId').value = data[0]._id;
  }
  display(data);
}

// Member 3
async function subscribePlan() {
  const planId = document.getElementById('m3_planId').value;
  const res = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify({ planId })
  });
  display(await res.json());
}

async function recordUsage() {
  const body = {
    featureKey: document.getElementById('m3_feature').value,
    quantity: parseInt(document.getElementById('m3_qty').value)
  };
  const res = await fetch('/api/subscriptions/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify(body)
  });
  display(await res.json());
}

// Member 4
async function generateInvoice() {
  const res = await fetch('/api/billing/invoices', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const data = await res.json();
  if (data.invoice && data.invoice._id) {
    document.getElementById('m4_invId').value = data.invoice._id;
  }
  display(data);
}

async function retryPayment() {
  const invId = document.getElementById('m4_invId').value;
  const res = await fetch(`/api/invoices/${invId}/retry`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  display(await res.json());
}

async function fetchMRR() {
  const res = await fetch('/api/admin/reports/revenue', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  display(await res.json());
}