# Excellence English Academy — Exam App (Grade → Unit → Lesson → Video → Quiz)

This is the standalone exam-system app you shared, extended to the full
**11 grades × 8 units × 8 lessons** structure. Each lesson has its own video
and a short quiz — pass the quiz (70%+) to unlock the next lesson.

## Flow

1. **Select a grade** → see its 8 units
2. **Open a unit** (Unit 1 always unlocked; later units unlock once every
   lesson in the previous unit is passed) → see its 8 lessons
3. **Open a lesson** (Lesson 1 always unlocked; later lessons unlock once
   the previous lesson's quiz is passed) → watch the video, then take the quiz
4. **Quiz**: same modal/timer/style as before — 15 seconds per question,
   70% or more to pass. Passing unlocks the next lesson.

Progress is stored per-grade in `localStorage` — it just works once this is
hosted on a real page (GitHub Pages, etc.).

## Folder structure

```
index.html
style.css
js/
  grade1.js … grade11.js   — curriculum data: units, lessons, video paths, quiz questions
  script.js                — navigation + gating + quiz engine
videos/
  grade{N}/unit{U}/lesson{L}/   — drop your video file in here, named lesson{L}.mp4
```

## What's real vs. placeholder

- **Grade 9, Unit 1 ("Back to School")** is fully populated — real lesson
  titles and real quiz questions for all 8 lessons. Try it end-to-end right now.
- **Every other lesson** across all 11 grades has the correct folder/data
  wiring already in place, with 2 placeholder `TODO` questions per lesson —
  edit the `questions` array directly in the matching `js/gradeN.js` file.
- Video files aren't included — drop your own `.mp4` into the matching
  `videos/gradeN/unitU/lessonL/` folder (same naming convention as your main
  site, so the [[rename_videos.py]] tool works here too).

## Uploading to GitHub

Push the whole folder as-is. If using GitHub Pages, set the Pages source to
the repo root (where `index.html` lives).


## Navigation

A fixed header + collapsible side nav (WebSchool-style) sits on top of the
grade/unit/lesson flow. On mobile it's a hamburger menu with an overlay; on
desktop (1024px+) it's always open and the content shifts right of it.
The **Grades** link always takes you back to grade selection. Social links
in the nav are placeholders — drop your real profile URLs into the `href`
attributes in `index.html`.
