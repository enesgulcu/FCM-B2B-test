import { HttpsProxyAgent } from 'https-proxy-agent';

const fixieUrl = process.env.FIXIE_URL;

const fixieAgent = fixieUrl ? new HttpsProxyAgent(fixieUrl) : undefined;

export default fixieAgent;

