import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 250,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000/api/v1';

const OPERATOR_TOKEN = 'token';
const PRODUCT_ID = 'productId';

export default function () {
  const outPayload = JSON.stringify({
    productId: PRODUCT_ID,
    type: 'OUT',
    quantity: 1,
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPERATOR_TOKEN}`,
  };

  const outRes = http.post(`${BASE_URL}/transaction`, outPayload, {
    headers: headers,
  });

  check(outRes, {
    'transaction OUT successful': (r) =>
      r.status === 201 ||
      (r.status === 400 && r.json('message').includes('Stock not enough')),
  });

  const inPayload = JSON.stringify({
    productId: PRODUCT_ID,
    type: 'IN',
    quantity: 1,
  });

  const inRes = http.post(`${BASE_URL}/transaction`, inPayload, {
    headers: headers,
  });

  check(inRes, {
    'transaction IN successful': (r) => r.status === 201,
  });

  sleep(0.1);
}

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}
