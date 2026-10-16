# Python Workshop — Reference-inspired learning path

**Language:** English throughout the website and curriculum.

A complete front-end learning site built with React, Vite, and Tailwind CSS. Its information architecture and dark-green visual direction closely follow the user-provided JavaScript workshop video: compact left sidebar, concept pages, vertically stacked VS Code challenges, and guided walkthrough dialogs. The content itself is entirely about Python, independently written in English.

## What's inside

- **18 learning stages:** the 11 core concepts mirror the JavaScript workshop progression (variables, operators, conditions, advanced conditions, loops, advanced loops, lists, strings, functions, dictionaries, search and sorting). Seven additional stages cover files/JSON, exceptions, environments, OOP, testing, data preparation, and projects.
- **100 challenges:** unique prompts, sample expectations, hints, three-step guided reasoning and a reference solution. The final four are capstone projects with **architecture starters**, not turnkey implementations.
- **Glossary:** 30 terms.
- **Progress tracking:** learners explicitly mark exercises complete in their browser; stored locally using `localStorage` (not synchronized across devices).
- **VS Code-first workflow:** there is deliberately *no embedded editor*. Each challenge offers a download of a starter `.py` containing instructions, while the explanation dialog reveals example code when requested.
- **Responsive:** sidebar adapts to a drawer on narrow screens.

## Requirements

- Node.js 20.19+ or 22.12+ is recommended by modern Vite. Node.js 22 LTS is a reliable choice.
- To run the examples in VS Code, install **Python 3.11+** separately and select its interpreter in VS Code.

## Development

```bash
npm install
npm run dev
```

Vite will display a local URL, typically `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

This emits the production site in `dist/`. No runtime server is required once deployed.

## Deploy to Vercel

1. Upload this project's files to a GitHub repository (put `package.json` at the root).
2. Vercel → **Add New Project** → Import the repository.
3. Framework: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Deploy. No server environment variables or API keys are required.

## Recommended learning workflow

1. Read the learning notes and the short code example for the concept.
2. For each challenge, download its `.py` starter or create the file yourself in VS Code.
3. Solve it, run it, try normal and edge cases, and debug errors independently.
4. Only then open **View guided solution**. The walkthrough is visible first; reference code is hidden until **Reveal code**.
5. Mark it as done *only after solving*, then move to the next exercise.
6. Attempt the final project without copying the provided starter architecture.

## Notes & limitations

- This is a **self-paced guide**, not a Python execution or auto-grading service. Progress is self-reported; exercises are solved outside the website.
- Examples in advanced modules can include paths and terminal commands; these are marked in the tasks and require actual files/terminal in VS Code.
- The capstone solution area gives a **partial starting architecture**, not a complete reference implementation. Build the remaining features independently.
- Progress can be reset from the website footer. Clearing browser storage also clears progress.
- Completing the workshop is a great preparation for advanced Python and a later dedicated NumPy/Pandas/ML curriculum, but proficiency depends on independent practice, correct results, and handling unfamiliar problems.
