import { generateHTML, generateResumeHTML } from '../src/renderer.js';

const data = {
  title: 'Jane Dev — Portfolio',
  name: 'Jane Dev',
  subtitle: 'Backend Engineer',
  body: '<h2>About</h2><p>I build things.</p>',
  social: [
    { label: 'GitHub', url: 'https://github.com/janedev' },
    { label: 'Website', url: 'https://jane.dev' },
  ],
};

describe('generateHTML', () => {
  test('embeds name, subtitle, body and social links', () => {
    const html = generateHTML(data, 'noir');
    expect(typeof html).toBe('string');
    expect(html).toContain('Jane Dev');
    expect(html).toContain('Backend Engineer');
    expect(html).toContain('<h2>About</h2>');
    expect(html).toContain('https://github.com/janedev');
    expect(html).toContain('https://jane.dev');
  });

  test('every theme yields distinct output', () => {
    const themes = ['noir', 'terminal', 'slate', 'paper', 'rose', 'forge'];
    const outputs = themes.map((t) => generateHTML(data, t));
    for (let i = 0; i < outputs.length; i++) {
      for (let j = i + 1; j < outputs.length; j++) {
        expect(outputs[i]).not.toEqual(outputs[j]);
      }
    }
  });

  test('survives empty social list', () => {
    const html = generateHTML(
      { title: 'T', name: 'N', subtitle: 'S', body: '<p>x</p>', social: [] },
      'noir'
    );
    expect(html).toContain('N');
  });
});

describe('generateResumeHTML', () => {
  test('produces a distinct, name-bearing document', () => {
    const resume = generateResumeHTML(data);
    expect(resume).toContain('Jane Dev');
    expect(resume).not.toEqual(generateHTML(data, 'noir'));
  });
});