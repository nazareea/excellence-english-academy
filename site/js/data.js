/* ==========================================================
   RESOURCES DATA FILE
   ----------------------------------------------------------
   This file holds everything that changes often:
     - GRADES: the grade list shown in the ruler and grade grid
     - RESOURCES: every downloadable video / audio / image / PDF

   To publish real files:
     1. In your GitHub repo, add folders like /assets/videos,
        /assets/audio, /assets/images, /assets/pdfs and upload
        your real files there.
     2. Add or edit one entry below per file, pointing "file"
        (and "thumb" for videos) at that path.
   Everything here is example data — replace it with your
   real lessons.
   ========================================================== */

/* ---------------- Grade data ----------------
     Edit this list to match your real syllabus per grade. */
  var GRADES = [
    {n:1,  title:"Grade 1",  desc:"Letters, sounds, and first sight words."},
    {n:2,  title:"Grade 2",  desc:"Simple sentences and everyday vocabulary."},
    {n:3,  title:"Grade 3",  desc:"Nouns, verbs and building longer sentences."},
    {n:4,  title:"Grade 4",  desc:"Tenses, adjectives and short paragraph writing."},
    {n:5,  title:"Grade 5",  desc:"Reading comprehension and grammar in context."},
    {n:6,  title:"Grade 6",  desc:"Clauses, punctuation and structured paragraphs."},
    {n:7,  title:"Grade 7",  desc:"Reported speech, tenses in depth, essay basics."},
    {n:8,  title:"Grade 8",  desc:"Advanced grammar and formal writing skills."},
    {n:9,  title:"Grade 9",  desc:"SMILE Series grammar core and exam technique."},
    {n:10, title:"Grade 10", desc:"SMILE Series continued, extended composition."},
    {n:11, title:"Grade 11", desc:"Exam-focused grammar review and full practice papers."}
  ];

  /* ---------------- Resource data ----------------
     This is the whole media library. To publish real files:
       1. In your GitHub repo, add folders like /assets/videos, /assets/audio,
          /assets/images, /assets/pdfs and upload your files there.
       2. Add one entry below per file, pointing "file" at that path.
     Everything here is example data — replace it with your real lessons. */
  var RESOURCES = [
    {type:"video", grade:9,  title:"Present Perfect vs Past Simple", meta:"12:04 · MP4", file:"assets/videos/grade9-present-perfect.mp4", thumb:"assets/videos/grade9-present-perfect.jpg"},
    {type:"video", grade:11, title:"Full Grammar Exam Walkthrough",  meta:"28:40 · MP4", file:"assets/videos/grade11-exam-walkthrough.mp4", thumb:"assets/videos/grade11-exam-walkthrough.jpg"},
    {type:"video", grade:6,  title:"Punctuation Basics",             meta:"9:15 · MP4",  file:"assets/videos/grade6-punctuation.mp4", thumb:"assets/videos/grade6-punctuation.jpg"},
    {type:"audio", grade:3,  title:"Everyday Vocabulary — Listening", meta:"6:20 · MP3", file:"assets/audio/grade3-vocabulary.mp3"},
    {type:"audio", grade:8,  title:"Pronunciation: Word Stress",      meta:"8:05 · MP3", file:"assets/audio/grade8-word-stress.mp3"},
    {type:"image", grade:2,  title:"Sight Words Poster",              meta:"JPG",        file:"assets/images/grade2-sight-words.jpg"},
    {type:"image", grade:7,  title:"Tenses Reference Chart",          meta:"PNG",        file:"assets/images/grade7-tenses-chart.png"},
    {type:"pdf",   grade:9,  title:"SMILE Series — Unit 3 Worksheet", meta:"PDF",        file:"assets/pdfs/grade9-unit3-worksheet.pdf"},
    {type:"pdf",   grade:10, title:"Mid-Term Practice Exam",          meta:"PDF",        file:"assets/pdfs/grade10-midterm-exam.pdf"},
    {type:"pdf",   grade:11, title:"Final Exam — Past Paper",         meta:"PDF",        file:"assets/pdfs/grade11-final-past-paper.pdf"}
  ];
