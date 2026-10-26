<?php
/**
 * Tiny LLM client: Anthropic (Claude) or OpenAI over plain cURL. No Composer needed.
 *
 *   export LLM_PROVIDER=anthropic   # or openai, or mock (default)
 *   export LLM_API_KEY=...          # your own key; never commit it
 *   export LLM_MODEL=...            # a current model id from the provider's docs
 *
 * With LLM_PROVIDER=mock (default) it returns a canned answer so demos work offline.
 * SYNTHETIC DATA ONLY: never send real client information to any API.
 */
function llm(string $system, string $user): string {
    $provider = getenv('LLM_PROVIDER') ?: 'mock';
    $key = getenv('LLM_API_KEY');
    $model = getenv('LLM_MODEL');
    if ($provider === 'mock' || !$key || !$model) {
        return json_encode(['mock' => true, 'note' => 'Set LLM_PROVIDER, LLM_API_KEY and LLM_MODEL for a real call.',
                            'echo' => mb_substr($user, 0, 120)]);
    }
    if ($provider === 'anthropic') {
        $url = 'https://api.anthropic.com/v1/messages';
        $headers = ['x-api-key: ' . $key, 'anthropic-version: 2023-06-01', 'content-type: application/json'];
        $body = ['model' => $model, 'max_tokens' => 1024, 'system' => $system,
                 'messages' => [['role' => 'user', 'content' => $user]]];
    } else {
        $url = 'https://api.openai.com/v1/chat/completions';
        $headers = ['Authorization: Bearer ' . $key, 'content-type: application/json'];
        $body = ['model' => $model, 'messages' => [['role' => 'system', 'content' => $system],
                                                    ['role' => 'user', 'content' => $user]]];
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode($body), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 60]);
    $res = json_decode((string) curl_exec($ch), true);
    curl_close($ch);
    return $provider === 'anthropic'
        ? ($res['content'][0]['text'] ?? json_encode($res))
        : ($res['choices'][0]['message']['content'] ?? json_encode($res));
}
