# mcp-ui postMessage Protocol Reference

Full wire protocol for the `ui://` resource bridge between the iframe (guest) and the MCP host (parent window). The cre8 page shell implements this for you — this doc explains *what* it implements and *why*, so you can extend it if you need to send messages from inline scripts inside a custom cre8 widget.

## Guest → Host (iframe sends)

The iframe calls `window.parent.postMessage(msg, '*')` where `msg` is:

```js
{
  type: 'tool' | 'prompt' | 'link' | 'notify' | 'intent' | 'ui-size-change',
  messageId?: 'cre8-1730000000-1',   // present for async tool calls
  payload: { ... }                    // shape depends on type
}
```

### `tool`

Asks the host to invoke another MCP tool.

```js
{
  type: 'tool',
  messageId: 'cre8-1730000000-1',
  payload: {
    toolName: 'saveContact',
    params: { name: 'Tyler', email: 'tyler@example.com' }
  }
}
```

When `messageId` is present, the host will reply with `ui-message-received` (ack) then `ui-message-response` (result).

### `prompt`

Injects a follow-up message into the conversation as if the user typed it.

```js
{ type: 'prompt', payload: { prompt: 'Tell me more about Q4 revenue' } }
```

### `link`

Asks the host to open a URL in a new tab.

```js
{ type: 'link', payload: { url: 'https://example.com' } }
```

### `notify`

Logs a message back to the host (no UI effect, useful for telemetry).

```js
{ type: 'notify', payload: { message: 'Chart rendered successfully' } }
```

### `intent`

Host-specific semantic action (the host decides what to do with it).

```js
{ type: 'intent', payload: { intent: 'refresh-data', params: { range: '30d' } } }
```

### `ui-size-change`

The page shell auto-emits this on mutation so the host can resize the iframe to fit content.

```js
{ type: 'ui-size-change', payload: { height: 480, width: 640 } }
```

## Host → Guest (parent sends)

Replies to async messages with the matching `messageId`:

| `type`                | Meaning                              |
| --------------------- | ------------------------------------ |
| `ui-message-received` | Host has the message; processing.    |
| `ui-message-response` | Final result. Payload has `response` on success or `error` on failure. |

MCP Apps hosts also send JSON-RPC notifications (no `messageId`):

| Method                                  | Payload                            |
| --------------------------------------- | ---------------------------------- |
| `ui/notifications/tool-input`           | Tool args resolved.                |
| `ui/notifications/tool-input-partial`   | Streaming partial tool args.       |
| `ui/notifications/tool-result`          | Tool execution result.             |
| `ui/notifications/host-context-changed` | Theme, locale, viewport changed.   |
| `ui/notifications/size-changed`         | Host informs guest of size limits. |
| `ui/notifications/tool-cancelled`       | Tool was cancelled.                |
| `ui/resource-teardown`                  | UI about to be unmounted.          |

To handle these in a custom widget, listen for the messages directly:

```html
<script>
  window.addEventListener('message', (event) => {
    const m = event.data;
    if (!m || typeof m !== 'object') return;
    if (m.method === 'ui/notifications/host-context-changed') {
      const { theme } = m.params || {};
      document.documentElement.dataset.theme = theme;
    }
  });
</script>
```

## Async round-trip — full example

The page shell implements this for you whenever you use `bridge.callTool(...)` or `data-cre8-action="tool:..."`. The flow:

1. Guest sends `{ type: 'tool', messageId: 'cre8-...', payload: {...} }`.
2. Host posts back `{ type: 'ui-message-received', messageId: 'cre8-...' }`.
3. Host invokes its `onUIAction` callback.
4. Host posts `{ type: 'ui-message-response', messageId: 'cre8-...', payload: { response } }` or `{ ...payload: { error } }`.
5. The bridge resolves/rejects the Promise returned by `callTool`.

Synchronous mode (no Promise, no host response): pass `{ async: false }` to `callTool`, or omit `messageId` in a manual `postMessage`.

## Security notes

- The shell uses `targetOrigin: '*'`. If you know the host origin, replace this with the specific origin in custom widgets.
- The host should validate `event.origin` before acting on guest messages.
- Don't include secrets in the rendered HTML — anything in `htmlString` is visible to anyone with the resource.

## References

- mcp-ui protocol docs: https://mcpui.dev/guide/protocol-details
- mcp-ui-server PyPI: https://pypi.org/project/mcp-ui-server/
