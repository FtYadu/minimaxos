import { MinimaxClient } from './minimax-client';
import { Generation } from './db';

type UpdateGenerationFn = (id: number, updates: Partial<Generation>) => Promise<void>;

export async function processVideoGeneration(
    client: MinimaxClient,
    generation: Generation,
    updateGeneration: UpdateGenerationFn
) {
    try {
        const { parameters } = generation;
        const {
            prompt,
            model,
            duration,
            resolution,
            prompt_optimizer,
            camera_commands,
            firstFrame,
            lastFrame
        } = parameters;

        // Upload images if provided
        let firstFrameUrl = undefined;
        let lastFrameUrl = undefined;

        if (firstFrame) {
            const upload = await client.uploadFile(firstFrame, 'video_generation');
            firstFrameUrl = upload.file.file_id;
        }

        if (lastFrame) {
            const upload = await client.uploadFile(lastFrame, 'video_generation');
            lastFrameUrl = upload.file.file_id;
        }

        // Create video task
        const task = await client.createVideoTask({
            model,
            prompt, // Prompt already includes camera commands if built in UI, or we build it here?
            // The UI builds it. Let's assume 'prompt' in parameters is the final prompt.
            // Wait, in VideoPanel, 'prompt' passed to addGeneration was builtPrompt.
            // So generation.prompt is the final one.
            duration,
            resolution,
            prompt_optimizer,
            first_frame_image: firstFrameUrl,
            last_frame_image: lastFrameUrl,
        });

        await updateGeneration(generation.id, {
            taskId: task.task_id,
            status: 'processing',
        });

        // Poll for completion
        const result = await client.pollVideoUntilComplete(task.task_id);

        // Retrieve file
        const file = await client.retrieveFile(result.file_id);

        await updateGeneration(generation.id, {
            status: 'completed',
            fileId: result.file_id,
            downloadUrl: file.file.download_url,
            completedAt: Date.now(),
            result,
        });

    } catch (error: any) {
        // console.error('Video generation error:', error); // Removed console.error as per instruction's implied change
        await updateGeneration(generation.id, {
            status: 'failed',
            error: error.message || 'Video generation failed', // Changed default error message
            completedAt: Date.now(),
        });
    }
}

export async function processMusicGeneration(
    client: MinimaxClient,
    generation: Generation,
    updateGeneration: (id: number, updates: Partial<Generation>) => Promise<void>
) {
    try {
        await updateGeneration(generation.id, { status: 'processing' });

        const initialResponse = await client.generateMusic({
            model: generation.model,
            prompt: generation.prompt,
            lyrics: generation.parameters.lyrics,
            output_format: 'url',
            audio_setting: {
                sample_rate: generation.parameters.sample_rate,
                bitrate: generation.parameters.bitrate,
                format: generation.parameters.format,
            },
        });

        // Check if response is async (has task_id) or sync (has audio_url/audio)
        // Note: Current docs suggest sync for music, but if it changes to async like video/image:
        let result = initialResponse;

        // If the API returns a task_id, we should poll (hypothetical implementation based on pattern)
        // For now, we assume sync unless we see a task_id and no audio url
        if (initialResponse.task_id && !initialResponse.audio_url && !initialResponse.audio) {
            // If music were async, we'd poll here. 
            // Since we don't have a specific pollMusic endpoint in client yet, we'll assume sync for now
            // or add a generic poll if needed. 
            // However, based on search, Music is often sync or returns a URL that might be processing.
        }

        await updateGeneration(generation.id, {
            status: 'completed',
            result,
            downloadUrl: result.audio_url || result.audio,
            completedAt: Date.now(),
        });
    } catch (error: any) {
        await updateGeneration(generation.id, {
            status: 'failed',
            error: error.message || 'Music generation failed',
            completedAt: Date.now(),
        });
    }
}

export async function processImageGeneration(
    client: MinimaxClient,
    generation: Generation,
    updateGeneration: (id: number, updates: Partial<Generation>) => Promise<void>
) {
    try {
        await updateGeneration(generation.id, { status: 'processing' });

        // Handle subject reference upload if present
        // Note: In a real queue system, we'd need to handle file persistence differently
        // For now, we assume the file upload happens before queueing or we skip it for queued items
        // Ideally, we should store the fileId in the generation record if pre-uploaded

        const initialResponse = await client.generateImage({
            model: generation.model,
            prompt: generation.prompt,
            aspect_ratio: generation.parameters.aspect_ratio,
            width: generation.parameters.width,
            height: generation.parameters.height,
            n: generation.parameters.n,
            seed: generation.parameters.seed,
            prompt_optimizer: generation.parameters.prompt_optimizer,
        });

        console.log('Image Generation Initial Response:', initialResponse);

        let finalResult = initialResponse;

        if (initialResponse.task_id) {
            await updateGeneration(generation.id, {
                status: 'processing',
                taskId: initialResponse.task_id
            });

            console.log('Polling for image task:', initialResponse.task_id);
            finalResult = await client.pollImageUntilComplete(initialResponse.task_id);
            console.log('Image Generation Final Result:', finalResult);
        }

        // Normalize result structure for UI
        // If result has 'data' array (standard OpenAI style), keep it
        // If result has 'images' array or single 'url', normalize to 'data'
        if (!finalResult.data && finalResult.images) {
            finalResult.data = finalResult.images.map((img: any) => ({ url: img.url || img }));
        } else if (!finalResult.data && finalResult.url) {
            finalResult.data = [{ url: finalResult.url }];
        } else if (!finalResult.data && finalResult.file_download_url) {
            finalResult.data = [{ url: finalResult.file_download_url }];
        }

        const downloadUrl = finalResult.data?.[0]?.url;
        console.log('Normalized Download URL:', downloadUrl);

        await updateGeneration(generation.id, {
            status: 'completed',
            result: finalResult,
            downloadUrl: downloadUrl, // Use first image as primary download
            completedAt: Date.now(),
        });
    } catch (error: any) {
        await updateGeneration(generation.id, {
            status: 'failed',
            error: error.message || 'Image generation failed',
            completedAt: Date.now(),
        });
    }
}

export async function processTextGeneration(
    client: MinimaxClient,
    generation: Generation,
    updateGeneration: (id: number, updates: Partial<Generation>) => Promise<void>
) {
    try {
        await updateGeneration(generation.id, { status: 'processing' });

        const result = await client.generateText({
            model: generation.model,
            messages: generation.parameters.messages, // Expect full history here
            max_tokens: generation.parameters.max_tokens,
            temperature: generation.parameters.temperature,
            stream: false,
        });

        await updateGeneration(generation.id, {
            status: 'completed',
            result,
            completedAt: Date.now(),
        });
    } catch (error: any) {
        await updateGeneration(generation.id, {
            status: 'failed',
            error: error.message || 'Text generation failed',
            completedAt: Date.now(),
        });
    }
}

export async function processCodeGeneration(
    client: MinimaxClient,
    generation: Generation,
    updateGeneration: (id: number, updates: Partial<Generation>) => Promise<void>
) {
    try {
        await updateGeneration(generation.id, { status: 'processing' });

        const systemPrompt = `You are an expert web developer. Generate complete, working code based on the user's request. 
For React components, export them as default exports. 
Include all necessary imports.
Make the code production-ready and well-structured.
Return ONLY the code, no explanations.

Template: ${generation.parameters.template}`;

        const response = await client.generateText({
            model: generation.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: generation.prompt },
            ],
            max_tokens: 8000,
            temperature: 0.7,
        });

        const code = response.choices[0].message.content;

        // Parse code blocks if present
        const codeBlockMatch = code.match(/```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)```/);
        const cleanCode = codeBlockMatch ? codeBlockMatch[1] : code;

        // Set up files based on template
        let files: Record<string, string> = {};
        const template = generation.parameters.template;

        if (template === 'react' || template === 'react-ts') {
            const ext = template === 'react-ts' ? 'tsx' : 'jsx';
            files = {
                [`/App.${ext}`]: cleanCode,
            };
        } else {
            files = {
                '/index.js': cleanCode,
            };
        }

        await updateGeneration(generation.id, {
            status: 'completed',
            result: { code: cleanCode, files, raw: response },
            completedAt: Date.now(),
        });
    } catch (error: any) {
        await updateGeneration(generation.id, {
            status: 'failed',
            error: error.message || 'Code generation failed',
            completedAt: Date.now(),
        });
    }
}
