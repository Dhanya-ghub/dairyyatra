import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

/* Alumni photos: put the image files in  src/assets/alumni/  (a file straight in src/assets/ also works).
   In the list below, just write the file name, e.g.  photo: 'a1.jpeg'
   Leave photo empty ('') and the person's initials are shown instead.
   If a photo does not show, open the browser console (F12): it tells you which files were found. */
const PHOTO_FILES = import.meta.glob(
  ['../assets/alumni/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', '../assets/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'],
  { eager: true, import: 'default' }
);

const warned = new Set();

const photoUrl = (file) => {
  if (!file) return '';
  // A full web address, or a path from the public folder ('/alumni/x.jpg'), is used as it is
  if (/^(https?:)?\/\//.test(file) || file.startsWith('/')) return file;
  const key = Object.keys(PHOTO_FILES).find((k) => k.split('/').pop().toLowerCase() === file.toLowerCase());
  if (!key && import.meta.env.DEV && !warned.has(file)) {
    warned.add(file);
    const found = Object.keys(PHOTO_FILES).map((k) => k.split('/').pop());
    console.warn(
      `[Alumni] No image named "${file}" was found.\n` +
        `Images the app can see: ${found.length ? found.join(', ') : '(none)'}\n` +
        'Put the file in src/assets/alumni/ and restart "npm run dev".'
    );
  }
  return key ? PHOTO_FILES[key] : '';
};

/* The alumni shown on the site. `quote` is a list of paragraphs. Leave `role` empty ('') to hide that line.
   Long quotes are cut to a few lines with a "Read more" button. */
const ALUMNI = [
  {
    name: 'Mr Jaya Kumar',
    role: 'Founder, Raja Farms',
    photo: 'jayakumar.jpg',
    quote: [
      'My Dairy Yatra learning was a truly memorable experience. Travelling across six states gave me the opportunity to visit renowned institutions like Banas, Amul, NDDB, and PDFA, along with several progressive dairy farms and units.',
      'Every day was a new learning experience. I got to understand not only more about cows but also about buffaloes, camels, and different dairy farming practices. Each visit gave me something new to learn, and the experience was filled with curiosity, happiness, and practical insights.',
      'I am truly grateful to Kumaraguru and its management for organising this wonderful Yatra. It gave me the opportunity to see dairy farming from a broader perspective and strengthened my interest and passion for the dairy sector and also I am proud to be a part of the KCT family.',
    ],
  },
  {
    name: 'Ms Santhra',
    role: 'CEO, Pariyur FPO',
    photo: 'santhra.jpg',
    quote: [
      'Dairy Yathra was a truly enriching experience that broadened my perspective, introduced me to new learning opportunities, and connected me with like-minded and inspiring people from across the dairy sector. It has also helped me learn a lot from pioneering industries and, in turn, give back to my farming community.',
    ],
  },
  {
    name: 'Mrs Senthamil Selvi',
    role: 'Dairy Farmer',
    photo: 'senthamil.jpg',
    quote: [
      'The Dairy Yatra was a turning point for me. Before the Yatra, my daily milk production was only 30 litres. After learning new techniques and gaining valuable knowledge, I increased my milk production to 70 litres per day. This experience has motivated me to improve my dairy farming practices and achieve even greater success.',
    ],
  },
  {
    name: 'Mr Ragotham',
    role: 'Student, KCT-BS (Agri)',
    photo: 'ragotham.jpg',
    quote: [
      'Dairy Yatra was a wonderful learning experience that gave me the opportunity to explore dairy farming, processing, cooperatives, and entrepreneurship across 7 states. It helped me understand how the dairy sector works on the ground, interact with people from different backgrounds, and gain a better understanding of the challenges and opportunities in the sector.',
    ],
  },
];

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled. On laptops and desktops
   (lg and up) the section is one full page: it fills the screen below the header. */
const HEADER_HEIGHT = '60px';
const MAX_PER_ROW = 5;                                 // most cards in one row on laptops and desktops

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/* The testimonial: cut to a few lines, with Read more / Read less when it is long */
function Quote({ paragraphs }) {
  const [open, setOpen] = useState(false);
  const long = paragraphs.join(' ').length > 260;
  return (
    <>
      <div className={`dy-al-quote${long && !open ? ' is-clamped' : ''}`}>
        {paragraphs.map((text, i) => (
          <p key={i}>
            {i === 0 && '“'}
            {text}
            {i === paragraphs.length - 1 && '”'}
          </p>
        ))}
      </div>
      {long && (
        <button type="button" className="dy-al-more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </>
  );
}

export default function AlumniSection({ id = 'alumni' }) {
  if (ALUMNI.length === 0) return null;

  return (
    <section
      id={id}
      className="dy-al px-4 font-sans sm:px-6"
      style={{ '--hh': HEADER_HEIGHT, '--n': Math.min(ALUMNI.length, MAX_PER_ROW) }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        .dy-al {
          scroll-margin-top: var(--hh);
          padding-top: clamp(44px, 8vw, 72px);
          padding-bottom: clamp(48px, 8vw, 80px);
          color: #1E1E28;
          background: #fff;
        }
        .dy-al-wrap {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* Two-tone title: first word grey, second word dark */
        .dy-al-title {
          margin: 0;
          text-align: center;
          font-family: 'Anton', Impact, 'Arial Narrow Bold', sans-serif;
          font-weight: 400;
          font-size: clamp(44px, 7vw, 80px);
          line-height: 1;
          letter-spacing: .005em;
        }
        .dy-al-title-a { color: #808084; }
        .dy-al-title-b { color: #1E1E28; }

        /* Cards: 2 in a row on phones, 3 on tablets, all in one row on laptops */
        .dy-al-list {
          --cols: 2;
          --gap: clamp(16px, 4vw, 52px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: clamp(36px, 5vw, 56px) var(--gap);
          margin: clamp(36px, 6vw, 84px) 0 0;
          padding: 0;
          list-style: none;
        }
        .dy-al-card {
          display: flex;
          min-width: 0;
          flex: 0 0 calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols) - .1px);
          flex-direction: column;
        }

        .dy-al-photo {
          position: relative;
          flex: none;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          border-radius: 6px;
          background: #E4E4E4;
        }
        .dy-al-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 25%;
          user-select: none;
        }
        .dy-al-initials {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #EDEDED, #CFCFCF);
          color: #8A8A8E;
          font-family: 'Anton', Impact, sans-serif;
          font-size: clamp(34px, 5vw, 56px);
          letter-spacing: .04em;
        }

        /* Name block. It grows so that every card in a row is the same height,
           and its text always sits against the photo. */
        .dy-al-info {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: clamp(16px, 2vw, 22px);
          text-align: left;
        }
        .dy-al-name {
          margin: 0;
          color: #1E1E28;
          font-size: clamp(14px, 1.25vw, 16px);
          font-weight: 700;
          line-height: 1.25;
        }
        .dy-al-role {
          margin: 6px 0 0;
          color: #9A9A9E;
          font-size: clamp(10px, .9vw, 11.5px);
          font-weight: 600;
          letter-spacing: .14em;
          line-height: 1.35;
          text-transform: uppercase;
        }
        /* thin rule with a small ring in the middle */
        .dy-al-rule {
          height: 1px;
          margin: 12px 0;
          background: #DEDEDE;
        }
        .dy-al-quote {
          color: #5F5F66;
          font-size: clamp(13px, 1.05vw, 14.5px);
          line-height: 1.6;
        }
        .dy-al-quote p { margin: 0 0 .7em; }
        .dy-al-quote p:last-child { margin-bottom: 0; }
        .dy-al-quote.is-clamped {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
        }
        .dy-al-more {
          align-self: flex-start;
          margin-top: 8px;
          padding: 0;
          border: 0;
          background: none;
          color: #2B6CB0;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .dy-al-more:hover { text-decoration: underline; }

        /* Phones: the cards sit side by side in a row you swipe through.
           Tablets: 2 per row. Laptops: all side by side. */
        @media (max-width: 639px) {
          .dy-al-list {
            flex-wrap: nowrap;
            justify-content: flex-start;
            gap: 16px;
            margin-left: -16px;
            margin-right: -16px;
            padding: 0 16px 6px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 16px;
            scrollbar-width: none;
          }
          .dy-al-list::-webkit-scrollbar { display: none; }
          .dy-al-card { flex: 0 0 78%; scroll-snap-align: start; }
          .dy-al-hint { display: block; }
        }
        @media (min-width: 640px) {
          .dy-al-list { --cols: 2; }
        }
        .dy-al-hint {
          display: none;
          margin: 14px 0 0;
          color: #9A9A9E;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .12em;
          text-align: center;
          text-transform: uppercase;
        }
        /* Laptops and desktops: one full page below the header, content centred in it */
        @media (min-width: 1024px) {
          .dy-al {
            display: flex;
            min-height: calc(100vh - var(--hh));
            align-items: center;
            padding-top: clamp(20px, 4vh, 56px);
            padding-bottom: clamp(20px, 4vh, 56px);
          }
          @supports (height: 100svh) {
            .dy-al { min-height: calc(100svh - var(--hh)); }
          }
          .dy-al > * { width: 100%; }
          .dy-al-title { font-size: clamp(40px, min(7vw, 10vh), 80px); }
          .dy-al-list { --cols: var(--n); margin-top: clamp(24px, 7vh, 84px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dy-al-more { transition: none; }
        }
      `}</style>

      <ScrollReveal animation="fade-up" delay={100} duration={700}>
        <div className="dy-al-wrap">
          <h2 className="dy-al-title">
            <span className="dy-al-title-a">Our</span> <span className="dy-al-title-b">Alumni</span>
          </h2>

          <ul className="dy-al-list">
            {ALUMNI.map((alumnus) => {
              const photo = photoUrl(alumnus.photo);
              return (
                <li key={alumnus.name} className="dy-al-card">
                  <div className="dy-al-photo">
                    {photo ? (
                      <img
                        src={photo}
                        alt={alumnus.name}
                        loading="lazy"
                        draggable={false}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="dy-al-initials" aria-hidden="true">{initials(alumnus.name)}</span>
                    )}
                  </div>
                  <div className="dy-al-info">
                    <h3 className="dy-al-name">{alumnus.name}</h3>
                    {alumnus.role && <p className="dy-al-role">{alumnus.role}</p>}
                    <div className="dy-al-rule" aria-hidden="true" />
                    <Quote paragraphs={alumnus.quote} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="dy-al-hint" aria-hidden="true">Swipe for more &rarr;</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
