"""Build an offline HTML file and a portable source archive; no external packages."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
output = root / 'dist'
output.mkdir(exist_ok=True)
html = (root / 'template.html').read_text(encoding='utf-8')
for marker, filename in [
    ('STYLES', 'style.css'), ('RULES', 'rules.js'), ('MODEL', 'model.js'),
    ('ART', 'render-utils.js'), ('UI', 'ui.js'),
]:
    html = html.replace('/*' + marker + '*/', (root / filename).read_text(encoding='utf-8'))
(output / 'index.html').write_text(html, encoding='utf-8', newline='\n')

# Explicit export list prevents local metadata, credentials and hosting identity
# from being included in the downloadable source project.
files = [
    'README.md', 'CONTRIBUTING.md', 'AGENTS.md', '.gitignore', '.gitattributes',
    'package.json', 'build.py', 'model.js', 'render-utils.js', 'rules.js',
    'rules.json', 'style.css', 'template.html', 'ui.js', 'dist/index.html',
]
for folder in ['tests', 'docs', 'scripts', '.github']:
    files.extend(str(p.relative_to(root)).replace('\\', '/')
                 for p in sorted((root / folder).rglob('*')) if p.is_file())
with ZipFile(output / 'source.zip', 'w', ZIP_DEFLATED) as archive:
    for name in sorted(files):
        archive.write(root / name, name)
print(f'Built dist/index.html ({len(html):,} characters) and dist/source.zip')
