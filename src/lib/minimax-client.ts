// MiniMax API Client - Complete implementation

const BASE_URLS = {
  international: 'https://api.minimax.io',
  china: 'https://api.minimaxi.com',
};

export interface VideoGenerationParams {
  model: string;
  prompt: string;
  duration?: 6 | 10;
  resolution?: '512P' | '720P' | '768P' | '1080P';
  first_frame_image?: string;
  last_frame_image?: string;
  prompt_optimizer?: boolean;
  fast_optimizer?: boolean;
  callback_url?: string;
}

export interface ImageGenerationParams {
  model: string;
  prompt: string;
  aspect_ratio?: string;
  width?: number;
  height?: number;
  n?: number;
  prompt_optimizer?: boolean;
  seed?: number;
}

export interface TextGenerationParams {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface MusicGenerationParams {
  model: string;
  prompt: string;
  lyrics?: string;
  stream?: boolean;
  output_format?: 'url' | 'hex';
  audio_setting?: {
    sample_rate?: 32000 | 44100;
    bitrate?: 128000 | 256000;
    format?: 'mp3' | 'pcm' | 'flac' | 'wav';
  };
}

export interface SpeechGenerationParams {
  model: string;
  text: string;
  voice_id: string;
  speed?: number;
  vol?: number;
  pitch?: number;
  audio_setting?: {
    sample_rate?: 32000 | 44100;
    bitrate?: 128000 | 256000;
    format?: 'mp3' | 'pcm' | 'flac' | 'wav';
  };
}

export class MinimaxClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, region: 'international' | 'china' = 'international') {
    this.apiKey = apiKey;
    this.baseUrl = BASE_URLS[region];
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Video Generation
  async createVideoTask(params: VideoGenerationParams) {
    const response = await fetch(`${this.baseUrl}/v1/video_generation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Video generation failed');
    }

    return await response.json();
  }

  async queryVideoTask(taskId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/query/video_generation?task_id=${taskId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to query video task');
    }

    return await response.json();
  }

  async pollVideoUntilComplete(taskId: string, onProgress?: (status: string) => void) {
    let attempts = 0;
    const maxAttempts = 120; // 20 minutes max (10s intervals)

    while (attempts < maxAttempts) {
      const result = await this.queryVideoTask(taskId);

      if (onProgress) {
        onProgress(result.status);
      }

      if (result.status === 'Success') {
        return result;
      } else if (result.status === 'Fail') {
        throw new Error('Video generation failed');
      }

      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10s intervals
      attempts++;
    }

    throw new Error('Video generation timeout');
  }

  // Image Generation
  async generateImage(params: ImageGenerationParams) {
    const response = await fetch(`${this.baseUrl}/v1/image_generation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Image generation failed');
    }

    return await response.json();
  }

  async queryImageTask(taskId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/query/image_generation?task_id=${taskId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to query image task');
    }

    return await response.json();
  }

  async pollImageUntilComplete(taskId: string, onProgress?: (status: string) => void) {
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max (2s intervals)

    while (attempts < maxAttempts) {
      const result = await this.queryImageTask(taskId);

      if (onProgress) {
        onProgress(result.status);
      }

      // Check for success status (Success or completed)
      if (result.status === 'Success' || result.status === 'completed') {
        return result;
      } else if (result.status === 'Fail' || result.status === 'failed') {
        throw new Error('Image generation failed: ' + (result.error_msg || 'Unknown error'));
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s intervals
      attempts++;
    }

    throw new Error('Image generation timeout');
  }

  // Text Generation (LLM)
  async generateText(params: TextGenerationParams) {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Text generation failed');
    }

    if (params.stream) {
      return response.body;
    }

    return await response.json();
  }

  // Music Generation
  async generateMusic(params: MusicGenerationParams) {
    const response = await fetch(`${this.baseUrl}/v1/music_generation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Music generation failed');
    }

    if (params.stream) {
      return response.body;
    }

    return await response.json();
  }

  // Text-to-Speech
  async generateSpeech(params: SpeechGenerationParams) {
    const response = await fetch(`${this.baseUrl}/v1/t2a_v2`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Speech generation failed');
    }

    return await response.json();
  }

  // File operations
  async uploadFile(file: File, purpose: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    const response = await fetch(`${this.baseUrl}/v1/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  }

  async retrieveFile(fileId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/files/retrieve?file_id=${fileId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('File retrieval failed');
    }

    return await response.json();
  }
}

export const createClient = (apiKey: string, region: 'international' | 'china' = 'international') => {
  return new MinimaxClient(apiKey, region);
};
