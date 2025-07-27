// utils/retryAxios.js
import axios from "axios";

export async function postWithRetry(url, data, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await axios.post(url, data, options);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Request failed (attempt ${attempt}), retrying in ${delay}ms…`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;  // exponential backoff
    }
  }
}
