/**
 * Assets Upload Worker for AI Studio
 * Handles secure file uploads to R2 buckets
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-File-Name, X-File-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Get user authentication (in production, this should verify JWT tokens)
    // For this example, we're using a simple API key approach
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace('/assets/', '');

    try {
      switch (request.method) {
        case 'POST':
          // Handle file upload
          return await handleUpload(request, env, path, corsHeaders);
        case 'GET':
          // Get file or generate signed URL
          return await handleGet(env, path, corsHeaders);
        case 'DELETE':
          // Delete a file
          return await handleDelete(env, path, corsHeaders);
        default:
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
      }
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
 * Handle file upload to R2
 */
async function handleUpload(request, env, path, corsHeaders) {
  const contentType = request.headers.get('Content-Type');
  const fileName = request.headers.get('X-File-Name');
  const bucket = env.ASSETS_BUCKET;

  if (!fileName) {
    return new Response(JSON.stringify({ error: 'X-File-Name header is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  // Process the file
  const fileData = await request.arrayBuffer();
  const fullPath = path ? `${path}/${fileName}` : fileName;

  // Store in R2 bucket
  await bucket.put(fullPath, fileData, {
    httpMetadata: {
      contentType: contentType,
    },
  });

  // Generate a public URL (in production, consider signed URLs with expiration)
  const publicUrl = `${env.ASSET_BASE_URL}/${fullPath}`;

  return new Response(JSON.stringify({
    success: true,
    fileName: fileName,
    path: fullPath,
    url: publicUrl,
    size: fileData.byteLength,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * Handle file retrieval or signed URL generation
 */
async function handleGet(env, path, corsHeaders) {
  if (!path) {
    return new Response(JSON.stringify({ error: 'Path is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  const bucket = env.ASSETS_BUCKET;
  const object = await bucket.get(path);

  if (!object) {
    return new Response(JSON.stringify({ error: 'File not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  // For direct file serving
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  // Add CORS headers
  Object.keys(corsHeaders).forEach(key => {
    headers.set(key, corsHeaders[key]);
  });

  return new Response(object.body, {
    headers,
  });
}

/**
 * Handle file deletion
 */
async function handleDelete(env, path, corsHeaders) {
  if (!path) {
    return new Response(JSON.stringify({ error: 'Path is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  const bucket = env.ASSETS_BUCKET;
  await bucket.delete(path);

  return new Response(JSON.stringify({
    success: true,
    message: `File ${path} successfully deleted`,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
} 