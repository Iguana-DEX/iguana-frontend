import useWeb3 from '@/services/web3/useWeb3';

const { getProvider, account } = useWeb3();

require('dotenv').config();

const APIKEY = import.meta.env.VITE_GITCOIN_API_KEY;
const SCORERID = process.env.VITE_GITCOIN_SCORER_ID;

// endpoint for submitting passport
const SUBMIT_PASSPORT_URI =
  'https://api.scorer.gitcoin.co/registry/submit-passport';
// endpoint for getting the signing message
const SIGNING_MESSAGE_URI =
  'https://api.scorer.gitcoin.co/registry/signing-message';

const headers = APIKEY
  ? {
      'Content-Type': 'application/json',
      'X-API-Key': APIKEY,
    }
  : undefined;

export default function useGitcoinPassport() {
  async function getSigningMessage() {
    try {
      // fetch the message to sign from the server
      const response = await fetch(SIGNING_MESSAGE_URI, {
        headers,
      });
      // convert the response data to a json object
      const json = await response.json();
      return json;
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function submitPassport() {
    try {
      // GET request to the Passport API to get the signing message and the nonce
      const { message, nonce } = await getSigningMessage();
      // instantiate a new provider instance
      const provider = await getProvider();
      // call the provider's `getSigner` API method to start the signing process
      const signer = await provider.getSigner();
      // ask the user to sign the message
      const signature = await signer.signMessage(message);
      // POST request to the Passport API, sending the signing message, the signature, and the nonce
      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          account,
          scorer_id: SCORERID,
          signature,
          nonce,
        }),
      });
      // assign the response data to `data` as a json object
      const data = await response.json();
      console.log('data:', data);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  return {
    // methods
    getSigningMessage,
    submitPassport,
  };
}
