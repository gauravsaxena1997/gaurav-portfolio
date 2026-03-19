/**
 * LLM Gateway Service Provider.
 *
 * Routes infer requests to the llm-gateway-service with HMAC authentication.
 * Compatible with Next.js Edge Runtime by using SubtleCrypto.
 */

import type { LLMMessage, LLMResponse } from './types';

const GATEWAY_INFER_PATH = '/v1/infer';

function getGatewayConfig() {
  const baseUrl = process.env.AI_GATEWAY_BASE_URL?.trim() || 'http://localhost:4005';
  const clientId = process.env.AI_GATEWAY_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.AI_GATEWAY_CLIENT_SECRET?.trim() || '';
  const timeoutMs = 30000; // Default 30s timeout

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error('AI gateway credentials are missing. Check AI_GATEWAY_BASE_URL, AI_GATEWAY_CLIENT_ID, and AI_GATEWAY_CLIENT_SECRET.');
  }

  return {
    baseUrl,
    clientId,
    clientSecret,
    timeoutMs,
  };
}

/**
 * Generates an HMAC SHA-256 signature using SubtleCrypto for Edge compatibility.
 */
async function buildGatewaySignature(
  timestamp: string,
  method: string,
  path: string,
  rawBody: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const payloadData = encoder.encode(`${timestamp}.${method}.${path}.${rawBody}`);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, payloadData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function generateGatewayResponse(
  messages: LLMMessage[],
  maxTokens: number = 1024,
  temperature: number = 0.3
): Promise<LLMResponse> {
  const config = getGatewayConfig();
  const timestamp = Date.now().toString();
  
  const body = {
    messages,
    maxTokens,
    temperature,
  };
  
  const rawBody = JSON.stringify(body);
  const signature = await buildGatewaySignature(
    timestamp,
    'POST',
    GATEWAY_INFER_PATH,
    rawBody,
    config.clientSecret
  );

  const response = await fetch(`${config.baseUrl}${GATEWAY_INFER_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gw-client-id': config.clientId,
      'x-gw-timestamp': timestamp,
      'x-gw-signature': signature,
    },
    body: rawBody,
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gateway API error (HTTP ${response.status}): ${errorBody.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data?.output?.text;

  if (!text || typeof text !== 'string') {
    throw new Error('Gateway API error: empty response content');
  }

  return {
    content: text,
    usage: data?.usage
      ? {
          promptTokens: data.usage.promptTokens ?? 0,
          completionTokens: data.usage.completionTokens ?? 0,
          totalTokens: data.usage.totalTokens ?? 0,
        }
      : undefined,
  };
}
