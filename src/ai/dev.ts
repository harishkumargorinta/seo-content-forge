
import { config } from 'dotenv';
config();

import '@/ai/flows/seo-optimize-content.ts';
import '@/ai/flows/content-writer-flow.ts';
import '@/ai/flows/rewrite-imported-content-flow.ts';
import '@/ai/flows/seo-blog-package-flow.ts'; // Added new flow
import '@/ai/flows/youtube-title-generator-flow.ts'; // Added YouTube title generator flow
import '@/ai/flows/youtube-description-tags-flow.ts'; // Added YouTube description and tags generator flow
import '@/ai/tools/fetch-web-content-tool.ts';

