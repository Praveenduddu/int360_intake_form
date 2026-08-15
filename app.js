const form = document.querySelector('#client-form');
const board = document.querySelector('#moodboard');
const toast = document.querySelector('#toast');

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'int360_form_draft';

document.querySelector('#form-date').valueAsDate = new Date();

// Auto-save functionality
function saveFormData() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Handle checkboxes (multiple values)
  const checkboxFields = ['source', 'areas', 'style', 'decisionMakers', 'contact'];
  checkboxFields.forEach(field => {
    const values = getValues(field);
    if (values.length > 0) {
      data[field] = values;
    }
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Show subtle save indicator
  const saveIndicator = document.querySelector('#save-indicator');
  if (saveIndicator) {
    saveIndicator.textContent = 'Saved';
    saveIndicator.style.opacity = '1';
    setTimeout(() => {
      saveIndicator.style.opacity = '0';
    }, 2000);
  }
}

function loadFormData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  
  try {
    const data = JSON.parse(saved);
    
    // Restore text inputs and selects
    Object.keys(data).forEach(key => {
      const field = form.elements[key];
      if (!field) return;
      
      // Skip checkbox/radio groups for now
      if (field.type === 'checkbox' || field.type === 'radio') return;
      
      field.value = data[key];
    });
    
    // Restore checkboxes
    if (Array.isArray(data.source)) {
      data.source.forEach(value => {
        const checkbox = form.querySelector(`input[name="source"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    if (Array.isArray(data.areas)) {
      data.areas.forEach(value => {
        const checkbox = form.querySelector(`input[name="areas"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    if (Array.isArray(data.style)) {
      data.style.forEach(value => {
        const checkbox = form.querySelector(`input[name="style"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    if (Array.isArray(data.decisionMakers)) {
      data.decisionMakers.forEach(value => {
        const checkbox = form.querySelector(`input[name="decisionMakers"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    if (Array.isArray(data.contact)) {
      data.contact.forEach(value => {
        const checkbox = form.querySelector(`input[name="contact"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    // Restore radio buttons
    const radioFields = ['projectType', 'propertyStatus', 'bedrooms', 'budget', 'otherFirms', 'siteVisit'];
    radioFields.forEach(field => {
      if (data[field]) {
        const radio = form.querySelector(`input[name="${field}"][value="${data[field]}"]`);
        if (radio) radio.checked = true;
      }
    });
    
    console.log('Form data restored from auto-save');
  } catch (error) {
    console.error('Failed to load saved form data:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function clearSavedData() {
  localStorage.removeItem(STORAGE_KEY);
}

// Load saved data on page load
loadFormData();

// Set up auto-save interval
let autoSaveTimer = setInterval(saveFormData, AUTO_SAVE_INTERVAL);

// Save on form input changes (debounced)
let saveTimeout;
form.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveFormData, 1000);
});

// Clear auto-save when form is successfully submitted
form.addEventListener('submit', event => {
  if (form.reportValidity()) {
    clearSavedData();
    clearTimeout(saveTimeout);
    clearInterval(autoSaveTimer);
  }
});

const styles = {
  Modern: {
    title: 'Modern clarity', palette: ['#25292a', '#848780', '#d7d1c6', '#f3f0ea'],
    paletteCopy: 'Charcoal · sage grey · travertine · chalk',
    images: ['photo-1600607687920-4e2a09cf159d', 'photo-1615874694520-474822394e73', 'photo-1616137466211-f939a420be84'],
    captions: ['Architectural ease, edited lines', 'Quiet material contrast', 'A crisp and enduring base']
  },
  Contemporary: {
    title: 'Contemporary warmth', palette: ['#44342d', '#90745e', '#c6b397', '#f0eae1'],
    paletteCopy: 'Walnut · clay · natural stone · warm ivory',
    images: ['photo-1618221195710-dd6b41faaea6', 'photo-1600566753190-17f0baa2a6c3', 'photo-1616486338812-3dadae4b4ace'],
    captions: ['Soft structure, natural light', 'Material tactility', 'A composed, lived-in calm']
  },
  Minimalist: {
    title: 'Minimalist calm', palette: ['#45413d', '#9c9489', '#d8d2c7', '#faf8f3'],
    paletteCopy: 'Graphite · mushroom · plaster · soft white',
    images: ['photo-1600210492486-724fe5c67fb0', 'photo-1600566753190-17f0baa2a6c3', 'photo-1616137346921-65a0a3f75c7f'],
    captions: ['A room reduced to its essentials', 'Subtle contrast in quiet tones', 'An intentional place to exhale']
  },
  Scandinavian: {
    title: 'Scandinavian light', palette: ['#e7dfd2', '#b9a88f', '#7f9185', '#fbfaf6'],
    paletteCopy: 'Linen · pale oak · soft sage · milk white',
    images: ['photo-1600210492486-724fe5c67fb0', 'photo-1618220179428-22790b461013', 'photo-1616137346921-65a0a3f75c7f'],
    captions: ['Daylight and uncomplicated form', 'Pale timber, tactile calm', 'Room to breathe and gather']
  },
  Industrial: {
    title: 'Industrial poise', palette: ['#2e2925', '#6e6259', '#a97a55', '#d1c2b4'],
    paletteCopy: 'Graphite · concrete · aged leather · ash',
    images: ['photo-1524758631624-e2822e304c36', 'photo-1618220179428-22790b461013', 'photo-1497366754035-f200968a6e72'],
    captions: ['Workwear texture, softened', 'The beauty of honest materials', 'Character with a generous scale']
  },
  Japandi: {
    title: 'Japandi stillness', palette: ['#4a443c', '#958675', '#d4c2a5', '#efede5'],
    paletteCopy: 'Smoked oak · clay · natural rattan · rice paper',
    images: ['photo-1616486338812-3dadae4b4ace', 'photo-1615874694520-474822394e73', 'photo-1600566753086-00f18fb6b3ea'],
    captions: ['A disciplined, soothing rhythm', 'Natural grain in close focus', 'Less, but better considered']
  },
  Luxury: {
    title: 'Quiet luxury', palette: ['#382920', '#806044', '#c9a36b', '#eee3d5'],
    paletteCopy: 'Espresso walnut · tobacco · antique brass · ivory',
    images: ['photo-1618221195710-dd6b41faaea6', 'photo-1600566753190-17f0baa2a6c3', 'photo-1600210491369-e753d80a41f3'],
    captions: ['Refined volume and warm shadow', 'Layered craft and luminous metal', 'Comfort, elevated with restraint']
  },
  Traditional: {
    title: 'Rooted elegance', palette: ['#593b2b', '#9f7454', '#bd9b5e', '#e9ddcd'],
    paletteCopy: 'Rosewood · terracotta · old gold · limewash',
    images: ['photo-1600607688969-a5bfcd646154', 'photo-1600566753086-00f18fb6b3ea', 'photo-1616486338812-3dadae4b4ace'],
    captions: ['Cultural memory, carefully composed', 'Crafted details with depth', 'A home with a lasting story']
  },
  default: {
    title: 'Contemporary warmth', palette: ['#3f3029', '#8e715b', '#d5c2a5', '#f0e9df'],
    paletteCopy: 'Walnut · bronzed metal · limestone · warm ivory',
    images: ['photo-1618221195710-dd6b41faaea6', 'photo-1600566753190-17f0baa2a6c3', 'photo-1616486338812-3dadae4b4ace'],
    captions: ['Soft structure, natural light', 'Material tactility', 'A composed, lived-in calm']
  }
};

const spaceInspiration = {
  'Living Room': { id: 'photo-1618221195710-dd6b41faaea6', caption: 'A welcoming living space with a sense of ease' },
  Dining: { id: 'photo-1616486338812-3dadae4b4ace', caption: 'Gathering spaces with natural rhythm' },
  Kitchen: { id: 'photo-1600566753086-00f18fb6b3ea', caption: 'A kitchen shaped for daily rituals' },
  Bedrooms: { id: 'photo-1616486338812-3dadae4b4ace', caption: 'Restful layers and private calm' },
  Bathrooms: { id: 'photo-1600566753190-17f0baa2a6c3', caption: 'A tactile, restorative retreat' },
  Balcony: { id: 'photo-1600210492486-724fe5c67fb0', caption: 'A softer connection to outdoors' },
  'Home Office': { id: 'photo-1497366754035-f200968a6e72', caption: 'Focused work with warmth and clarity' },
  'Pooja Room': { id: 'photo-1600210491369-e753d80a41f3', caption: 'A composed space for pause and ritual' },
  'Complete Interior': { id: 'photo-1600607687920-4e2a09cf159d', caption: 'One cohesive story across the home' }
};

const interestProfiles = [
  {
    terms: ['green', 'nature', 'plant', 'garden', 'biophilic', 'organic'],
    label: 'nature-led calm',
    palette: ['#31463c', '#79886d', '#c4ad89', '#ece7db'],
    paletteCopy: 'Forest green · olive · natural oak · linen',
    note: 'Layering organic texture, botanical calm, and daylight.'
  },
  {
    terms: ['blue', 'coastal', 'sea', 'ocean', 'cool'],
    label: 'coastal ease',
    palette: ['#274354', '#688b9a', '#c7b99f', '#f1efe8'],
    paletteCopy: 'Deep teal · mist blue · pale oak · shell white',
    note: 'Balancing calming blue notes with sun-washed neutrals.'
  },
  {
    terms: ['colour', 'color', 'bold', 'art', 'vibrant', 'playful'],
    label: 'expressive character',
    palette: ['#55312f', '#b65f49', '#d6a544', '#f0e3d0'],
    paletteCopy: 'Cacao · terracotta · ochre · warm plaster',
    note: 'Making room for personality, art, and collected colour.'
  },
  {
    terms: ['dark', 'black', 'moody', 'dramatic', 'hotel'],
    label: 'moody refinement',
    palette: ['#282523', '#594e46', '#927651', '#d8c9b8'],
    paletteCopy: 'Ink · smoked oak · antique brass · mushroom',
    note: 'Building depth through shadow, contrast, and rich tactility.'
  },
  {
    terms: ['white', 'bright', 'airy', 'light', 'simple'],
    label: 'light-filled ease',
    palette: ['#e8e2d8', '#c6b9a9', '#9baa9a', '#fbfaf5'],
    paletteCopy: 'Chalk · putty · soft sage · milk white',
    note: 'Keeping the home luminous, open, and softly textured.'
  }
];

function getValues(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(input => input.value);
}

function renderMoodboard() {
  const selectedStyles = getValues('style').filter(style => style !== 'Not Sure');
  const profile = styles[selectedStyles[0]] || styles.default;
  const client = form.elements.clientName.value.trim() || 'your client';
  const project = form.querySelector('[name="projectType"]:checked')?.value || 'Interior project';
  const spaces = getValues('areas');
  const preference = form.elements.preferences.value.trim();
  const preferenceText = preference.toLowerCase();
  const interest = interestProfiles.find(item => item.terms.some(term => preferenceText.includes(term)));
  const palette = interest?.palette || profile.palette;
  const paletteCopy = interest?.paletteCopy || profile.paletteCopy;
  const primarySpace = spaces.find(space => spaceInspiration[space]);
  const secondarySpace = spaces.filter(space => space !== primarySpace).find(space => spaceInspiration[space]);
  const inspiration = [
    primarySpace ? spaceInspiration[primarySpace] : { id: profile.images[0], caption: profile.captions[0] },
    { id: profile.images[1], caption: profile.captions[1] },
    secondarySpace ? spaceInspiration[secondarySpace] : { id: profile.images[2], caption: profile.captions[2] }
  ];
  const cueText = interest?.label || (preference ? 'personal brief' : selectedStyles.length ? selectedStyles.join(' + ') : 'studio-led direction');

  document.querySelector('#mood-title').innerHTML = `A mood board for <em>${escapeHtml(client)}.</em>`;
  document.querySelector('#direction-style').textContent = profile.title;
  document.querySelector('#direction-project').textContent = project;
  document.querySelector('#direction-focus').textContent = spaces.length ? spaces.slice(0, 2).join(' + ') : 'Comfort + function';
  document.querySelector('#direction-cues').textContent = cueText;
  document.querySelector('#palette-copy').textContent = paletteCopy;
  document.querySelector('#swatches').innerHTML = palette.map(colour => `<i style="--colour:${colour}"></i>`).join('');

  inspiration.forEach((item, index) => {
    const image = document.querySelector(`#board-image-${index + 1}`);
    image.src = `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=${index === 1 ? 900 : 1200}&q=85`;
    image.alt = `${profile.title} interior inspiration for ${primarySpace || 'the project'}`;
    document.querySelector(`#board-caption-${index + 1}`).textContent = item.caption;
  });

  const brief = preference
    ? `“${preference.length > 135 ? `${preference.slice(0, 135).trim()}…` : preference}”`
    : `${interest?.note || `A ${profile.title.toLowerCase()} direction for a ${project.toLowerCase()}, balancing character, comfort, and everyday function.`}`;
  document.querySelector('#board-brief').textContent = brief;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timeout);
  notify.timeout = window.setTimeout(() => toast.classList.remove('show'), 3500);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  renderMoodboard();
  board.hidden = false;
  board.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#back-to-form').addEventListener('click', () => {
  document.querySelector('#intake').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function printWithName(view) {
  const client = form.elements.clientName.value.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'client';
  const originalTitle = document.title;
  document.body.classList.toggle('print-board', view === 'mood-board');
  document.title = `INT360-${view}-${client}`;
  window.print();
  window.setTimeout(() => {
    document.title = originalTitle;
    document.body.classList.remove('print-board');
  }, 600);
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function getField(name) {
  return String(form.elements[name]?.value || '').trim();
}

function getChoice(name) {
  return form.querySelector(`[name="${name}"]:checked`)?.value || '';
}

function checked(name, expected) {
  return getValues(name).includes(expected);
}

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function buildExactPdfPayload() {
  const budgetMap = {
    'Below Rs 5 Lakhs': 'Below 5 Lakhs',
    'Rs 5 - 10 Lakhs': '5-10 Lakhs',
    'Rs 10 - 20 Lakhs': '10-20 Lakhs',
    'Rs 20 - 40 Lakhs': '20-40 Lakhs',
    'Rs 40 Lakhs+': '40 Lakhs+'
  };

  return {
    values: {
      'date': formatDate(document.querySelector('#form-date').value),
      'client-name': getField('clientName'),
      'mobile': getField('mobile'),
      'email': getField('email'),
      'address': getField('address'),
      'occupation': getField('occupation'),
      'source-other': getField('sourceOther'),
      'project-other': getField('projectTypeOther'),
      'location': getField('location'),
      'area': getField('area'),
      'area-other': getField('areasOther'),
      'preferences': getField('preferences'),
      'start-date': formatDate(getField('startDate')),
      'move-in-date': formatDate(getField('moveInDate')),
      'decision-other': getField('decisionOther'),
      'firm-name': getField('otherFirmName'),
      'meeting-date': formatDate(getField('meetingDate')),
      'consultant-notes': getField('consultantNotes'),
      'consultant-name': getField('consultantName'),
      'signature': getField('signature')
    },
    checks: {
      'source': getValues('source'),
      'project-type': getValues('projectType'),
      'status': getValues('propertyStatus'),
      'bedrooms': getValues('bedrooms'),
      'areas': getValues('areas'),
      'style': getValues('style'),
      'budget': getValues('budget').map(v => budgetMap[v] || v),
      'decision': getValues('decisionMakers'),
      'other-firms': getValues('otherFirms'),
      'site-visit': getValues('siteVisit'),
      'contact': getValues('contact')
    }
  };
}

function fillExportDocument(doc, payload) {
  Object.entries(payload.values || {}).forEach(([name, value]) => {
    const control = doc.querySelector(`[name="${name}"]`);
    if (control && typeof value === 'string') control.value = value;
  });
  Object.entries(payload.checks || {}).forEach(([name, selected]) => {
    const allowed = new Set(selected || []);
    doc.querySelectorAll(`[name="${name}"]`).forEach(control => {
      control.checked = allowed.has(control.value);
    });
  });
}

async function loadPdfLibraries() {
  const [html2canvasModule, jspdfModule] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.11/+esm'),
    import('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm')
  ]);
  const html2canvas = html2canvasModule.default || html2canvasModule;
  const jsPDF = jspdfModule.jsPDF || jspdfModule.default?.jsPDF || jspdfModule.default;
  if (typeof html2canvas !== 'function' || typeof jsPDF !== 'function') {
    throw new Error('PDF libraries failed to load');
  }
  return { html2canvas, jsPDF };
}

async function buildExportSrcDoc() {
  const [htmlText, cssText] = await Promise.all([
    fetch('exact-replica.html?v=' + Date.now()).then(response => {
      if (!response.ok) throw new Error('Form template missing');
      return response.text();
    }),
    fetch('exact-replica.css?v=' + Date.now()).then(response => {
      if (!response.ok) throw new Error('Form styles missing');
      return response.text();
    })
  ]);

  const parsed = new DOMParser().parseFromString(htmlText, 'text/html');
  const paper = parsed.querySelector('.paper');
  if (!paper) throw new Error('Form markup missing');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    ${cssText}
    html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
    .paper { margin: 0 !important; box-shadow: none !important; }
  </style>
</head>
<body>${paper.outerHTML}</body>
</html>`;
}

async function downloadExactPdf() {
  if (!form.reportValidity()) return false;

  const button = document.querySelector('#save-pdf');
  const client = getField('clientName') || 'Client';
  const filename = `INT360-Client-Brief-${client.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'Client'}.pdf`;
  const payload = buildExactPdfPayload();

  button.disabled = true;
  notify('Preparing your PDF…');

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:210mm;height:297mm;border:0;opacity:0;pointer-events:none;z-index:-1;';
  document.body.appendChild(iframe);

  try {
    const [{ html2canvas, jsPDF }, srcdoc] = await Promise.all([
      loadPdfLibraries(),
      buildExportSrcDoc()
    ]);

    await new Promise((resolve, reject) => {
      iframe.onload = () => resolve();
      iframe.onerror = () => reject(new Error('Failed to load form template'));
      iframe.srcdoc = srcdoc;
    });

    await wait(300);

    const idoc = iframe.contentDocument;
    if (!idoc) throw new Error('Form template unavailable');

    fillExportDocument(idoc, payload);
    await wait(200);

    const paper = idoc.querySelector('.paper');
    if (!paper) throw new Error('Form template missing');

    const canvas = await html2canvas(paper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#fffefa',
      scrollX: 0,
      scrollY: 0,
      windowWidth: paper.scrollWidth,
      windowHeight: paper.scrollHeight,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('*').forEach(el => {
          const cs = el.computedStyleMap ? null : null;
          // Remove any empty or broken inline style properties
          if (el.style && el.style.length) {
            for (let i = el.style.length - 1; i >= 0; i--) {
              const prop = el.style[i];
              const val = el.style.getPropertyValue(prop);
              if (!val || val === '' || prop.startsWith('--')) {
                el.style.removeProperty(prop);
              }
            }
          }
          // Remove webkit-appearance which causes parser issues
          el.style.removeProperty('-webkit-appearance');
          el.style.removeProperty('appearance');
        });
      }
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297);
    pdf.save(filename);

    notify('PDF downloaded');
    return true;
  } catch (error) {
    console.error(error);
    notify('Could not download PDF. Please try again.');
    return false;
  } finally {
    iframe.remove();
    button.disabled = false;
  }
}

document.querySelector('#save-pdf').addEventListener('click', async () => {
  const downloaded = await downloadExactPdf();
  if (!downloaded) return;

  clearSavedData();
  form.reset();
  document.querySelector('#form-date').valueAsDate = new Date();
  notify('PDF downloaded — brief cleared for the next intake');
});

document.querySelector('#clear-brief').addEventListener('click', handleClearBrief);

function handleClearBrief() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const hasData = form.elements.clientName.value.trim() !== '' ||
                  form.elements.mobile.value.trim() !== '' ||
                  saved !== null;

  if (hasData) {
    if (confirm('Clear this brief and start a new intake? Current answers will be lost.')) {
      clearSavedData();
      form.reset();
      document.querySelector('#form-date').valueAsDate = new Date();
      notify('Brief cleared — ready for the next intake');
    }
    return;
  }

  form.reset();
  document.querySelector('#form-date').valueAsDate = new Date();
  notify('Ready for a new brief');
}

document.querySelector('#save-board').addEventListener('click', () => {
  notify('Your print dialog is open - choose “Save as PDF” to download the mood board.');
  window.setTimeout(() => printWithName('mood-board'), 120);
});
