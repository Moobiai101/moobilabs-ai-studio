/**
 * Model Proxy Worker for AI Studio
 * Handles proxying requests to various AI services including fal.ai
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const service = url.pathname.split('/')[1]; // e.g., /fal/text-to-image

      if (service === 'fal') {
        return await handleFalRequest(request, env, corsHeaders);
      }
      
      if (service === 'runpod') {
        return await handleRunpodRequest(request, env, corsHeaders);
      }

      return new Response(JSON.stringify({ error: 'Service not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

/**
 * Handle requests to fal.ai services
 */
async function handleFalRequest(request, env, corsHeaders) {
  // Forward to fal.ai API with appropriate authentication
  const falApiKey = env.FAL_API_KEY; // Stored in environment variables
  
  // Clone the request and modify it for fal.ai
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/fal/', '');
  const falUrl = `https://api.fal.ai/${endpoint}`;
  
  const requestInit = {
    method: request.method,
    headers: {
      'Authorization': `Key ${falApiKey}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (request.method !== 'GET') {
    requestInit.body = await request.text();
  }
  
  const response = await fetch(falUrl, requestInit);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * Handle requests to Runpod hosted models
 */
async function handleRunpodRequest(request, env, corsHeaders) {
  const runpodApiKey = env.RUNPOD_API_KEY;
  
  // Clone the request and modify it for runpod
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/runpod/', '');
  
  // Format will be /runpod/endpoint-id/route
  const [endpointId, ...routes] = endpoint.split('/');
  const route = routes.join('/');
  
  const runpodUrl = `https://api.runpod.ai/v2/${endpointId}/${route || 'run'}`;
  
  const requestInit = {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${runpodApiKey}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (request.method !== 'GET') {
    requestInit.body = await request.text();
  }
  
  const response = await fetch(runpodUrl, requestInit);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
} 