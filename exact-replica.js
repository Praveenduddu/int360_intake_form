function decodePayload(value) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(value))));
  } catch {
    return null;
  }
}

function fillValue(name, value) {
  const control = document.querySelector(`[name="${name}"]`);
  if (control && typeof value === 'string') control.value = value;
}

function fillChecks(name, selected) {
  const allowed = new Set(selected || []);
  document.querySelectorAll(`[name="${name}"]`).forEach(control => {
    control.checked = allowed.has(control.value);
  });
}

const encoded = window.location.hash.slice(1);
const payload = encoded ? decodePayload(encoded) : null;

if (payload) {
  Object.entries(payload.values || {}).forEach(([name, value]) => fillValue(name, value));
  Object.entries(payload.checks || {}).forEach(([name, selected]) => fillChecks(name, selected));
  document.title = payload.title || 'INT360 Client Brief';
  if (payload.print) {
    const triggerPrint = () => window.setTimeout(() => window.print(), 220);
    if (document.readyState === 'complete') {
      triggerPrint();
    } else {
      window.addEventListener('load', triggerPrint);
    }
  }
}
