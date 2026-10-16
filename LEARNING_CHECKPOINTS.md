# Learning checkpoints — Python Workshop

This curriculum works best when you use the **site to understand and review**, but use **VS Code to write and run all Python code**. The website does not automatically judge your solutions.

## Setup: the first 15 minutes

1. Install Python 3.11+ and the VS Code Python extension.
2. Create a directory called `python-practice` and open it in VS Code.
3. Run `python --version` (or `python3 --version`) in the integrated terminal.
4. Create `01-variables.py`, add `print("Hello, Python!")`, and run it from the terminal.
5. Keep one directory per stage, and **type solutions yourself** before checking walkthroughs.

## Checkpoint 1 — Stages 01–04: expressions and decisions

You should be able to work with input, conversions, operators, ranges, and boolean rules. Implement a program that validates usernames and classifies test scores **without opening the reference**.

## Checkpoint 2 — Stages 05–06: control flow

You should be able to explain every iteration of a loop and know why it terminates. Implement number guessing with a count of attempts, a multiplication table, and a prime check.

## Checkpoint 3 — Stages 07–10: data structures and functions

You should know when to choose a list, tuple, dictionary, or set. Write a small function-based contacts manager with add/search/delete commands. Test empty inputs and duplicates.

## Checkpoint 4 — Stage 11: algorithms

You should implement linear search, binary search (on sorted input only), and one manual sorting algorithm. Explain their typical time complexity and what happens when the target is missing.

## Checkpoint 5 — Stages 12–14: practical Python

You should create a local project using a virtual environment, split code across modules, handle expected exceptions, and read/write JSON. Explain why copying an entire `.venv` to Git is a bad idea.

## Checkpoint 6 — Stages 15–17: software quality and data foundations

You should model one small domain with classes or dataclasses, test its behavior with pytest, and transform a list of records, including missing values. Be able to distinguish an empty input, a zero value, and a missing value.

## Final assessment — Stage 18

Choose the final Library Manager project and work independently. Minimum features:

- Add/list/search/borrow/return books.
- Validate duplicate IDs, unknown IDs, and already-borrowed books.
- Persist state as JSON.
- Write at least six passing automated tests, including error paths and empty inputs.
- Organize code into coherent functions/modules and document how to run it.

**Completion standard:** not “I opened all the pages”, but “I built and debugged the final project without copying the reference architecture”. If stuck, revisit the specific concepts before moving on.

## After completion

The next programming topics for an AI engineering path are **NumPy, Pandas, data visualization, probability/statistics, and classical machine learning**. You do not need to master advanced Python internals first, but you should be confident with core data structures, functions, testing, and file handling.
