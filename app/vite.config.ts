import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/api-sarvam': {
        target: 'https://api.sarvam.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sarvam/, ''),
        secure: true,
      },
      '/api-translate': {
        target: 'https://libretranslate.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-translate/, ''),
        secure: true,
      },
      '/api-translate-mirror': {
        target: 'https://translate.terraprint.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-translate-mirror/, ''),
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'bhashini-to-sarvam-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api-bhashini')) {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = body ? JSON.parse(body) : {};
                let inputText = '';
                let srcLang = 'en-IN';
                let tgtLang = 'hi-IN';

                if (parsed.inputData?.input?.[0]?.source) {
                  inputText = parsed.inputData.input[0].source;
                }
                if (parsed.pipelineTasks?.[0]?.config?.language) {
                  const langConfig = parsed.pipelineTasks[0].config.language;
                  const s = langConfig.sourceLanguage || 'en';
                  const t = langConfig.targetLanguage || 'hi';
                  srcLang = s.includes('-') ? s : `${s}-IN`;
                  tgtLang = t.includes('-') ? t : `${t}-IN`;
                }

                let translatedText = inputText;
                if (inputText) {
                  try {
                    const sarvamRes = await fetch('https://api.sarvam.ai/translate', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'api-subscription-key': 'sk_ati8d224_5sYLv3Wg0JyltcDiF9N35wig'
                      },
                      body: JSON.stringify({
                        input: inputText,
                        source_language_code: srcLang,
                        target_language_code: tgtLang,
                        model: 'sarvam-translate:v1',
                        mode: 'formal'
                      })
                    });
                    if (sarvamRes.ok) {
                      const sarvamData = await sarvamRes.json();
                      translatedText = sarvamData.translated_text || inputText;
                    }
                  } catch (err) {
                    console.warn('[Vite Bhashini-Sarvam Bridge] error:', err);
                  }
                }

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                  pipelineResponse: [
                    {
                      taskType: 'translation',
                      output: [
                        {
                          source: inputText,
                          target: translatedText
                        }
                      ]
                    }
                  ]
                }));
              } catch (e) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                  pipelineResponse: [{ taskType: 'translation', output: [{ source: '', target: '' }] }]
                }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  optimizeDeps: {
    exclude: ['lucide-react'], // Force exclusion to avoid "file does not exist" errors in Vites's optimize directory
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
