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

function formField(value, x, y, width, variant = '') {
  if (!value) return '';
  return `<span class="value ${variant}" style="left:${x}%;top:${y}%;width:${width}%">${escapeHtml(value)}</span>`;
}

function formTick(active, x, y) {
  return active ? `<span class="tick" style="left:${x}%;top:${y}%">✓</span>` : '';
}

function exactTemplateHtml() {
  const choice = getChoice;
  const source = value => checked('source', value);
  const area = value => checked('areas', value);
  const style = value => checked('style', value);
  const decision = value => checked('decisionMakers', value);
  const contact = value => checked('contact', value);
  const templateUrl = new URL('assets/entry-form-template.png', window.location.href).href;
  const fields = [
    formField(formatDate(document.querySelector('#form-date').value), 84.0, 9.65, 12),
    formField(getField('clientName'), 31.4, 19.75, 31.2),
    formField(getField('mobile'), 31.4, 22.20, 31.2),
    formField(getField('email'), 31.4, 24.62, 31.2),
    formField(getField('address'), 31.4, 26.85, 31.2, 'address'),
    formField(getField('occupation'), 31.4, 31.05, 31.2),
    formTick(source('Reference'), 67.6, 21.34), formTick(source('Instagram'), 67.6, 23.18),
    formTick(source('Facebook'), 67.6, 25.03), formTick(source('Google'), 67.6, 26.88),
    formTick(source('Website'), 67.6, 28.72), formTick(source('Walk-in'), 67.6, 30.58),
    formTick(source('Other'), 67.6, 32.42), formField(getField('sourceOther'), 79.4, 32.65, 14.4),

    formTick(choice('projectType') === 'Apartment', 21.2, 41.10), formTick(choice('projectType') === 'Villa', 21.2, 42.91),
    formTick(choice('projectType') === 'Independent House', 21.2, 44.72), formTick(choice('projectType') === 'Commercial Office', 21.2, 46.53),
    formTick(choice('projectType') === 'Retail Store', 21.2, 48.34), formTick(choice('projectType') === 'Restaurant / Cafe', 21.2, 50.15),
    formTick(choice('projectType') === 'Other', 21.2, 51.96), formField(getField('projectTypeOther'), 30.0, 52.18, 11.1),
    formField(getField('location'), 44.5, 41.14, 20.6),
    formTick(choice('propertyStatus') === 'Under Construction', 44.5, 45.29), formTick(choice('propertyStatus') === 'Ready to Move', 44.5, 47.09),
    formTick(choice('propertyStatus') === 'Renovation', 44.5, 48.89), formField(getField('area'), 44.5, 52.83, 18.6),
    formTick(choice('bedrooms') === '1 BHK', 68.2, 41.10), formTick(choice('bedrooms') === '2 BHK', 68.2, 42.91),
    formTick(choice('bedrooms') === '3 BHK', 68.2, 44.72), formTick(choice('bedrooms') === '4 BHK+', 68.2, 46.53),
    formTick(choice('bedrooms') === 'Commercial', 68.2, 48.34),

    formTick(area('Living Room'), 7.5, 63.25), formTick(area('Dining'), 7.5, 65.04), formTick(area('Kitchen'), 7.5, 66.83),
    formTick(area('Bedrooms'), 7.5, 68.62), formTick(area('Bathrooms'), 7.5, 70.41),
    formTick(area('Balcony'), 22.5, 63.25), formTick(area('Pooja Room'), 22.5, 65.04), formTick(area('Home Office'), 22.5, 66.83),
    formTick(area('Complete Interior'), 22.5, 68.62), formTick(area('Other'), 22.5, 70.41), formField(getField('areasOther'), 30.1, 70.68, 10.3),
    formTick(style('Modern'), 39.4, 63.25), formTick(style('Contemporary'), 39.4, 65.04), formTick(style('Minimalist'), 39.4, 66.83),
    formTick(style('Luxury'), 39.4, 68.62), formTick(style('Traditional'), 39.4, 70.41),
    formTick(style('Scandinavian'), 52.8, 63.25), formTick(style('Industrial'), 52.8, 65.04), formTick(style('Japandi'), 52.8, 66.83), formTick(style('Not Sure'), 52.8, 68.62),
    formField(getField('preferences'), 69.1, 64.35, 24.2, 'note'),

    formTick(choice('budget') === 'Below Rs 5 Lakhs', 7.4, 79.62), formTick(choice('budget') === 'Rs 5 - 10 Lakhs', 7.4, 81.42),
    formTick(choice('budget') === 'Rs 10 - 20 Lakhs', 7.4, 83.22), formTick(choice('budget') === 'Rs 20 - 40 Lakhs', 7.4, 85.02),
    formTick(choice('budget') === 'Rs 40 Lakhs+', 7.4, 86.82), formField(formatDate(getField('startDate')), 30.4, 80.10, 16.5), formField(formatDate(getField('moveInDate')), 30.4, 86.10, 16.5),
    formTick(decision('Self'), 49.8, 79.62), formTick(decision('Spouse'), 49.8, 81.42), formTick(decision('Parents'), 49.8, 83.22),
    formTick(decision('Business Partners'), 49.8, 85.02), formTick(decision('Other'), 49.8, 86.82), formField(getField('decisionOther'), 60.0, 87.03, 13.2),
    formTick(choice('otherFirms') === 'Yes', 76.4, 80.48), formTick(choice('otherFirms') === 'No', 76.4, 82.15), formField(getField('otherFirmName'), 80.1, 84.95, 11.0),

    formTick(choice('siteVisit') === 'Yes', 7.4, 93.05), formTick(choice('siteVisit') === 'No', 7.4, 94.87), formField(formatDate(getField('meetingDate')), 22.8, 93.65, 11.4),
    formTick(contact('Call'), 36.8, 93.05), formTick(contact('WhatsApp'), 36.8, 94.87), formTick(contact('Email'), 36.8, 96.69),
    formField(getField('consultantNotes'), 55.0, 92.00, 38.6, 'notes'), formField(getField('consultantName'), 70.2, 96.92, 17.2), formField(getField('signature'), 70.2, 98.52, 17.2)
  ].join('');

  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>INT360 Completed Client Brief</title><style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 210mm; height: 297mm; background: #fff; }
    .page { position: relative; width: 210mm; height: 297mm; overflow: hidden; }
    .template { display: block; width: 100%; height: 100%; }
    .value { position: absolute; color: #29211d; overflow: hidden; white-space: nowrap; text-overflow: clip; font: 500 2.1mm/1.15 Arial, sans-serif; letter-spacing: .01em; }
    .address { height: 3.5%; white-space: normal; line-height: 1.32; }
    .note { height: 6.6%; white-space: pre-wrap; line-height: 1.42; font-size: 1.7mm; }
    .notes { height: 3.8%; white-space: pre-wrap; line-height: 1.35; font-size: 1.65mm; }
    .tick { position: absolute; color: #2c251f; font: 700 2.5mm/1 Arial, sans-serif; }
    @media print { html, body, .page { width: 210mm; height: 297mm; } }
  </style></head><body><div class="page"><img class="template" src="${templateUrl}" alt="INT360 client information form">${fields}</div><script>window.addEventListener('load', function () { var image = document.querySelector('img'); var print = function () { setTimeout(function () { window.print(); }, 180); }; image.complete ? print() : image.addEventListener('load', print); });</script></body></html>`;
}

function downloadExactPdf() {
  if (!form.reportValidity()) return;
  const budgetValues = {
    'Below Rs 5 Lakhs': 'Below 5 Lakhs',
    'Rs 5 - 10 Lakhs': '5-10 Lakhs',
    'Rs 10 - 20 Lakhs': '10-20 Lakhs',
    'Rs 20 - 40 Lakhs': '20-40 Lakhs',
    'Rs 40 Lakhs+': '40 Lakhs+'
  };
  const selectedBudget = getChoice('budget');
  const client = getField('clientName') || 'Client';
  const payload = {
    title: `INT360 Client Brief - ${client}`,
    print: true,
    values: {
      date: formatDate(document.querySelector('#form-date').value),
      'client-name': getField('clientName'),
      mobile: getField('mobile'),
      email: getField('email'),
      address: getField('address'),
      occupation: getField('occupation'),
      'source-other': getField('sourceOther'),
      'project-other': getField('projectTypeOther'),
      location: getField('location'),
      area: getField('area'),
      'area-other': getField('areasOther'),
      preferences: getField('preferences'),
      'start-date': formatDate(getField('startDate')),
      'move-in-date': formatDate(getField('moveInDate')),
      'decision-other': getField('decisionOther'),
      'firm-name': getField('otherFirmName'),
      'meeting-date': formatDate(getField('meetingDate')),
      'consultant-notes': getField('consultantNotes'),
      'consultant-name': getField('consultantName'),
      signature: getField('signature')
    },
    checks: {
      source: getValues('source'),
      'project-type': [getChoice('projectType')],
      status: [getChoice('propertyStatus')],
      bedrooms: [getChoice('bedrooms')],
      areas: getValues('areas'),
      style: getValues('style'),
      budget: [budgetValues[selectedBudget] || selectedBudget],
      decision: getValues('decisionMakers'),
      'other-firms': [getChoice('otherFirms')],
      'site-visit': [getChoice('siteVisit')],
      contact: getValues('contact')
    }
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const pdfWindow = window.open(`exact-replica.html#${encoded}`, 'int360-completed-brief');
  if (!pdfWindow) {
    notify('Please allow pop-ups, then select Download exact PDF again.');
    return;
  }
  notify('Your completed code-built form is opening. Choose “Save as PDF” in the print dialog.');
}

document.querySelector('#save-pdf').addEventListener('click', () => {
  downloadExactPdf();
  // Clear saved data and reset form for new client
  clearSavedData();
  form.reset();
  document.querySelector('#form-date').valueAsDate = new Date();
  notify('Form cleared - ready for new client');
});

document.querySelector('#save-board').addEventListener('click', () => {
  notify('Your print dialog is open - choose “Save as PDF” to download the mood board.');
  window.setTimeout(() => printWithName('mood-board'), 120);
});
