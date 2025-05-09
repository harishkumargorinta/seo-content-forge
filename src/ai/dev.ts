import { config } from 'dotenv';
config();

import '@/ai/flows/seo-optimize-content.ts';
import '@/ai/flows/content-writer-flow.ts';
import '@/ai/flows/rewrite-imported-content-flow.ts';
import '@/ai/tools/fetch-web-content-tool.ts';
