import React from 'react';
import ScrollReveal from './ScrollReveal';
import alumnusThreePhoto from '../assets/a3.jpeg';

/* Alumni photos: put the image files in  src/assets/alumni/  (a file straight in src/assets/ also works).
   In the list below, just write the file name, e.g.  photo: 'a1.jpeg'
   Leave photo empty ('') and the person's initials are shown instead.
   The photos are shown in black and white automatically, so any colour photo works.
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

/* 👉 Replace the two placeholder entries with alumni details when they're ready to be shown.
   The cards alternate by themselves: 1st photo on top, 2nd photo at the bottom, and so on. */
const ALUMNI = [
  { name: 'Shanthra P', role: 'CEO, Pariyur FPO', quote: 'Great learning journey filled with new experiences and memories', photo: 'a1.jpeg' },
  { name: 'Ragotham', role: 'Student, KCT-BS (Agri)', quote: 'I had a great learning experience by visiting and gaining practical exposure to various dairy units and institutions.', photo: 'a2.jpeg' },
  { name: 'Arunkumar Krishnamoorthy', role: 'Senior Executive', quote: 'Across fertile plains and pastoral trails: a journey into the heart of Indias living dairy heritage.', photo: alumnusThreePhoto },
  { name: 'Alumni 04', role: 'Role, Organisation', quote: "Add this alumnus's Yatra experience and testimonial here.", photo: '' },
  { name: 'Alumni 05', role: 'Role, Organisation', quote: "Add this alumnus's Yatra experience and testimonial here.", photo: '' },
];

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled. On laptops and desktops
   (lg and up) the section is one full page: it fills the screen below the header. */
const HEADER_HEIGHT = '60px';
const MAX_PER_ROW = 5;                                 // most cards in one row on laptops and desktops

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

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
        /* every second card is turned over: name block on top, photo below */
        .dy-al-card:nth-child(even) { flex-direction: column-reverse; }

        .dy-al-photo {
          position: relative;
          flex: none;
          overflow: hidden;
          aspect-ratio: 9 / 10;
          background: #E4E4E4;
        }
        .dy-al-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 18%;
          filter: grayscale(1) contrast(1.04);
          transition: filter .45s ease;
          user-select: none;
        }
        .dy-al-card:hover .dy-al-photo img { filter: none; }
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
          padding-top: clamp(18px, 2.4vw, 28px);
          text-align: center;
        }
        .dy-al-card:nth-child(even) .dy-al-info {
          justify-content: flex-end;
          padding-top: 0;
          padding-bottom: clamp(18px, 2.4vw, 28px);
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
          position: relative;
          height: 1px;
          margin: 14px 0 12px;
          background: #D6D6D6;
        }
        .dy-al-rule::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 7px;
          height: 7px;
          box-sizing: border-box;
          border: 1px solid #BDBDBD;
          border-radius: 50%;
          background: #fff;
          transform: translate(-50%, -50%);
        }
        .dy-al-quote {
          margin: 0;
          color: #77777C;
          font-size: clamp(12px, 1.05vw, 13.5px);
          line-height: 1.5;
        }

        @media (min-width: 640px) {
          .dy-al-list { --cols: 3; }
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
          .dy-al-photo img { transition: none; }
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
                    <p className="dy-al-role">{alumnus.role}</p>
                    <div className="dy-al-rule" aria-hidden="true" />
                    <p className="dy-al-quote">&ldquo;{alumnus.quote}&rdquo;</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
