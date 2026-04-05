# Rishi Mule — Developer Portfolio

Personal portfolio: [rishimule.dev](https://rishimule.dev)

## Updating Content

All portfolio content lives in the `data/` directory as JSON files:

| File | Contains |
|------|----------|
| `data/personal.json` | Name, title, bio, contact info, social links |
| `data/experience.json` | Work experience entries |
| `data/education.json` | Education entries |
| `data/projects.json` | Projects (set `featured: true` for hero-sized layout) |
| `data/skills.json` | Skill categories and items |
| `data/publications.json` | Published papers |
| `data/certifications.json` | Professional certifications |

To update: edit the relevant JSON file, commit, and push. GitHub Pages will serve the changes automatically.

## Local Development

```bash
# Requires Python 3
python -m http.server 8000
# Open http://localhost:8000
```

A local server is required because the site uses `fetch()` to load JSON data files, which doesn't work with the `file://` protocol.
