function localOrganizeFree(text) {
  const lower = text.toLowerCase();
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text];
  const category = /\b(flight|hotel|trip|travel|airport|passport)\b/.test(lower) ? 'Travel' : /\b(school|teacher|class|student|exam|assignment)\b/.test(lower) ? 'School' : /\b(doctor|dentist|appointment|clinic|medical|prescription)\b/.test(lower) ? 'Health' : /\b(meeting|project|client|work|team|deadline)\b/.test(lower) ? 'Work' : /\b(payment|statement|bill|invoice|subscription|autopay)\b/.test(lower) ? 'Finance' : 'Personal';
  const dates = [...text.matchAll(/\b(?:by|before|on|due|at)\s+((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,\s*\d{4})?|tomorrow|today)/gi)].map(m => m[1]);
  const actions = sentences.filter(s => /\b(please|must|need to|remember|confirm|submit|book|call|pay|renew|register|bring|complete|send|review|due)\b/i.test(s)).map(s => s.trim().replace(/[.!?]+$/, '')).slice(0, 3);
  const labels = { Travel:'Travel plans, organized', School:'School update, organized', Health:'Appointment and health plan', Work:'Work action plan', Finance:'Statement and payment plan', Personal:'Your next actions' };
  const tasks = actions.map((action, i) => [action.charAt(0).toUpperCase() + action.slice(1), category, i === 0 ? 'High' : 'Medium', dates[i] ? `Before ${dates[i]}` : 'When convenient']);
  if (category === 'Travel') tasks.push(['Add travel details to your calendar', 'Travel', 'Medium', 'Today'], ['Check travel documents and essentials', 'Travel', 'High', 'Before departure']);
  if (category === 'School') tasks.push(['Add the school deadline to your calendar', 'School', 'High', dates[0] ? `Before ${dates[0]}` : 'This week'], ['Prepare required materials', 'School', 'Medium', 'Before the deadline']);
  if (category === 'Health') tasks.push(['Add the appointment to your calendar', 'Health', 'High', dates[0] ? `Before ${dates[0]}` : 'Today'], ['Prepare questions or required documents', 'Health', 'Medium', 'Before the appointment']);
  if (category === 'Work') tasks.push(['Add the deadline to your work calendar', 'Work', 'High', dates[0] ? `Before ${dates[0]}` : 'Today'], ['Prepare the next required deliverable', 'Work', 'Medium', 'This week']);
  if (!tasks.length) tasks.push(['Review the key details in this message', category, 'High', 'Today'], ['Add important dates to your calendar', 'Planning', 'Medium', 'This week'], ['Complete the next required action', 'Personal', 'Medium', 'When ready']);
  const unique = tasks.filter((task, i, all) => all.findIndex(x => x[0] === task[0]) === i).slice(0, 4);
  const timeline = dates.length ? dates.slice(0, 3).map((date, i) => [date.toUpperCase(), actions[i] || 'Important date from this message']) : [['NEXT STEP', 'Review the message and confirm dates or commitments']];
  return { title: labels[category], urgency: /\b(urgent|today|tomorrow|overdue|due)\b/i.test(lower) ? 'high' : dates.length ? 'medium' : 'low', summary: `Local organizer found ${unique.length} practical action${unique.length === 1 ? '' : 's'} in this ${category.toLowerCase()} message. Review the checklist and confirm any details that need attention.`, dates: timeline, tasks: unique, next: unique[0][0] };
}
