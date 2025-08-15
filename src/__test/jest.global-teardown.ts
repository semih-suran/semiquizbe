import { shutdownServices } from '../index';
import util from 'util';

function shortInspectHandle(h: any) {
  const ctor =
    h && h.constructor && h.constructor.name
      ? h.constructor.name
      : Object.prototype.toString.call(h);
  const info: any = { ctor };

  try {
    if (h.remoteAddress) info.remoteAddress = h.remoteAddress;
    if (h.remotePort) info.remotePort = h.remotePort;
    if (h.localAddress) info.localAddress = h.localAddress;
    if (h.localPort) info.localPort = h.localPort;
    if (h._peername) info._peername = h._peername;
    if (h._sockname) info._sockname = h._sockname;
    if (h.bytesRead != null) info.bytesRead = h.bytesRead;
    if (h.bytesWritten != null) info.bytesWritten = h.bytesWritten;
    if (h.path) info.path = h.path;
    try {
      const events = h && h.eventNames ? h.eventNames() : null;
      if (events && events.length) info.events = events;
    } catch (_) {}
  } catch (e) {
    /* ignore */
  }

  try {
    info.preview = util.inspect(h, { depth: 0, breakLength: 60 });
  } catch (e) {
    info.preview = String(h);
  }

  return info;
}

export default async function globalTeardown() {
  // try graceful shutdown
  try {
    await shutdownServices();
  } catch (err) {
    console.warn(
      'globalTeardown: shutdownServices() error:',
      err instanceof Error ? err.message : String(err)
    );
  }

  // wait briefly to let sockets close
  await new Promise((r) => setTimeout(r, 200));

  // @ts-ignore - internal debugging API
  const handles = (process as any)._getActiveHandles
    ? (process as any)._getActiveHandles()
    : [];
  // @ts-ignore
  const requests = (process as any)._getActiveRequests
    ? (process as any)._getActiveRequests()
    : [];

  if (handles.length === 0 && requests.length === 0) {
    console.log('globalTeardown: no active handles/requests detected.');
    await new Promise((r) => setTimeout(r, 20));
    process.exit(0);
    return;
  }

  console.error(
    'globalTeardown: remaining handles/requests — printing details:'
  );
  console.error(
    `- activeHandles: ${handles.length}, activeRequests: ${requests.length}`
  );

  for (let i = 0; i < handles.length; i++) {
    try {
      console.error(`#handle[${i}]`, shortInspectHandle(handles[i]));
    } catch (err) {
      console.error(`#handle[${i}] error inspecting:`, err);
    }
  }

  for (let i = 0; i < requests.length; i++) {
    try {
      console.error(`#request[${i}]`, util.inspect(requests[i], { depth: 1 }));
    } catch (err) {
      console.error(`#request[${i}] error inspecting:`, err);
    }
  }

  console.error(
    'globalTeardown: forcing process.exit(1) to avoid hang (details above).'
  );
  await new Promise((r) => setTimeout(r, 50));
  process.exit(1);
}
