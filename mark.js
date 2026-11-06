/* ═══════════════════════════════════════════════════════════════════════════
   AXIS — THE MARK

   One canvas, five formations, all of them his.

     x         the Axis X, fully green          Dark X.svg
     mashmoom  the X with the lattice packed
               into its centre                  Mashmoom Logo.svg
     word      the AXIS wordmark lockup         Dark Full Word.svg
     slot      his centre diamond, open         the SEED path, stroked
     dot       his centre diamond, closed       the SEED path, filled

   Nothing here is invented artwork. The diamond and the lattice are the only
   primitives, because they are the only ones he drew.

   ENTRANCE. On a first arrival the X does not fade in. Its diamonds converge
   out of nothing, blow apart, and gather into the solid green X.

   STATE. Every card declares the formation that belongs to it. Scrolling one
   card to the next morphs the particles from one of his marks into the next —
   a straight travel from each diamond's place in one mark to its place in the
   other, not an explosion and a reassembly. The motion is the navigation
   rather than decoration laid on top of it.

   GREEN IS AXIS, PURPLE IS MASHMOOM. His own rule, kept literally: purple
   appears only when Mashmoom's lattice is on screen.

   LIFE. At rest it breathes, leans toward the cursor, and answers the
   navigation before the click lands.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var cv = document.getElementById('mark');
if (!cv) return;
var ctx = cv.getContext('2d');
var reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
/* a finger, not a cursor: nothing on a phone should answer a hover that is
   really the start of a scroll */
var coarse = matchMedia('(hover:none),(pointer:coarse)').matches;

/* ── his geometry, path for path ────────────────────────────────────────── */
var ARMS = ['M3000 3000H2440L1600 2160L2160 1600L3000 2440V3000Z',
            'M3000 0H2440L1600 840L2160 1400L3000 560V0Z',
            'M0 0H560L1400 840L840 1400L0 560V0Z',
            'M0 3000H560L1400 2160L840 1600L0 2440V3000Z'];
var SEED = 'M1500.17 1090L1090 1500.17L1500.17 1910.33L1910.33 1500.17L1500.17 1090Z';
var LATTICE = [
 ['#9F7ACB', 'M1500.17 1910L1090 2320.17L1500.17 2730.33L1910.33 2320.17Z',
             'M2320.17 1090L1910 1500.17L2320.17 1910.33L2730.33 1500.17Z',
             'M1500.17 270L1090 680.165L1500.17 1090.33L1910.33 680.165Z',
             'M680.165 1090L270 1500.17L680.165 1910.33L1090.33 1500.17Z'],
 ['#B99FD9', 'M2080.06 920H1500V1500.06H2080.06Z', 'M2080.06 1500H1500V2080.06H2080.06Z',
             'M1500.06 920H920V1500.06H1500.06Z', 'M1500.06 1500H920V2080.06H1500.06Z'],
 ['#8456BC', 'M2010.17 580L1600 990.165L2010.17 1400.33L2420.33 990.165Z',
             'M2010.17 1600L1600 2010.17L2010.17 2420.33L2420.33 2010.17Z',
             'M990.165 580L580 990.165L990.165 1400.33L1400.33 990.165Z',
             'M990.165 1600L580 2010.17L990.165 2420.33L1400.33 2010.17Z'],
 ['#6B3FA0', 'M1500.17 580L1090 990.165L1500.17 1400.33L1910.33 990.165Z',
             'M2010.17 1090L1600 1500.17L2010.17 1910.33L2420.33 1500.17Z',
             'M1500.17 1600L1090 2010.17L1500.17 2420.33L1910.33 2010.17Z',
             'M990.165 1090L580 1500.17L990.165 1910.33L1400.33 1500.17Z'],
 ['#3A2257', 'M1499.58 1392.42L1395.71 1496.29L1499.58 1600.16L1603.45 1496.29Z']
];
/* Mashmoom Logo.svg paints two lattice groups, then the arms, then knocks the
   centre diamond straight back out in cream, then paints three more groups on
   top. The knockout is the reason the middle of the X reads as open in his file
   and it was missing here, which quietly filled a hole he had cut. */
var UNDER = 2;
var KNOCKOUT = '#1E1E1E';

/* AXIS, his own lockup: the A, the X mark itself, the I and the S */
var WORD = ['M10373 0H8971.91C8461.34 0 8117 362.5 8117 900C8117 1437.5 8461.34 1800 8971.91 1800H9565.59C9719.95 1800 9826.81 1912.5 9826.81 2075C9826.81 2237.5 9719.95 2350 9565.59 2350H8117V3000H9518.09C10028.7 3000 10373 2637.5 10373 2100C10373 1562.5 10028.7 1200 9518.09 1200H8924.41C8770.05 1200 8663.19 1087.5 8663.19 925C8663.19 762.5 8770.05 650 8924.41 650H10373V0Z',
            'M7542.26 0H7044.74C6986.89 0 6940 44.7715 6940 100V2900C6940 2955.23 6986.89 3000 7044.74 3000H7542.26C7600.11 3000 7647 2955.23 7647 2900V100C7647 44.7715 7600.11 0 7542.26 0Z',
            'M6470 3000H5910L5070 2160L5630 1600L6470 2440V3000Z',
            'M6470 0H5910L5070 840L5630 1400L6470 560V0Z',
            'M3470 0H4030L4870 840L4310 1400L3470 560V0Z',
            'M3470 3000H4030L4870 2160L4310 1600L3470 2440V3000Z',
            'M4970.17 1090L4560 1500.17L4970.17 1910.33L5380.33 1500.17L4970.17 1090Z',
            'M1007.79 95.25L7.90631 2904.75C-14.6461 2968.25 11.0489 3000 84.9912 3000H625.695C699.637 3000 747.885 2968.25 770.437 2904.75L1770.32 95.25C1792.88 31.75 1767.18 0 1693.24 0H1152.53C1078.59 0 1030.34 31.75 1007.79 95.25Z',
            'M2245.31 2903.75L1723.46 1246.25C1703.31 1182.08 1730.21 1150 1804.15 1150H2303.26C2377.21 1150 2424.71 1181.96 2445.79 1245.87L2992.59 2904.12C3013.66 2968.04 2987.23 3000 2913.29 3000H2386.45C2312.51 3000 2265.46 2967.92 2245.31 2903.75Z'];

/* The lockup in its four pieces, with where each one sits across the 10373
   grid, so the splash can drive the letters into the X. */
var W_A = [WORD[7], WORD[8]], W_X = [WORD[2], WORD[3], WORD[4], WORD[5], WORD[6]];
var W_I = [WORD[1]], W_S = [WORD[0]];
var W_MID = 10373 / 2, X_MID = 4970;
var SMASH = [[W_A, 1496], [W_I, 7293], [W_S, 9245]];

/* five purples for the lattice, one green for everything that is Axis */
var PAL = [[159,122,203],[185,159,217],[132,86,188],[107,63,160],[58,34,87],[73,142,130]];
var PALCSS = ['rgba(159,122,203,','rgba(185,159,217,','rgba(132,86,188,',
              'rgba(107,63,160,','rgba(58,34,87,','rgba(73,142,130,'];
var GREEN = 5;
/* his six only; the accent is appended later for the cursor */
function nearest(r, g, b) {
  var best = 0, bd = 1e9;
  for (var i = 0; i < 6; i++) {
    var dr = r - PAL[i][0], dg = g - PAL[i][1], db = b - PAL[i][2];
    var d = dr * dr + dg * dg + db * db;
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

/* Parsed once. The marks repaint every frame, and building a fresh Path2D from
   the string each time re-parsed the whole lockup sixty times a second. */
var PARSED = {};
function path(d) { return PARSED[d] || (PARSED[d] = new Path2D(d)); }
function fillPaths(g, list, colour) {
  g.fillStyle = colour;
  for (var i = 0; i < list.length; i++) g.fill(path(list[i]));
}
/* his centre diamond, scaled up: half-diagonal 410 becomes 900 on the 3000 grid */
function bigDiamond() {
  return 'M1500 600L600 1500L1500 2400L2400 1500Z';
}

/* ── the additive lattice ───────────────────────────────────────────────
   X to Mashmoom is not a morph and never was. Mashmoom's mark IS the X with
   the lattice packed into it, so going from one to the other means the lattice
   arrives and nothing else moves. Each piece grows about its own centre,
   ordered outward from the seed, so it reads as assembly rather than as the X
   coming apart and being rebuilt into the same silhouette. */
function pathPoints(d) {
  var out = [], re = /([MLHVZ])([^MLHVZ]*)/gi, m, x = 0, y = 0, i;
  while ((m = re.exec(d))) {
    var c = m[1].toUpperCase(), a = (m[2].match(/-?\d*\.?\d+/g) || []).map(Number);
    if (c === 'M' || c === 'L') { for (i = 0; i < a.length; i += 2) { x = a[i]; y = a[i+1]; out.push(x, y); } }
    else if (c === 'H') { for (i = 0; i < a.length; i++) { x = a[i]; out.push(x, y); } }
    else if (c === 'V') { for (i = 0; i < a.length; i++) { y = a[i]; out.push(x, y); } }
  }
  return out;
}
function pathCentre(d) {
  var p = pathPoints(d), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (var i = 0; i < p.length; i += 2) {
    if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i];
    if (p[i+1] < y0) y0 = p[i+1]; if (p[i+1] > y1) y1 = p[i+1];
  }
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}
/* every lattice piece, flattened, with where it sits and how far out it is */
var PIECES = (function () {
  var out = [];
  LATTICE.forEach(function (grp, gi) {
    for (var i = 1; i < grp.length; i++) {
      var c = pathCentre(grp[i]);
      out.push({ d: grp[i], col: grp[0], cx: c[0], cy: c[1], under: gi < UNDER,
                 r: Math.hypot(c[0] - 1500, c[1] - 1500) });
    }
  });
  var far = Math.max.apply(null, out.map(function (p) { return p.r; })) || 1;
  out.forEach(function (p) { p.t = p.r / far; });   /* 0 at the seed, 1 at the rim */
  return out;
})();
function piecePhase(p, u) {
  /* outward stagger: the middle is in place before the rim starts */
  var lead = p.t * 0.45;
  return clamp01((u - lead) / (1 - lead));
}
function paintPiece(g, p, k) {
  if (k <= 0.002) return;
  g.save();
  g.translate(p.cx, p.cy); g.scale(k, k); g.translate(-p.cx, -p.cy);
  g.fillStyle = p.col; g.fill(path(p.d));
  g.restore();
}
/* u: 0 is the plain green X, 1 is Mashmoom */
function paintAdditive(g, u) {
  var i;
  for (i = 0; i < PIECES.length; i++) if (PIECES[i].under) paintPiece(g, PIECES[i], ease(piecePhase(PIECES[i], u)));
  fillPaths(g, ARMS, '#498E82');
  fillPaths(g, [SEED], '#498E82');
  /* His knockout opens the middle of the X. It grows rather than fades: a
     cream diamond at half opacity over the green seed is just grey, and that
     grey was sitting in the middle of the mark for the whole transition. */
  var ku = ease(clamp01((u - 0.12) / 0.58));
  if (ku > 0.002) {
    g.save();
    g.translate(1500, 1500); g.scale(ku, ku); g.translate(-1500, -1500);
    fillPaths(g, [SEED], KNOCKOUT);
    g.restore();
  }
  for (i = 0; i < PIECES.length; i++) if (!PIECES[i].under) paintPiece(g, PIECES[i], ease(piecePhase(PIECES[i], u)));
}

/* ── the formations the Mashmoom page builds out of his diamonds ──────────
   Not icons. Nothing flat is added to the set: each one is a silhouette the
   same lattice assembles into and leaves again. */

/* Every formation is drawn into its own viewBox and the engine fits it. */
var FORMS = {
  x: { w: 3000, h: 3000, paint: function (g) {
        fillPaths(g, ARMS, '#498E82'); fillPaths(g, [SEED], '#498E82'); } },

  mashmoom: { w: 3000, h: 3000, paint: function (g) {
        LATTICE.slice(0, UNDER).forEach(function (grp) { fillPaths(g, grp.slice(1), grp[0]); });
        fillPaths(g, ARMS, '#498E82');
        fillPaths(g, [SEED], KNOCKOUT);
        LATTICE.slice(UNDER).forEach(function (grp) { fillPaths(g, grp.slice(1), grp[0]); }); } },

  word: { w: 10373, h: 3000, paint: function (g) { fillPaths(g, WORD, '#498E82'); } },

  slot: { w: 3000, h: 3000, paint: function (g) {
        g.strokeStyle = '#498E82'; g.lineWidth = 150; g.stroke(path(bigDiamond())); } },

  dot: { w: 3000, h: 3000, paint: function (g) { fillPaths(g, [bigDiamond()], '#498E82'); } },

  /* The three below never resolve into flat artwork. They are held as loose
     diamonds for as long as they are on screen, because a crisp vector of a
     speech bubble is exactly the stock icon this site is not allowed to use.
     The X and the Mashmoom mark are the only two marks that go solid. */

  /* the country, from the real coastline rather than a drawn blob */
  bahrain: { w: 3000, h: 3000, dust: true, paint: function (g) {
        var R = window.BAHRAIN;
        if (!R || !R.length) return;
        var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, i, j, r;
        for (i = 0; i < R.length; i++) for (j = 0; j < R[i].length; j++) {
          var p = R[i][j];
          if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
          if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
        }
        var K = Math.cos(26 * Math.PI / 180);
        var w = (x1 - x0) * K, h = y1 - y0;
        var sc = Math.min(2700 / w, 2700 / h);
        g.fillStyle = '#498E82';
        for (i = 0; i < R.length; i++) {
          r = R[i];
          if (r.length < 12) continue;
          g.beginPath();
          for (j = 0; j < r.length; j++) {
            var px = 1500 + ((r[j][0] - x0) * K - w / 2) * sc;
            var py = 1500 - ((r[j][1] - y0) - h / 2) * sc;
            if (j === 0) g.moveTo(px, py); else g.lineTo(px, py);
          }
          g.closePath(); g.fill();
        }
      } },

  /* the dialect, written out and then taken apart into diamonds */
  /* a wide short form gets more of the column than a square one, or the word
     ends up a third the height of the marks around it */
  arabic: { w: 3000, h: 1100, dust: true, boost: 1.3, paint: function (g) {
        g.fillStyle = '#6B3FA0';
        g.font = '600 720px PlexAr, serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        if (g.direction !== undefined) g.direction = 'rtl';
        g.fillText('بحريني', 1500, 560); } },

  /* The sponsor slot, as the empty plate a name gets set into. A bare diamond
     stood here before, which is the one shape that is not allowed to act as a
     mark on this site. */
  plate: { w: 3000, h: 3000, dust: true, paint: function (g) {
        g.strokeStyle = '#498E82'; g.lineWidth = 150; g.lineJoin = 'miter';
        g.stroke(path('M300 860H2700V2140H300Z'));
        g.lineWidth = 100;
        g.stroke(path('M760 1680H2240')); } },

  /* ── the work ─────────────────────────────────────────────────────────
     Six more formations, one for each kind of work Mashmoom takes on. Reaching
     for a word on that card rebuilds the mark as the thing itself: the same
     diamonds that make his logo stack into a chart, lay out a page, fill in a
     week. Nothing flat, nothing imported, no pictograms. The mark is not next
     to the work on that card, it IS the work, and it goes back to being the
     mark when you let go. */
  w_code: { w: 3000, h: 3000, dust: true, paint: function (g) {
        var rows = [[0, 1500], [260, 1050], [260, 1680], [520, 900],
                    [520, 1340], [260, 760], [0, 1900], [0, 1180],
                    [260, 1420], [260, 820]];
        var tone = ['#8456BC', '#9F7ACB', '#6B3FA0'];
        for (var i = 0; i < rows.length; i++) {
          g.fillStyle = tone[i % 3];
          g.fillRect(550 + rows[i][0], 330 + i * 260, rows[i][1], 128);
        }
        /* the caret, sitting where the next character goes */
        g.fillStyle = '#B99FD9';
        g.fillRect(550 + 260 + 820 + 70, 330 + 9 * 260 - 30, 70, 190); } },

  w_data: { w: 3000, h: 3000, dust: true, paint: function (g) {
        var h = [980, 1560, 1180, 2060, 1420, 2380];
        var tone = ['#6B3FA0', '#8456BC', '#9F7ACB'];
        for (var i = 0; i < h.length; i++) {
          g.fillStyle = tone[i % 3];
          g.fillRect(330 + i * 400, 2520 - h[i], 290, h[i]);
        }
        g.fillStyle = '#B99FD9';
        g.fillRect(260, 2560, 2480, 110); } },

  /* the letter, the form, the thing you keep putting off */
  w_admin: { w: 3000, h: 3000, dust: true, paint: function (g) {
        g.fillStyle = '#6B3FA0';
        g.fillRect(560, 260, 1880, 300);                   /* the letterhead */
        g.fillStyle = '#8456BC';
        var w = [1560, 1880, 1320, 1780, 1500, 1880, 980];
        for (var i = 0; i < w.length; i++) g.fillRect(560, 820 + i * 240, w[i], 120);
        g.fillStyle = '#B99FD9';                            /* where you sign */
        g.fillRect(560, 2620, 900, 110);
        g.fillRect(1900, 2380, 540, 350); } },

  /* it reads the pile and comes back with the line that matters */
  w_research: { w: 3000, h: 3000, dust: true, paint: function (g) {
        var c, i;
        for (c = 0; c < 3; c++) {
          for (i = 0; i < 9; i++) {
            g.fillStyle = (i === 5) ? '#B99FD9' : '#6B3FA0';
            g.fillRect(300 + c * 920, 420 + i * 250, (i === 5 ? 760 : 620), 120);
          }
        }
        g.fillStyle = '#9F7ACB';                            /* the line it found */
        g.fillRect(240, 1600, 2520, 60); } },

  /* the week, the shifts, the plan */
  w_personal: { w: 3000, h: 3000, dust: true, paint: function (g) {
        var full = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,
                    1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0];
        for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) {
          var on = full[r * 7 + c];
          g.fillStyle = on ? '#8456BC' : '#3A2257';
          g.fillRect(300 + c * 360, 760 + r * 440, 300, 360);
        }
        g.fillStyle = '#B99FD9';
        for (var d = 0; d < 7; d++) g.fillRect(300 + d * 360, 460, 300, 130); } },

  /* sometimes you just need to talk */
  w_talk: { w: 3000, h: 3000, dust: true, paint: function (g) {
        g.fillStyle = '#6B3FA0';
        g.beginPath();                                      /* you */
        g.moveTo(240, 320); g.lineTo(2140, 320); g.lineTo(2140, 1120);
        g.lineTo(900, 1120); g.lineTo(600, 1420); g.lineTo(600, 1120);
        g.lineTo(240, 1120); g.closePath(); g.fill();
        g.fillStyle = '#9F7ACB';                            /* it */
        g.beginPath();
        g.moveTo(860, 1580); g.lineTo(2760, 1580); g.lineTo(2760, 2380);
        g.lineTo(2400, 2380); g.lineTo(2400, 2680); g.lineTo(2100, 2380);
        g.lineTo(860, 2380); g.closePath(); g.fill(); } },

  /* where to find us, written out and taken apart */
  addr: { w: 3000, h: 1000, dust: true, boost: 1.3, paint: function (g) {
        g.fillStyle = '#498E82';
        g.font = '600 560px Switzer, ui-sans-serif, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('axis.bh', 1500, 500); } }
};

/* ── a morph that gets interrupted ──────────────────────────────────────
   Retargeting used to leave `from` set to the mark the old morph was heading
   for, so the diamonds jumped from wherever they actually were on screen to
   that mark's layout and set off again from there. Running the pointer quickly
   across the navigation is exactly that case, and it read as the animation
   being cancelled and then starting over.

   The live interpolated cloud is captured into a formation of its own instead,
   and the new morph starts from the positions the diamonds are actually in.
   Two slots, used in turn, because a capture reads the formation it is
   replacing. */
var SNAPS = ['__s0', '__s1'], snapTurn = 0;
SNAPS.forEach(function (k) {
  FORMS[k] = { w: 3000, h: 3000, dust: true, snap: true, fixed: 0,
               paint: function () {} };
});

/* ── sampling ───────────────────────────────────────────────────────────
   Rasterise a formation at its own aspect, then return points in a unit box
   whose LONG side spans 1, so a square mark and a wide wordmark can share one
   scale. Colour comes from the pixel, so every mark keeps its real colours. */
var LONG = 460;
/* Drawn and read back once per formation. Every try at a grid step used to draw
   it again, which at nine tries and twenty formations was 180 GPU readbacks on
   the main thread: three quarters of a second of frozen phone. */
function rasterise(form) {
  var cw = form.w >= form.h ? LONG : Math.round(LONG * form.w / form.h);
  var ch = form.w >= form.h ? Math.round(LONG * form.h / form.w) : LONG;
  var c = document.createElement('canvas'); c.width = cw; c.height = ch;
  var g = c.getContext('2d', { willReadFrequently: true });
  g.save(); g.scale(cw / form.w, ch / form.h); form.paint(g); g.restore();
  return { d: g.getImageData(0, 0, cw, ch).data, cw: cw, ch: ch };
}
function sampleForm(ras, STEP) {
  var long = LONG, cw = ras.cw, ch = ras.ch, d = ras.d, pts = [], col = [];
  for (var y = 0; y < ch; y += STEP) for (var x = 0; x < cw; x += STEP) {
    var o = (y * cw + x) * 4;
    /* The knockout is painted, not absent, so it is opaque cream. Alpha alone
       would turn his hole into a ring of particles in the nearest palette
       colour, so the background has to be excluded by colour too. */
    if (d[o + 3] > 120 && !(d[o] < 46 && d[o+1] < 46 && d[o+2] < 46)) {
      pts.push(x / long - cw / long / 2, y / long - ch / long / 2);
      col.push(nearest(d[o], d[o+1], d[o+2]));
    }
  }
  return { pts: pts, col: col, n: col.length, pitch: STEP / long };
}
function fitForm(form, want) {
  var lo = 2, hi = 26, best = null, ras = rasterise(form);
  for (var i = 0; i < 9; i++) {
    var mid = Math.max(1, Math.round((lo + hi) / 2));
    var r = sampleForm(ras, mid);
    if (!best || Math.abs(r.n - want) < Math.abs(best.n - want)) best = r;
    if (r.n > want) lo = mid; else hi = mid;
  }
  return best;
}
/* Every formation is sorted into the same spatial order, so index i lands in
   roughly the same place in all of them and each diamond travels to its nearest
   counterpart rather than across the mark.

   Z-order, not angle. Sorting by angle around the centre looked reasonable on
   paper and was badly wrong in practice: the X has ink only in four corners
   while Mashmoom fills the square, so matching them by angle sent particles on
   long crossing paths and the morph read as noise. Interleaving the bits of x
   and y keeps neighbours together in both. */
function part1by1(n) {
  n &= 0x3ff;
  n = (n | (n << 16)) & 0x030000FF;
  n = (n | (n << 8))  & 0x0300F00F;
  n = (n | (n << 4))  & 0x030C30C3;
  n = (n | (n << 2))  & 0x09249249;
  return n;
}
function morton(x, y) {
  var xi = Math.max(0, Math.min(1023, Math.round((x + 0.5) * 1023)));
  var yi = Math.max(0, Math.min(1023, Math.round((y + 0.5) * 1023)));
  return (part1by1(yi) << 1) | part1by1(xi);
}
function orderAndThin(raw, N) {
  var idx = [];
  for (var i = 0; i < raw.n; i++) idx.push([morton(raw.pts[i*2], raw.pts[i*2+1]), i]);
  idx.sort(function (p, q) { return p[0] - q[0]; });
  var out = { pts: new Float32Array(N * 2), col: new Uint8Array(N), pitch: raw.pitch };
  if (!raw.n) return out;
  for (var k = 0; k < N; k++) {
    var j = idx[Math.min(idx.length - 1, Math.floor(k * idx.length / N))][1];
    out.pts[k*2] = raw.pts[j*2]; out.pts[k*2+1] = raw.pts[j*2+1]; out.col[k] = raw.col[j];
  }
  return out;
}

/* A shape that stays as diamonds keeps every cell of the grid it was sampled
   on, in the order it was sampled. Thinning an even grid down to a target count
   is what made these look like scattered dirt instead of a lattice: it pulled
   points out at irregular intervals and left holes of different sizes. The
   array is padded by repeating, which costs a little overdraw and nothing
   else. */
function latticeSet(raw, N) {
  var out = { pts: new Float32Array(N * 2), col: new Uint8Array(N), pitch: raw.pitch,
              rep: new Uint8Array(N), restA: DOTA };
  if (!raw.n) return out;
  /* Taken straight from dust.js: walk the raw lattice in the order it was
     sampled and step evenly through it. Sorting by Morton code first, which is
     what this used to do, scrambles a regular grid into clumps and holes. */
  var step = raw.n / N, last = -1;
  for (var i = 0; i < N; i++) {
    var k = Math.min(raw.n - 1, Math.floor(i * step));
    out.pts[i*2] = raw.pts[k*2]; out.pts[i*2+1] = raw.pts[k*2+1];
    out.col[i] = raw.col[k];
    out.rep[i] = k === last ? 1 : 0;
    last = k;
  }
  /* Padded like this, each cell is stacked about three times over. At rest the
     copies sit on top of each other, so drawDust paints each cell once at the
     strength the stack adds up to: the same picture for a third of the work. The
     copies only matter in a morph, where they travel apart and the draw loop
     crosses from one to the other at each end of the travel. */
  if (step < 1) out.restA = 1 - Math.pow(1 - DOTA, 1 / step);
  return out;
}

/* ── state ──────────────────────────────────────────────────────────────── */
var W = 0, H = 0, DPR = 1, raf = 0, t = 0, tPrev = 0, N = 0;
var SET = {}, PITCH = 0.02;
var BUF = [], CNT = [], BUF2 = [], CNT2 = [], swirl, driftp, mag, ang;
var mx = -9e9, my = -9e9, pxo = 0, pyo = 0;

var INTROFORM = cv.dataset.form || 'x';
var atLanding = false;   /* the landing lets the mark own the page */
var landK = 0;           /* the same thing, eased: 1 on the landing, 0 off it */
var from = INTROFORM, to = from, hover = null;
var mix = 1;                 /* 0 at the start of a morph, 1 when it has landed */
/* The splash and the particle entrance are separate things now. The entrance
   is gone: he did not want the lockup assembling itself out of diamonds on
   arrival, and the splash hands the finished mark over instead. `intro` stays
   as a variable because the draw loop still reads it, but nothing turns it on. */
var intro = false;
var introT = 0;
/* ── THE SPLASH ─────────────────────────────────────────────────────────
   Before the page there is the mark, and nothing else. The full AXIS lockup
   holds for a beat, contracts into the X at the centre, and the X throws
   itself apart. The diamonds it throws are the same diamonds the home page
   then gathers into the lockup again, so the splash does not end and the page
   begin: it is one move, and the particles carry it across the seam.

   Three beats, 1.5 seconds, and then it is out of the way. */
var splash = cv.dataset.splash === 'true' && !reduced;
var splashT = 0, splashClock = 0, introT0 = 0;
/* the breath eases back in after the splash, which ends dead still */
var calm = 1;
/* On the clock, not on the frame count. Page load is exactly when frames are
   slow and irregular, and a per-frame step with dt capped at 50ms ran the
   whole splash in a third of a second on a cold load: the letters never
   registered. These two are the only motions on the site whose length is a
   promise rather than a feel, so they are measured in milliseconds. */
/* 2.4 seconds. Android caps a splash animation at 1000ms because it is
   blocking a cold start; this is not blocking anything, and the published
   band for a splash you actually watch is two to three seconds. At 1.45 the
   lockup was gone before it had been read. */
/* One turn and in. There is less to watch than there was, so it is shorter:
   a beat to register the mark, a single revolution, a beat to settle, and the
   walk into the lockup. */
var SPLASH_MS = 1700, INTRO_MS = 1850, SETTLE_MS = 320;
var settleT = 1;

var KEY = 'axis.mark';
var carried = null, cameFrom = null;
try {
  var raw = sessionStorage.getItem(KEY);
  if (raw) { var o = JSON.parse(raw); if (o && o.f && FORMS[o.f]) { carried = o.f; cameFrom = o.at; } }
} catch (e) {}
/* What the page was actually showing, not what the pointer was peeking at.
   Hovering a navigation item morphs the mark, so clicking one stored the mark
   of the page you were going TO, which made the carry-over a no-op and let the
   splash play again every time you came back to Home. */
function remember() {
  var f = (liveCard && liveCard.dataset.form) || to;
  if (hover !== null && held) f = held;
  try { sessionStorage.setItem(KEY, JSON.stringify({ f: f, at: location.pathname })); } catch (e) {}
}
addEventListener('pagehide', remember);
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (a && a.origin === location.origin && !a.hash) remember();
}, true);

function build() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  var box = cv.getBoundingClientRect();
  W = Math.max(1, box.width); H = Math.max(1, box.height); BW = W; BH = H;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  /* The formations live in unit space, so they only depend on the count. A
     resize that keeps it, which is nearly all of them, resamples nothing. */
  var count = W > 900 ? 2300 : (W > 520 ? 1300 : 760);
  if (count !== N) {
    N = count;
    SET = {};
    sampleSet('x');
    SNAPS.forEach(function (k) {
      SET[k] = { pts: new Float32Array(N * 2), col: new Uint8Array(N),
                 pitch: SET.x.pitch };
    });
    swirl = new Float32Array(N); driftp = new Float32Array(N);
    mag = new Float32Array(N); ang = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      swirl[i] = ((i * 2654435761) % 1000) / 1000 - 0.5;
      driftp[i] = (i * 97) % 256;
      /* a wide spread of throw distances, so a good share barely moves and the
         cloud never hollows out in the middle of a morph */
      mag[i] = 0.12 + ((i * 40503) % 1000) / 1000 * 1.28;
      ang[i] = ((i * 69621) % 1000) / 1000 * 6.283185;
    }
    BUF = []; CNT = [];
    BUF2 = []; CNT2 = [];
    for (var c = 0; c < PAL.length; c++) {
      BUF.push(new Float32Array(N * 4)); CNT.push(0);
      BUF2.push(new Float32Array(N * 4)); CNT2.push(0);
    }
  }
  /* A capture is pinned to the scale it was taken at, and that scale belongs to
     the old viewport. Rather than carry it across a resize, the morph it
     belongs to is simply landed. */
  if (FORMS[from] && FORMS[from].snap) { from = to; mix = 1; }
  sampleSet(INTROFORM); sampleSet(from); sampleSet(to);
  PITCH = (SET[INTROFORM] || SET.x).pitch;
  sampleLater();
  fieldBuild();
}

/* Only what is on screen is sampled up front. The rest follow one at a time when
   the page is idle, and never while the mark is moving: nothing here is allowed
   to take a frame from the splash or a morph. Anything asked for before its turn
   is sampled on the spot by morphTo. */
function sampleSet(key) {
  if (SET[key] || !FORMS[key] || FORMS[key].snap) return;
  /* A shape held as diamonds wants far fewer cells than a shape being
     morphed. At the morph count the grid was finer than the diamonds and
     they fused into a solid fuzzy band instead of reading as a lattice. */
  var f = FORMS[key], fit = fitForm(f, f.dust ? Math.round(N * 0.3) : N);
  /* A formation that samples to nothing puts every diamond on the origin and
     the mark collapses to a single dot in the middle of the stage. That is
     what Bahrain did on the three pages that peek it in the navigation
     without loading the coastline. Both ends are fixed, this one so the mark
     can never vanish for a reason as ordinary as a file not being there: it
     falls back to the X, which is drawn from paths and is always there. */
  if (fit.n) SET[key] = f.dust ? latticeSet(fit, N) : orderAndThin(fit, N);
  else { sampleSet('x'); SET[key] = SET.x; }
}
var sampling = 0;
function whenIdle(fn) {
  if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 600 });
  else setTimeout(fn, 120);
}
function sampleLater() {
  if (sampling) return;
  sampling = 1;
  whenIdle(function next() {
    if (splash || mix < 1) { setTimeout(function () { whenIdle(next); }, 200); return; }
    for (var key in FORMS) {
      if (!SET[key] && !FORMS[key].snap) {
        sampleSet(key);
        whenIdle(next);
        return;
      }
    }
    sampling = 0;
  });
}

/* The written formations are real type, so they cannot be sampled until the face
   is actually loaded. Without this they sample the fallback serif, or nothing.
   Only those two are redone when it arrives; redoing everything froze the phone
   a second time, in the middle of the splash. */
if (document.fonts && document.fonts.load) {
  var textReady = function () {
    if (!N) return;
    ['arabic', 'addr'].forEach(function (k) {
      if (!SET[k]) return;
      delete SET[k];
      if (k === from || k === to || k === INTROFORM) sampleSet(k);
    });
    sampleLater();
  };
  Promise.all([document.fonts.load('600 720px PlexAr', 'بحريني'),
               document.fonts.load('600 560px Switzer', 'axis.bh')])
    .then(textReady, textReady);
}

/* No ratio is assumed. Screens are 16:9, 16:10, 3:2 and wider, and a hard
   branch at one of those made the mark jump a size the moment a window crossed
   it. The box is simply filled, with a ceiling so the mark never swells to
   fill a very large display.

   Fitted per formation, on that formation's own aspect. Every mark's points
   live in a unit box whose LONG side spans 1, so the drawn height of the AXIS
   lockup is 0.29 of its width. Fitting everything against min(W, H) starved it:
   on the landing, where the stage is wide and short, the lockup came out
   SMALLER than the X does inside a card. That is what made the full wordmark
   look like the favicon had been dropped in at icon size. */
function scale(key) {
  var f = FORMS[key] || FORMS.x;
  if (f.fixed) return f.fixed;                  /* a captured mid-morph state */
  var dw = f.w >= f.h ? 1 : f.w / f.h;          /* drawn width  = s * dw */
  var dh = f.h >= f.w ? 1 : f.h / f.w;          /* drawn height = s * dh */
  /* in the phone band the running label sits just under the mark, so it needs
     a little more room than it does in a full column */
  var fit = Math.min(W * 0.96 / dw, H * (H < 360 ? 0.80 : 0.92) / dh);
  /* The ceiling keeps the mark from swelling to fill a very large display, but
     the landing is the one screen where the mark IS the screen. Held to the
     inner ceiling it came out 700px wide on a 1920 display, with a slab of
     nothing between the lockup and the line underneath it that grew with the
     monitor. The landing gets its own, much higher ceiling. */
  /* landK eases between the two, or leaving the landing on anything wider than a
     phone made the lockup jump a size in the first frame of the morph */
  var room = Math.min(W / dw, H / dh);
  var top = (300 + room * 0.30) + (120 + room * 0.22) * landK;
  var cap = Math.min(fit, top);
  /* boost lets a wide short form take more of the column; it may push past the
     ceiling but never past the box, or the form is cropped by the canvas */
  return Math.min(fit, cap * (f.boost || 1));
}

function ease(u) { return 1 - Math.pow(1 - u, 3); }
function step3(e0, e1, x) { var u = (x - e0) / (e1 - e0); u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
function clamp01(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }

/* Thrown along its own line out of the centre with a little swirl, capped so
   the cloud opens around the mark instead of crossing the card. */
function throwOut(fx, fy, amt, m, sw, reach) {
  var ol = Math.sqrt(fx * fx + fy * fy) || 1e-4;
  var ux = fx / ol, uy = fy / ol, w = sw * 0.42;
  var thr = Math.min(amt * reach * m, reach * 1.15);
  return [fx + (ux - uy * w) * thr, fy + (uy + ux * w) * thr];
}
/* ── THE CURSOR ────────────────────────────────────────────────────────
   Magnetic, and it repels. The lattice is pushed away from the hand, never
   drawn toward it, and the whole mark leans off the cursor rather than
   into it.

   Capped at a share of how far out the diamond already is, so the cloud
   swells rather than evacuating: an uncapped push sends the diamonds nearest
   the cursor furthest, they all land on one rim, and the mark comes out as a
   doughnut with a clean hole in the middle. No swirl either. A tangential
   component was most of what made the old version read as churn.

   HIS TWO MARKS DO NOT MOVE. The X, the Mashmoom lattice and the wordmark are
   painted artwork and the cursor does not touch them. Only the formations that
   are held as loose diamonds answer it, because for those the diamonds are the
   whole drawing. */
/* ── THE SCAR ───────────────────────────────────────────────────────────
   His rule for the whole site, applied to the marks: a page never answers in
   its own colour. Reach for anything green and it goes purple; reach for the
   purple mark and it goes green.

   On the two solid marks that is a seam of light crossing the artwork on the
   site's own 45°, with a little glitter riding along it. Not one pixel of the
   logo moves for the cursor. On the formations held as diamonds it is simply
   the diamonds under your hand taking the other colour. */
var ACC = PURPLE_PAGE ? [73, 142, 130] : [107, 63, 160];
var ACCCSS = 'rgba(' + ACC[0] + ',' + ACC[1] + ',' + ACC[2] + ',';
var ACCI = PAL.length;
PAL.push(ACC); PALCSS.push(ACCCSS);

var onMark = 0;
/* how far the other colour carries from the hand, on the formations that are
   held as diamonds */
var LIT = 104, LIT2 = LIT * LIT;

/* ── THE SHINE ──────────────────────────────────────────────────────────
   A specular sweep, not a line crossing the mark. The difference is in five
   things, and the old one had none of them:

   IT FIRES.      One shot on the way in, about 600ms, then it is gone. A band
                  looping across forever is a scanner. This lands and leaves,
                  and only repeats if you keep your hand there.
   IT IS NARROW.  A bright core inside a soft halo, with a thin second gleam
                  trailing it. One even band at one alpha is a wipe.
   IT IS TILTED.  Near vertical, leaning about twenty degrees, which is how
                  light actually crosses a face. Forty five degrees reads as a
                  diagonal rule drawn over the top.
   IT IS LIGHT.   The core goes toward white, tinted to the accent. Painting
                  the accent flat makes the mark change colour instead of
                  catching light.
   IT HAS WEIGHT. The mark takes a small step toward you as it fires and the
                  leading edge throws sparks off the ink it crosses.          */
var SHEEN = PURPLE_PAGE ? '169,224,211' : '214,194,240';
var SHINE_MS = 620, SHINE_GAP = 1150;
var shineT = -1, shineWait = 0, grow = 0;
var SWEEP_A = -Math.PI * 0.11;                 /* twenty degrees off vertical */

function shineBand(g, key, s, ox, oy) {
  if (shineT < 0 || shineT > 1) return;
  /* a touch of ease out, so it leaves a shade slower than it arrives */
  var u = Math.pow(shineT, 0.86);
  var span = (s * 0.78) + 40;
  var y = (u * 2 - 1) * span;
  var R = s * 1.4;
  /* the band is brightest in the middle of its travel and off at both ends,
     so it does not pop into existence at the edge of the mark */
  var pw = Math.sin(Math.PI * Math.min(1, Math.max(0, shineT))) ;
  var lit = pw * pw * onMark;
  if (lit < 0.004) return;
  var k = Math.max(0.8, Math.min(2.4, s / 420));
  var LAYER = [[0.44 * s, 0.085, SHEEN], [0.17 * s, 0.17, SHEEN],
               [0.055 * s, 0.55, '255,255,255'], [0.016 * s, 0.8, '255,255,255']];
  var i;
  g.save();
  g.globalCompositeOperation = 'source-atop';
  g.translate(ox, oy); g.rotate(SWEEP_A);
  for (i = 0; i < LAYER.length; i++) {
    g.fillStyle = 'rgba(' + LAYER[i][2] + ',' + (LAYER[i][1] * lit).toFixed(3) + ')';
    g.fillRect(-R, y - LAYER[i][0] / 2, R * 2, LAYER[i][0]);
  }
  /* the second gleam, thin, a little behind */
  g.fillStyle = 'rgba(' + SHEEN + ',' + (0.3 * lit).toFixed(3) + ')';
  g.fillRect(-R, y - span * 0.21 - 0.02 * s, R * 2, 0.04 * s);
  g.restore();

  /* sparks off the ink the leading edge is crossing */
  var A = SET[key];
  if (!A) return;
  var ca = Math.cos(SWEEP_A), sa = Math.sin(SWEEP_A), drawn = 0;
  g.fillStyle = 'rgba(255,255,255,' + (0.85 * lit).toFixed(3) + ')';
  g.beginPath();
  for (i = 0; i < N && drawn < 22; i += 5) {
    var px = A.pts[i*2] * s, py = A.pts[i*2+1] * s;
    if (Math.abs((-px * sa + py * ca) - y) > 0.05 * s) continue;
    var tw = ((driftp[i] * 7919) % 100) / 100;
    if (tw < 0.55) continue;
    dia(g, ox + px, oy + py, (1.1 + tw * 2.6) * k);
    drawn++;
  }
  g.fill();
}

var REACH = 210, REACH2 = REACH * REACH, REPEL = 54;
function magnet(x, y, dx, dy, out) {
  var d = Math.sqrt(dx * dx + dy * dy) || 0.001;
  var f = 1 - d / REACH;
  var push = Math.min(f * f * REPEL, d * 0.55);
  out[0] = x + dx / d * push;
  out[1] = y + dy / d * push;
}
var RV = [0, 0];
/* A diamond. Point up, every one of them, everywhere. Turning them as they
   moved spun them through 45° into squares, and a square is not his mark. */
/* The settled size and the travelling size were different formulas, and the
   travelling alpha was 1 against a settled 0.84. So every morph ended with the
   cloud snapping smaller and darker in the same frame. One formula, one alpha,
   used by the entrance, the travel and the rest. */
var DOTA = 0.86;
function dotR(pitch, s) {
  var P = pitch * s;
  return Math.min(P * 0.42, Math.max(2.4, P * 0.34));
}
function blot(b, n, rgb, a) {
  if (!n || a <= 0.004) return;
  ctx.fillStyle = rgb + a.toFixed(3) + ')';
  ctx.beginPath();
  for (var i = 0; i < n; i += 4) {
    var x = b[i], y = b[i+1], r = b[i+2];
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
    ctx.closePath();
  }
  ctx.fill();
}
/* a formation held as loose diamonds, breathing and answering the cursor */
function drawDust(key, s, tl, ox, oy) {
  var A = SET[key], i, z;
  if (!A) return;
  for (z = 0; z < CNT.length; z++) CNT[z] = 0;
  var ca = Math.cos(tl), sa = Math.sin(tl);
  /* dust.js's rule, copied from the code rather than guessed from a picture:
     a third of the lattice pitch, never under 2.4px so it still reads as a
     diamond, never over 0.42 of the pitch so two neighbours cannot meet and
     fuse into a band. */
  var P = A.pitch * s;
  var rBase = dotR(A.pitch, s);
  for (i = 0; i < N; i++) {
    if (A.rep && A.rep[i]) continue;
    var ax = A.pts[i*2], ay = A.pts[i*2+1];
    var x = ox + (ax * ca - ay * sa) * s;
    var y = oy + (ax * sa + ay * ca) * s;
    if (!reduced) {
      var pp = (driftp[i] + t) & 255;
      x += Math.sin(pp / 256 * 6.283) * 0.26;
      y += Math.sin(((pp + 64) & 255) / 256 * 6.283) * 0.26;
    }
    var c = A.col[i];
    if (mx > -9e8) {
      var dx = x - mx, dy = y - my, dd2 = dx * dx + dy * dy;
      if (dd2 < REACH2) { magnet(x, y, dx, dy, RV); x = RV[0]; y = RV[1]; }
      if (dd2 < LIT2) c = ACCI;
    }
    var b = BUF[c], n = CNT[c];
    b[n++] = x; b[n++] = y; b[n++] = rBase; b[n++] = 0; CNT[c] = n;
  }
  for (z = 0; z < BUF.length; z++) blot(BUF[z], CNT[z], PALCSS[z], A.restA || DOTA);
}

/* measured against the sampled lattice, which is the only honest answer for a
   shape made of his own paths; one point in four is plenty at this radius */
function overMark(key, s, ox, oy) {
  var A = SET[key];
  if (!A || mx < -9e8) return 0;
  var reach = Math.max(32, A.pitch * s * 2.2), near = reach * reach, i;
  for (i = 0; i < N; i += 4) {
    var dx = ox + A.pts[i*2] * s - mx, dy = oy + A.pts[i*2+1] * s - my;
    if (dx * dx + dy * dy < near) return 1;
  }
  return 0;
}
function paintVector(key, s, alpha) {
  if (alpha <= 0.003 || !(s > 0)) return;
  var f = FORMS[key], k = s / Math.max(f.w, f.h);
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.scale(k, k); ctx.translate(-f.w / 2, -f.h / 2); f.paint(ctx);
  ctx.restore();
}

/* the one pair that is drawn as artwork rather than as a travelling cloud */
function isAdd(a, b) {
  return (a === 'x' && b === 'mashmoom') || (a === 'mashmoom' && b === 'x');
}
/* how far along a given diamond is at a given point in the morph */
function legPhase(i, M) {
  /* a short, per-diamond head start: the far side of the mark has not left yet
     while the near side is already arriving */
  var off = (mag[i] - 0.12) / 1.28 * 0.22;
  var u = (M - off) / (1 - off);
  return ease(u < 0 ? 0 : u > 1 ? 1 : u);
}
/* write the cloud as it stands into a formation of its own, pinned to the
   scale it was drawn at, and hand it back as the new starting point */
function capture() {
  var key = SNAPS[snapTurn]; snapTurn = 1 - snapTurn;
  var S = SET[key], Af = SET[from], Bf = SET[to], M = mix, i;
  if (!S || !Af || !Bf) return to;
  for (i = 0; i < N; i++) {
    var e = legPhase(i, M);
    S.pts[i*2]     = Af.pts[i*2]     + (Bf.pts[i*2]     - Af.pts[i*2])     * e;
    S.pts[i*2 + 1] = Af.pts[i*2 + 1] + (Bf.pts[i*2 + 1] - Af.pts[i*2 + 1]) * e;
    S.col[i] = e < 0.5 ? Af.col[i] : Bf.col[i];
  }
  var g = ease(M);
  S.pitch = Af.pitch + (Bf.pitch - Af.pitch) * g;
  FORMS[key].fixed = scale(from) + (scale(to) - scale(from)) * g;
  return key;
}
function morphTo(key, quiet) {
  if (!FORMS[key] || key === to) return;
  sampleSet(key);
  if (quiet || mix >= 1) {
    from = to;
  } else if (isAdd(from, to)) {
    /* the additive pair is painted, not thrown, so there is no cloud to catch:
       leave from whichever of the two it is nearer to looking like */
    from = mix < 0.5 ? from : to;
  } else {
    from = capture();
  }
  to = key;
  mix = quiet ? 1 : 0;
}

/* ── the field ──────────────────────────────────────────────────────────
   The page is not empty behind the words. His diamond, repeated on a loose
   grid across the whole viewport, at an alpha low enough to read as paper
   texture until you move: a slow wave travels through it, the cursor lights
   a patch of it, and scrolling slides it fractionally against the content.
   It is the same primitive as the mark, which is why it can sit under
   everything without becoming a second visual language. */
var fcv = document.getElementById('field');
var fctx = fcv ? fcv.getContext('2d') : null;
var vmx = -9e9, vmy = -9e9;
var FW = 0, FH = 0, GX = null, GY = null, GN = 0, FPITCH = 0, FDPR = 1;
var PURPLE_PAGE = document.body.dataset.field === 'purple';
var HOT = PURPLE_PAGE
  ? ['rgba(132,86,188,', [132, 86, 188]] : ['rgba(73,142,130,', [73, 142, 130]];
/* Nine steps rather than six. The field carries more light than it used to and
   at six the wave moving through it banded into visible steps. */
var FBUCK = 9;

var CX2 = null, CY2 = null, CN2 = 0, CPITCH = 0;

/* preallocated once: nothing in the frame loop allocates */
var BUCK = [], BCNT = [], BALPHA = [], HOTP = new Float32Array(144), hotN = 0;
function fieldBuild() {
  if (!fctx) return;
  /* the field's own box, which is 100lvh: a phone's URL bar coming and going
     changes innerHeight but not this, so the bitmap is never stretched */
  var fb = fcv.getBoundingClientRect();
  FW = Math.round(fb.width) || innerWidth; FH = Math.round(fb.height) || innerHeight;
  /* The field is a wash of 3px diamonds behind the words. Drawn at devicePixel
     ratio on a 1920 display that is an 8.3 megapixel clear and fill every
     frame, which is most of why it was not holding 60. At 1 it is 2 megapixel
     and nobody can tell the difference on a shape that small. */
  FDPR = Math.min(DPR, 1);
  fcv.width = Math.round(FW * FDPR); fcv.height = Math.round(FH * FDPR);
  fctx.setTransform(FDPR, 0, 0, FDPR, 0, 0);
  FPITCH = FW > 1400 ? 50 : (FW > 760 ? 44 : 38);
  CPITCH = FPITCH * 2.7;
  var cols = Math.ceil(FW / FPITCH) + 2, rows = Math.ceil(FH / FPITCH) + 2;
  GN = cols * rows;
  GX = new Float32Array(GN); GY = new Float32Array(GN);
  var n = 0, r, c;
  for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
    GX[n] = c * FPITCH + (r % 2 ? FPITCH / 2 : 0) - FPITCH;
    GY[n] = r * FPITCH - FPITCH;
    n++;
  }
  /* a second, coarser layer that travels at a different rate, so the page has
     depth behind the words instead of one flat screen of dots */
  BUCK = []; BCNT = []; BALPHA = [];
  for (var bi = 0; bi < FBUCK; bi++) {
    BUCK.push(new Float32Array(GN * 3)); BCNT.push(0);
    BALPHA.push(((bi + 0.6) / FBUCK * 0.60).toFixed(3));
  }
  var cc = Math.ceil(FW / CPITCH) + 2, cr = Math.ceil(FH / CPITCH) + 2;
  CN2 = cc * cr;
  CX2 = new Float32Array(CN2); CY2 = new Float32Array(CN2);
  n = 0;
  for (r = 0; r < cr; r++) for (c = 0; c < cc; c++) {
    CX2[n] = c * CPITCH + (r % 2 ? CPITCH / 2 : 0) - CPITCH;
    CY2[n] = r * CPITCH - CPITCH;
    n++;
  }
}

/* one diamond, written straight into the current path */
function dia(g, x, y, r) {
  g.moveTo(x, y - r); g.lineTo(x + r, y);
  g.lineTo(x, y + r); g.lineTo(x - r, y);
  g.closePath();
}

function fieldDraw() {
  if (!fctx || !GN) return;
  fctx.clearRect(0, 0, FW, FH);
  var sy = (scrollY || pageYOffset || 0);
  var tt = reduced ? 0 : t;
  var lit = vmx > -9e8;
  var i, j, x, y, d, f;

  /* ── the far layer ─────────────────────────────────────────────────── */
  var slide2 = (sy * 0.018) % CPITCH;
  fctx.fillStyle = HOT[0] + '0.095)';
  fctx.beginPath();
  for (i = 0; i < CN2; i++) {
    x = CX2[i]; y = CY2[i] - slide2;
    if (y < -CPITCH || y > FH + CPITCH) continue;
    var w2 = Math.sin((x - y) / 340 + tt * 0.009);
    dia(fctx, x, y, 3.5 + w2 * 1.0);
  }
  fctx.fill();

  /* ── the sweep ─────────────────────────────────────────────────────
     A band of light crosses the page on a long cycle. It is the one thing on
     the page that happens without being asked for, and it is what stops a
     still screenshot from being the whole story. */
  var SPAN = FW + FH;
  var head = ((tt * 1.25) % (SPAN + 1100)) - 550;

  /* ── the near layer ────────────────────────────────────────────────── */
  var slide = (sy * 0.038) % FPITCH;
  for (i = 0; i < FBUCK; i++) BCNT[i] = 0;
  hotN = 0;

  for (i = 0; i < GN; i++) {
    x = GX[i]; y = GY[i] - slide;
    if (y < -FPITCH || y > FH + FPITCH) continue;
    var wave = Math.sin((x * 0.55 + y * 0.85) / 210 - tt * 0.015);
    var a = 0.118 + wave * 0.072;
    var s = 2.45 + wave * 0.8;

    var band = Math.abs((x + y) - head);
    if (band < 360) { f = 1 - band / 360; a += f * f * 0.22; s += f * f * 1.25; }

    if (lit) {
      var hdx = x - vmx, hdy = y - vmy;
      d = Math.sqrt(hdx * hdx + hdy * hdy);
      if (d < 250) {
        f = 1 - d / 250;
        a += f * f * 0.34;
        s += f * f * 2.3;
        if (f > 0.55 && hotN < 140) { HOTP[hotN++] = x; HOTP[hotN++] = y; }
      }
    }
    var b = Math.min(FBUCK - 1, Math.max(0, Math.round(a / 0.52 * (FBUCK - 1))));
    var bb = BUCK[b], bn = BCNT[b];
    bb[bn++] = x; bb[bn++] = y; bb[bn++] = s; BCNT[b] = bn;
  }

  for (i = 0; i < FBUCK; i++) {
    var bn2 = BCNT[i];
    if (!bn2) continue;
    var arr = BUCK[i];
    fctx.fillStyle = HOT[0] + BALPHA[i] + ')';
    fctx.beginPath();
    for (j = 0; j < bn2; j += 3) dia(fctx, arr[j], arr[j+1], arr[j+2]);
    fctx.fill();
  }

  /* ── what the cursor joins up ──────────────────────────────────────
     The lattice is the whole identity, so under the cursor the field briefly
     becomes one: near neighbours are linked and you can see the structure
     that is there the rest of the time. */
  if (hotN > 3) {
    /* Faint on purpose. Turned up, a web of joined dots stops reading as the
       lattice this is built on and starts reading as the stock network
       graphic every other technology site opens with. */
    fctx.strokeStyle = HOT[0] + '0.11)';
    fctx.lineWidth = 1;
    fctx.beginPath();
    /* Nearest neighbours only. At 1.5 pitch it reached diagonally as well and
       drew big triangles, which reads as a stock network graphic rather than
       as the lattice this is built on. */
    var LINK2 = FPITCH * 1.08 * FPITCH * 1.08, links = 0;
    for (i = 0; i < hotN && links < 200; i += 2) {
      for (j = i + 2; j < hotN && links < 200; j += 2) {
        var ddx = HOTP[i] - HOTP[j], ddy = HOTP[i+1] - HOTP[j+1];
        if (ddx * ddx + ddy * ddy < LINK2) {
          fctx.moveTo(HOTP[i], HOTP[i+1]);
          fctx.lineTo(HOTP[j], HOTP[j+1]);
          links++;
        }
      }
    }
    fctx.stroke();
  }
}

/* The stage slides and resizes as you leave the landing. The backing store has
   to follow it every frame, or the mark is simply stretched by CSS for the
   whole of that move. Only the bitmap is resized here: the formations are
   sampled in unit space, so none of them need rebuilding. */
/* Where the landing will put the lockup, in viewport coordinates, measured
   now rather than guessed: the deck is laid out behind the splash already. */
function mixRGB(r1, g1, b1, r2, g2, b2, t) {
  return 'rgb(' + Math.round(r1 + (r2 - r1) * t) + ',' +
                  Math.round(g1 + (g2 - g1) * t) + ',' +
                  Math.round(b1 + (b2 - b1) * t) + ')';
}
/* the same query as the band layout in site.css */
var bandMQ = matchMedia('(max-width:900px) and (orientation:portrait),(max-width:900px) and (min-height:501px)');
/* the small viewport height (URL bar showing), which is what the CSS band is
   sized in; innerHeight grows when the bar hides and the mark landed too big */
var probe = null;
function svh() {
  if (!probe) {
    probe = document.createElement('div');
    probe.className = 'svh-probe'; probe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(probe);
  }
  return probe.getBoundingClientRect().height || innerHeight;
}
function landingBox() {
  var dk = document.querySelector('.deck'), tb = document.querySelector('.top');
  if (!dk || !tb) return null;
  var r = dk.getBoundingClientRect(), bh = tb.getBoundingClientRect().height;
  /* the phone puts the mark in a full-width band under the bar instead of
     giving it the middle of the page, so the target is a different box */
  var narrow = bandMQ.matches;
  var lw = narrow ? innerWidth : r.width;
  /* less the band's 1px border, which the canvas sits inside: without it the
     lockup dropped half a pixel the moment the splash handed it over */
  var lh = narrow ? svh() * 0.28 - 1 : innerHeight * 0.56 - bh;
  if (!(lw > 0) || !(lh > 0)) return null;
  var f = FORMS.word, dw = 1, dh = f.h / f.w;
  /* the same fit scale() will use at rest, or a short landscape band resized the
     lockup the moment the splash let go of it */
  var fit = Math.min(lw * 0.96 / dw, lh * (lh < 360 ? 0.80 : 0.92) / dh);
  var top = 420 + Math.min(lw / dw, lh / dh) * 0.52;
  return { cx: narrow ? lw / 2 : r.left + lw / 2, cy: bh + lh / 2,
           s: Math.min(fit, top) };
}

function fitCanvas() {
  var box = cv.getBoundingClientRect();
  var w = Math.max(1, box.width), h = Math.max(1, box.height);
  if (Math.abs(w - W) < 0.5 && Math.abs(h - H) < 0.5) return;
  W = w; H = h;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function draw(ts) {
  var rawDt = tPrev ? ts - tPrev : 16.7;
  var dt = Math.min(50, rawDt); tPrev = ts;
  var k = dt / 16.7;
  /* The whole canvas runs off this clock, so one number sets the pace of the
     drift, the breath, the wave in the field and the sweep across it. It was
     too quick to sit in front of. */
  t += 0.44 * k;
  fitCanvas();
  /* The field is a slow wash of small shapes and nothing about it needs sixty
     updates a second. On a phone that half goes to the mark instead. */
  fieldTick++;
  if (!coarse || fieldTick % 2) fieldDraw();
  var landWant = atLanding ? 1 : 0;
  landK += (landWant - landK) * Math.min(1, 0.11 * k);
  if (Math.abs(landWant - landK) < 0.002) landK = landWant;
  if (calm < 1) calm = Math.min(1, calm + dt / 900);

  /* is the hand on the mark, and has the shine been fired */
  var sNow = scale(to);
  var want = (mix >= 1 && !FORMS[to].dust) ? overMark(to, sNow, W / 2, H / 2) : 0;
  if (want && onMark < 0.02 && shineT < 0) { shineT = 0; shineWait = 0; }
  onMark += (want - onMark) * Math.min(1, (want ? 0.22 : 0.10) * k);
  if (onMark < 0.004) onMark = 0;
  grow += ((want ? 0.035 : 0) - grow) * Math.min(1, 0.2 * k);
  if (shineT >= 0 && !reduced) {
    shineT += dt / SHINE_MS;
    if (shineT > 1) {
      shineT = -1;
      shineWait = want ? SHINE_GAP : 0;        /* it only repeats if you stay */
    }
  } else if (shineWait > 0) {
    shineWait -= dt;
    if (shineWait <= 0) { if (want) shineT = 0; else shineWait = 0; }
  }
  if (!want) { shineWait = 0; if (shineT >= 0 && shineT < 0.02) shineT = -1; }

  if (splash) {
    /* Still on the clock, but a frame that stalls only costs its own time: a
       hitch on a cold load pauses the mark rather than teleporting it ahead. */
    splashClock += Math.min(100, rawDt);
    splashT = Math.min(1, splashClock / SPLASH_MS);
    /* the green and the page cross over during the cast, on CSS transitions,
       so neither of them is a step */
    if (splashT >= 0.62) document.documentElement.classList.add('cast');
    if (splashT >= 1) {
      splash = false; intro = false; settleT = 1;
      from = to = 'word'; mix = 1;
      /* The stage box goes from the whole screen to the landing box. The mark
         is already drawn where the landing wants it, so the box change has to
         be instant: animated, the lockup would visibly drift while the canvas
         caught up with it. Two frames of no transition and it is seamless. */
      var de = document.documentElement;
      de.classList.add('justland');
      de.classList.remove('splash', 'cast');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { de.classList.remove('justland'); });
      });
      /* This frame paints into the landing box, not the splash's. Left to the
         next frame, the full-screen bitmap was squashed into the phone's band
         for one frame, which read as the lockup flinching on arrival. */
      fitCanvas();
      calm = 0;
      relayout();
      setTimeout(relayout, 400);
    }
  }
  if (mix < 1) mix = Math.min(1, mix + 0.0215 * k);
  if (intro && introT < 1) {
    if (!introT0) introT0 = ts;
    introT = Math.min(1, (ts - introT0) / INTRO_MS);
    /* The entrance is a one-off. Left set, it made every later card change
       count as "quiet" and the mark cut between his marks instead of morphing. */
    if (introT >= 1) {
      intro = false;
      /* the entrance always builds the X; once it has landed, hand over to
         whatever the live card actually asked for */
      if (liveCard && liveCard.dataset.form && liveCard.dataset.form !== to) {
        morphTo(liveCard.dataset.form);
      }
    }
  }

  /* A card that brings its own visual has faded the stage out. Once it is gone
     and the mark has landed there is nothing to paint for. */
  if (stageOff && !splash && mix >= 1 && ts - stageOffAt > 400) {
    raf = requestAnimationFrame(draw);
    return;
  }

  ctx.clearRect(0, 0, W, H);
  var s0 = scale(to), cx = W / 2, cy = H / 2;
  var breath = reduced ? 1 : 1 + Math.sin(t * 0.0115) * 0.0075 * calm;
  var tilt = reduced ? 0 : Math.sin(t * 0.0083) * 0.0052 * calm;
  /* The mark does not follow the pointer around. It used to lean toward it,
     then away from it, and both were the logo moving with the mouse. */
  pxo += (0 - pxo) * Math.min(1, 0.06 * k);
  pyo += (0 - pyo) * Math.min(1, 0.06 * k);

  /* ── the splash ──────────────────────────────────────────────────────
     SET   0 → .14    the X settles in, small and centred, cut out of the green
     HOLD  .14 → .62  it sits there. That is the whole middle of it.
     WALK  .62 → 1    it travels to the X inside the AXIS lockup, at the exact
                      size and place the landing wants it, while the other
                      three letters fade up around it and the green drains

     Nothing spins, nothing is built out of diamonds, and no letters are thrown
     at anything. The X you look at is the same X that ends up in the lockup, so
     there is no merge to glitch and no second assembly on arrival. */
  if (splash) {
    var S = splashT;
    var settle = step3(0, 0.14, S);
    var walk = step3(0.62, 1, S);
    var LB = landingBox();

    /* smaller: a splash mark, with room around it */
    var sX0 = Math.min(Math.max(118, Math.min(W * 0.13, 200)), H * 0.26);
    var xTo = LB ? 3000 * LB.s / 10373 : sX0;
    var cxTo = LB ? LB.cx + (X_MID - W_MID) * LB.s / 10373 : cx;
    var cyTo = LB ? LB.cy : cy;

    var e = ease(walk);
    /* it arrives at size rather than growing into it: a short, small settle,
       which is all a splash mark should do before it sits still */
    var sIn2 = sX0 * (0.93 + 0.07 * ease(settle));
    var sNow2 = sIn2 + (xTo - sIn2) * e;
    var pxN = cx + (cxTo - cx) * e;
    var pyN = cy + (cyTo - cy) * e;

    /* The mark is cut OUT of the green, not laid on it, so while the green is
       up it is the page's near-black and it only becomes its own teal as the
       green drains. Two fills crossfading over each other went muddy through
       the middle of that, so the COLOUR is interpolated and the shape is
       filled once. And it is timed to finish with the background transition,
       because teal on green and black on black are both invisible: the
       crossing has to be a single instant, not a stretch. */
    /* Straight from near-black to teal means the mark is at its darkest at
       exactly the moment the background gets dark too, and for a frame or two
       it nearly vanishes. It goes through a light tint instead, so it is legible
       against the green on one side and against the black on the other, and the
       crossing reads as the mark catching the light on its way in. */
    var cm = step3(0, 0.62, walk);
    var col = cm < 0.5
      ? mixRGB(30, 30, 30, 167, 213, 203, cm * 2)
      : mixRGB(167, 213, 203, 73, 142, 130, (cm - 0.5) * 2);

    /* the three letters it is going to join, arriving around it */
    if (LB && walk > 0) {
      ctx.save();
      ctx.globalAlpha = ease(step3(0.22, 1, walk));
      ctx.translate(LB.cx, LB.cy);
      ctx.scale(LB.s / 10373, LB.s / 10373);
      ctx.translate(-W_MID, -1500);
      fillPaths(ctx, W_A, col); fillPaths(ctx, W_I, col); fillPaths(ctx, W_S, col);
      ctx.restore();
    }

    /* and the X itself, turning, walking, and changing out of the green */
    ctx.save();
    ctx.globalAlpha = settle;
    ctx.translate(pxN, pyN);
    ctx.scale(sNow2 / 3000, sNow2 / 3000);
    ctx.translate(-1500, -1500);
    fillPaths(ctx, ARMS, col); fillPaths(ctx, [SEED], col);
    ctx.restore();

    raf = requestAnimationFrame(draw);
    return;
  }

  /* ── the entrance ────────────────────────────────────────────────────
     The diamonds come in from outside the frame and lock into the X. It does
     not blow apart on the way: an explosion reads as the mark breaking, and
     the first thing anyone sees of Axis should be the mark being built.
     Each diamond arrives on its own clock, so the X lands in a wave rather
     than as one rigid block dropping into place. */
  if (intro && introT < 1) {
    var I = introT;
    var solid = step3(0.86, 1, I);
    var sIn = s0 * breath * (0.94 + 0.06 * ease(clamp01(I / 0.7)));
    var A = SET[INTROFORM], bk = BUF[GREEN], n = 0;
    for (var q = 0; q < N; q++) {
      var hx = A.pts[q*2], hy = A.pts[q*2+1];
      var lead = ((q * 2654435761) % 1000) / 1000 * 0.34;
      var gather = ease(clamp01((I - lead) / (0.82 - lead)));
      /* Every diamond starts inside the frame. A spawn circle sized off the
         shorter side put half of them outside a wide short canvas, where they
         were clipped: the build looked cropped, with particles appearing out of
         the middle of the screen. The ring is the canvas box itself now, so
         each one comes in from the edge it is actually pointing at. */
      var cq = Math.cos(ang[q]), sq = Math.sin(ang[q]);
      var edge = Math.min(W * 0.47 / Math.max(0.09, Math.abs(cq)),
                          H * 0.47 / Math.max(0.09, Math.abs(sq)));
      var far = edge / Math.max(1, sIn) * (0.54 + (mag[q] - 0.12) / 1.28 * 0.44);
      var ox = cq * far, oy = sq * far;
      var fx = ox + (hx - ox) * gather, fy = oy + (hy - oy) * gather;
      bk[n++] = cx + pxo + fx * sIn;
      bk[n++] = cy + pyo + fy * sIn;
      bk[n++] = dotR(PITCH, sIn) * (1 + (1 - gather) * 0.30);
      bk[n++] = 0;
    }
    CNT[GREEN] = n;
    blot(BUF[GREEN], CNT[GREEN], PALCSS[GREEN],
         DOTA * (1 - solid) * (intro ? step3(0, 0.16, I) : 1));
    ctx.save(); ctx.translate(cx + pxo, cy + pyo); ctx.rotate(tilt);
    paintVector(INTROFORM, sIn, solid); ctx.restore();
    raf = requestAnimationFrame(draw);
    return;
  }

  /* ── at rest ─────────────────────────────────────────────────────────
     His two marks go crisp, with no approximation. The section shapes stay
     as diamonds and keep answering the cursor. */
  if (mix >= 1 && hover === null) {
    if (FORMS[to].dust) {
      drawDust(to, s0 * breath, tilt, cx + pxo, cy + pyo);
    } else {
      var sHot = s0 * breath * (1 + grow);
      if (settleT < 1) settleT = Math.min(1, settleT + dt / SETTLE_MS);

      ctx.save(); ctx.translate(cx + pxo, cy + pyo); ctx.rotate(tilt);
      paintVector(to, sHot, settleT >= 1 ? 1 : ease(settleT));
      ctx.restore();
      /* the cast arrives as diamonds; they dissolve into the artwork in place,
         same size, same spot, so the last frame of the splash and the first
         frame of the page are the same picture */
      if (settleT < 1) {
        var As = SET[to];
        if (As) {
          for (var zs = 0; zs < CNT.length; zs++) CNT[zs] = 0;
          var rs = dotR(As.pitch, sHot), bs = BUF[GREEN], ns = 0;
          for (var qs = 0; qs < N; qs++) {
            bs[ns++] = cx + pxo + As.pts[qs*2] * sHot;
            bs[ns++] = cy + pyo + As.pts[qs*2+1] * sHot;
            bs[ns++] = rs; bs[ns++] = 0;
          }
          CNT[GREEN] = ns;
          blot(BUF[GREEN], CNT[GREEN], PALCSS[GREEN], DOTA * (1 - settleT));
        }
      }
      if (onMark > 0.02) {
        /* the whole mark lifts a little under the hand, so the sweep is
           landing on something that has already answered */
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(' + SHEEN + ',' + (0.07 * onMark).toFixed(3) + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
      shineBand(ctx, to, sHot, cx + pxo, cy + pyo);

    }
    raf = requestAnimationFrame(draw);
    return;
  }

  /* ── X into Mashmoom: added, not morphed ─────────────────────────────
     These two are the same mark. The lattice grows into place out of the seed
     and the X underneath never moves. No particles are involved at all. */
  if ((from === 'x' && to === 'mashmoom') || (from === 'mashmoom' && to === 'x')) {
    var uAdd = ease(mix);
    if (to === 'x') uAdd = 1 - uAdd;
    var kAdd = (s0 * breath) / 3000;
    ctx.save();
    ctx.translate(cx + pxo, cy + pyo); ctx.rotate(tilt);
    ctx.scale(kAdd, kAdd); ctx.translate(-1500, -1500);
    paintAdditive(ctx, uAdd);
    ctx.restore();
    raf = requestAnimationFrame(draw);
    return;
  }

  /* ── the morph ───────────────────────────────────────────────────────
     One of his marks becomes the next. Every diamond travels straight from
     where it sits in the first mark to where it sits in the second, and
     nowhere else.

     It used to be thrown outward and pulled back on the way across, which is
     an explosion, not a morph: the mark came apart and reassembled into the
     same silhouette rather than turning into the next one. The only thing
     left of that is a small per-diamond head start, so the shape flows rather
     than sliding as one rigid block. */
  var M = mix;
  /* A section shape never has a solid state, so when one is at either end of
     the travel the diamonds carry the whole move rather than handing off to
     artwork that does not exist. */
  var fDust = !!FORMS[from].dust, tDust = !!FORMS[to].dust;
  /* Coming off a solid mark the cloud used to be at full strength from the
     first frame, sitting on top of artwork that had not faded yet: the logo
     looked heavy, then thin, then it was particles. The two now cross, so the
     mark dissolves into its own diamonds and gathers back out of them. */
  var dust = 1;
  if (!fDust && !tDust) dust = Math.min(1, Math.min(M / 0.12, (1 - M) / 0.12) * 1.5);
  else if (!fDust) dust = step3(0, 0.26, M);
  else if (!tDust) dust = 1 - step3(0.74, 1, M);
  var outA = !tDust ? (1 - step3(0, 0.14, M)) : (1 - step3(0, 0.26, M));
  var inA = !fDust ? step3(0.86, 1, M) : step3(0.74, 1, M);
  /* Each mark is fitted on its own aspect, so the travel carries the scale with
     it. Taking one scale for both ends is what made the Arabic word and the
     address snap a size at the end of every morph into them. */
  var sEase = ease(M);
  var sFrom = scale(from), sTo = scale(to);
  var s = (sFrom + (sTo - sFrom) * sEase) * breath;

  ctx.save(); ctx.translate(cx + pxo, cy + pyo); ctx.rotate(tilt);
  if (!fDust) paintVector(from, sFrom * breath, outA);
  if (!tDust) paintVector(to, sTo * breath, inA);
  ctx.restore();

  if (dust > 0.004) {
    for (var z = 0; z < CNT.length; z++) { CNT[z] = 0; CNT2[z] = 0; }
    var Af = SET[from], Bf = SET[to];
    /* The cloud has to be the same picture drawDust paints at rest: same tilt,
       same drift, same alpha. It was none of those, so every morph into a shape
       held as diamonds ended by jolting a couple of pixels and dimming at once. */
    var cT = Math.cos(tilt), sT = Math.sin(tilt);
    /* At rest a shape held as diamonds paints each cell once, not its stacked
       copies. Near that end of the travel the copies fade out as the single cells
       strengthen, so the last frame of the morph is the first frame of the rest. */
    var endS = M < 0.5 ? Af : Bf, rep = endS.rep;
    var w = !rep ? 0 : (M < 0.5 ? 1 - step3(0, 0.15, M) : step3(0.85, 1, M));
    var aOne = dust * (DOTA + ((endS.restA || DOTA) - DOTA) * w);
    var aCopy = dust * DOTA * (1 - w);
    for (var i = 0; i < N; i++) {
      var e = legPhase(i, M);
      /* each mark samples at its own lattice spacing, so the diamond size
         travels with it */
      var pitchNow = Af.pitch + (Bf.pitch - Af.pitch) * e;
      var ax = Af.pts[i*2], ay = Af.pts[i*2+1];
      var bx = Bf.pts[i*2], by = Bf.pts[i*2+1];
      var fx2 = ax + (bx - ax) * e, fy2 = ay + (by - ay) * e;
      var x2 = cx + pxo + (fx2 * cT - fy2 * sT) * s, y2 = cy + pyo + (fx2 * sT + fy2 * cT) * s;
      if (!reduced) {
        var ph = (driftp[i] + t) & 255;
        x2 += Math.sin(ph / 256 * 6.283) * 0.26; y2 += Math.sin(((ph + 64) & 255) / 256 * 6.283) * 0.26;
      }
      if (mx > -9e8) {
        var ndx = x2 - mx, ndy = y2 - my;
        if (ndx * ndx + ndy * ndy < REACH2) {
          magnet(x2, y2, ndx, ndy, RV); x2 = RV[0]; y2 = RV[1];
        }
      }
      var r2 = dotR(pitchNow, s);
      var c2 = e < 0.5 ? Af.col[i] : Bf.col[i];   /* takes its new colour as it crosses */
      if (rep && rep[i]) {
        var b4 = BUF2[c2], n4 = CNT2[c2];
        b4[n4++] = x2; b4[n4++] = y2; b4[n4++] = r2; b4[n4++] = 0; CNT2[c2] = n4;
      } else {
        var b2 = BUF[c2], n2 = CNT[c2];
        b2[n2++] = x2; b2[n2++] = y2; b2[n2++] = r2; b2[n2++] = 0; CNT[c2] = n2;
      }
    }
    for (var c3 = 0; c3 < BUF.length; c3++) {
      blot(BUF2[c3], CNT2[c3], PALCSS[c3], aCopy);
      blot(BUF[c3], CNT[c3], PALCSS[c3], aOne);
    }
  }

  raf = requestAnimationFrame(draw);
}

/* ── the transitioning text ─────────────────────────────────────────────
   Headlines assemble word by word rather than appearing whole, and the mono
   label under the mark settles out of noise the way a counter does. The delays
   are classes because style-src 'self' blocks an inline style attribute. */
function splitWords(head) {
  if (!head || head.dataset.split) return;
  head.dataset.split = '1';
  var n = 0;
  (function walk(node) {
    for (var c = node.firstChild; c;) {
      var next = c.nextSibling;
      if (c.nodeType === 3) {
        var frag = document.createDocumentFragment();
        c.nodeValue.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          var sp = document.createElement('span');
          sp.className = 'w d' + Math.min(n++, 11); sp.textContent = w;
          frag.appendChild(sp);
        });
        node.replaceChild(frag, c);
      } else if (c.nodeType === 1) walk(c);
      c = next;
    }
  })(head);
}
var settleIv = 0;
function settleTo(el, text) {
  clearInterval(settleIv);
  if (reduced) { el.textContent = text; return; }
  var GLYPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', chars = text.split(''), n = 0, total = chars.length + 6;
  settleIv = setInterval(function () {
    n++;
    var done = Math.floor(n * chars.length / total), out = '';
    for (var i = 0; i < chars.length; i++) {
      var c = chars[i];
      if (i < done || c === ' ' || c === '·') out += c;
      else if (/[0-9]/.test(c)) out += (Math.random() * 10 | 0);
      else out += GLYPH[Math.random() * 26 | 0];
    }
    el.textContent = out;
    if (n >= total) { clearInterval(settleIv); el.textContent = text; }
  }, 30);
}

/* ── the prompt writes itself, then unwrites itself ─────────────────────
   Typed a character at a time, held, then taken back out the same way before
   the next one starts. Swapping two finished sentences reads as a slide
   changing; this reads as somebody at the keyboard.

   The caret is the span's own ::after, so it sits at the end of what has been
   typed and travels with it. An Arabic line runs the other way, so the whole
   span is turned around for it: typed from the right edge, with the caret
   arriving on the left. A line with no direction set put the caret at the far
   end of the Arabic, which is where it starts, not where it is. */
(function () {
  var cyc = document.querySelector('.cycle');
  if (!cyc) return;
  var lines = [].slice.call(cyc.children).map(function (el) { return el.textContent.trim(); });
  if (!lines.length) return;
  var AR = /[؀-ۿ]/;
  cyc.textContent = '';
  var out = document.createElement('span');
  out.className = 'typed';
  cyc.appendChild(out);
  function face(n) {
    var ar = AR.test(lines[n]);
    out.setAttribute('dir', ar ? 'rtl' : 'ltr');
    out.setAttribute('lang', ar ? 'ar' : 'en');
  }
  face(0);
  if (reduced) { out.textContent = lines[0]; return; }
  var li = 0, ci = 0, erasing = false;
  (function tick() {
    var full = lines[li];
    if (!erasing) {
      ci++;
      out.textContent = full.slice(0, ci);
      /* solid while the keys are going in, blinking only once it stops */
      if (ci >= full.length) {
        erasing = true; out.classList.add('rest'); setTimeout(tick, 2400); return;
      }
      setTimeout(tick, 52);
    } else {
      out.classList.remove('rest');
      ci--;
      out.textContent = full.slice(0, ci);
      if (ci <= 0) {
        erasing = false; li = (li + 1) % lines.length; face(li);
        out.classList.add('rest');
        setTimeout(function () { out.classList.remove('rest'); tick(); }, 520);
        return;
      }
      setTimeout(tick, 24);
    }
  })();
})();

/* ── the conversation types itself ──────────────────────────────────────
   A screenshot of a chat is a dead thing. The exchange is real elements, and
   when its card arrives the question is typed a character at a time and the
   answer lands after it, which is what the product actually feels like. */
var typeIv = 0, typeTo = 0;
function typeOut(card) {
  clearInterval(typeIv); clearTimeout(typeTo);
  var think = card ? card.querySelector('.thinking') : null;
  if (think) think.classList.remove('on');
  var nodes = card ? [].slice.call(card.querySelectorAll('[data-type]')) : [];
  if (!nodes.length) return;
  nodes.forEach(function (n) {
    if (!n.dataset.full) n.dataset.full = n.textContent.trim();
    n.textContent = reduced ? n.dataset.full : '';
    n.classList.remove('done');
    /* an empty bubble is still a bordered box sitting in the layout, so a
       message does not exist until it starts being typed */
    if (!reduced) n.classList.add('pending');
  });
  if (reduced) {
    nodes.forEach(function (n) { n.classList.add('done'); });
    if (think) think.classList.add('on');
    return;
  }

  var i = 0;
  (function run() {
    if (i >= nodes.length) {
      /* the exchange ends on the mark turning, not on a full stop */
      if (think) typeTo = setTimeout(function () { think.classList.add('on'); }, 360);
      return;
    }
    var n = nodes[i], full = n.dataset.full, c = 0;
    var speed = n.dataset.speed ? +n.dataset.speed : 34;
    n.classList.remove('pending');
    typeIv = setInterval(function () {
      c++;
      n.textContent = full.slice(0, c);
      if (c >= full.length) {
        clearInterval(typeIv);
        n.classList.add('done');
        i++;
        typeTo = setTimeout(run, 420);
      }
    }, speed);
  })();
}

/* ── WHAT IT IS DOING ───────────────────────────────────────────────────
   One kind of work is live at a time and the mark beside it is building that
   thing, so the formation is the caption. It walks itself; reach for one and
   it holds there.

   It was a belt scrolling across the card, which was slow to read, ran out
   past the edge of the frame, and made you wait for the word you wanted. The
   concept is the same and the scrolling is gone. */
(function () {
  var wall = document.querySelector('.wall');
  if (!wall) return;
  var words = [].slice.call(wall.querySelectorAll('.wd'));
  if (!words.length) return;
  var card = wall.closest ? wall.closest('.card') : null;
  var i = 0, held = -1, iv = 0;
  function onCard() { return !card || card === liveCard; }
  function walk() {
    clearInterval(iv);
    iv = setInterval(function () {
      if (held < 0 && onCard()) pick((i + 1) % words.length);
    }, 2700);
  }
  function pick(n, byHand) {
    i = n;
    words.forEach(function (w, k) { w.classList.toggle('on', k === i); });
    /* a hand on a word is the peek's job; these carry data-peek */
    if (!byHand && hover === null && onCard() && words[i].dataset.peek) {
      morphTo(words[i].dataset.peek);
    }
  }
  pick(0);
  words.forEach(function (w, n) {
    w.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'touch') { held = n; pick(n, 1); }
    });
    w.addEventListener('focus', function () {
      if (w.matches(':focus-visible')) { held = n; pick(n, 1); }
    });
    /* A tap is a choice, not a hover. It shows that word and gives it the full
       beat before the walk moves on. */
    w.addEventListener('click', function () {
      pick(n);
      if (!reduced) walk();
    });
  });
  wall.addEventListener('pointerleave', function () { held = -1; });
  if (reduced) return;
  walk();
})();

/* ── THE BAR ────────────────────────────────────────────────────────────
   One diamond for five pages. It rests under the page you are on and runs to
   whatever you reach for, so the bar answers before the click lands, the same
   way the mark does. Five underlines drawing and undrawing was five small
   unrelated events. */
(function () {
  var nav = document.querySelector('.top nav');
  if (!nav) return;
  var items = [].slice.call(nav.querySelectorAll('a'));
  if (!items.length) return;
  var mk = document.createElement('i');
  mk.className = 'navmark';
  nav.appendChild(mk);
  var home = nav.querySelector('[aria-current="page"]') || items[0];
  var target = home, at = null, raf5 = 0;

  function centreOf(el) {
    var r = el.getBoundingClientRect(), n = nav.getBoundingClientRect();
    return r.left - n.left + r.width / 2;
  }
  function run() {
    var want = centreOf(target);
    if (at === null) at = want;
    at += (want - at) * 0.26;
    mk.style.transform = 'translateX(' + at.toFixed(2) + 'px)';
    raf5 = Math.abs(want - at) > 0.3 ? requestAnimationFrame(run) : 0;
  }
  function go(el) { target = el; if (!raf5) raf5 = requestAnimationFrame(run); }
  items.forEach(function (a) {
    a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') go(a); });
    a.addEventListener('focus', function () { if (a.matches(':focus-visible')) go(a); });
  });
  nav.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') go(home); });
  go(home);
  addEventListener('resize', function () { at = null; go(target); }, { passive: true });
})();

/* ── A PICTURE ARRIVING ─────────────────────────────────────────────────
   Out of order, the way one actually resolves, rather than a bar filling from
   the left, which is a download. The cells carry their own delay so the shuffle
   is real and not a diagonal sweep pretending to be one. */
(function () {
  var gen = document.querySelector('[data-gen]');
  if (!gen) return;
  var N2 = 70, order = [], i;
  for (i = 0; i < N2; i++) order.push(i);
  /* a fixed shuffle: same every load, so it is a design and not a lottery */
  for (i = order.length - 1; i > 0; i--) {
    var j = (i * 1103515245 + 12345) % (i + 1);
    var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }
  for (i = 0; i < N2; i++) {
    var cell = document.createElement('i');
    cell.style.animationDelay = (order[i] / N2 * 2.1).toFixed(2) + 's';
    gen.appendChild(cell);
  }
})();

/* ── THE VALUES DO NOT MOVE ─────────────────────────────────────────────
   Four things we will not trade, and the page says so by behaving that way.
   Run the cursor down them and every line gives ground, pushed off the hand
   the same way the diamonds are — except the one you are actually reading,
   which does not shift by a pixel while the others part around it. The thing
   you have reached for is the one thing that will not move.

   Written through el.style rather than a class, which is allowed: style-src
   blocks a style attribute sitting in the markup, not the CSSOM. */
(function () {
  var creed = document.querySelector('.creed');
  if (!creed || reduced || coarse) return;   /* on a phone the rows would jiggle under a scrolling thumb */
  var rows = [].slice.call(creed.querySelectorAll('.cv'));
  if (rows.length < 2) return;
  var SHOVE = 26, SPAN = 190;
  var want = [], have = [], raf2 = 0, cy = -9e9;

  rows.forEach(function () { want.push(0); have.push(0); });

  function aim() {
    var hot = -1, i, b;
    for (i = 0; i < rows.length; i++) {
      b = rows[i].getBoundingClientRect();
      if (cy >= b.top && cy <= b.bottom) hot = i;
    }
    for (i = 0; i < rows.length; i++) {
      if (hot < 0 || i === hot) { want[i] = 0; rows[i].classList.toggle('held', i === hot); continue; }
      rows[i].classList.remove('held');
      b = rows[i].getBoundingClientRect();
      var d = (b.top + b.bottom) / 2 - cy;
      var f = Math.max(0, 1 - Math.abs(d) / SPAN);
      want[i] = (d < 0 ? -1 : 1) * f * f * SHOVE;
    }
    creed.classList.toggle('reading', hot >= 0);
  }
  function run() {
    var moving = 0;
    for (var i = 0; i < rows.length; i++) {
      have[i] += (want[i] - have[i]) * 0.2;
      if (Math.abs(want[i] - have[i]) > 0.05) moving = 1;
      rows[i].style.transform = 'translateY(' + have[i].toFixed(2) + 'px)';
    }
    raf2 = moving ? requestAnimationFrame(run) : 0;
  }
  function kick() { if (!raf2) raf2 = requestAnimationFrame(run); }
  creed.addEventListener('pointermove', function (e) { cy = e.clientY; aim(); kick(); });
  creed.addEventListener('pointerleave', function () { cy = -9e9; aim(); kick(); });
})();

/* ── the cards drive the mark ───────────────────────────────────────────── */
var cards = [].slice.call(document.querySelectorAll('.card[data-form]'));
var label = document.querySelector('[data-settle]');
var liveCard = null, stageOff = false, stageOffAt = 0, fieldTick = 0;
function applyCard(el, quiet) {
  if (!el || el === liveCard) return;
  /* the landing holds the mark in the middle of the page; every card after it
     hands the mark over to the right column, and the move is the transition */
  var firstCard = !liveCard;
  liveCard = el;
  atLanding = el.classList.contains('landing');
  if (firstCard) landK = atLanding ? 1 : 0;   /* a page opens at its size, it does not ease into it */
  document.documentElement.classList.toggle('at-landing', atLanding);
  /* a card that brings its own visual takes the right column from the mark */
  var off = el.dataset.stage === 'off';
  if (off && !stageOff) stageOffAt = performance.now();
  stageOff = off;
  document.documentElement.classList.toggle('stage-off', off);
  typeOut(el);
  /* Scrolling while a navigation item is being hovered: the peek keeps the
     frame, and what it hands back is the mark the new card asked for. */
  if (hover !== null) held = el.dataset.form;
  else morphTo(el.dataset.form, quiet || intro);
  if (label && el.dataset.label) settleTo(label, el.dataset.label);
  el.classList.add('seen');
  cards.forEach(function (c) { c.classList.toggle('live', c === el); });
}

/* ── one notch, one card ────────────────────────────────────────────────
   CSS scroll-snap will not do this. With mandatory snapping a small wheel
   notch simply springs back to the card you are already on, and with proximity
   it drifts. So the wheel is taken over and one notch moves exactly one card.

   Two things switch it off. If any card is taller than the window the reader
   must be able to stop part way down it, and if the pointer is over something
   that scrolls on its own then that scroll belongs to it. */
var loose = false;
/* re-measure everything that was baked at a moment the layout was not final */
var relayout = function () {};
/* How much is covering the top of the page. On a wide screen that is just the
   bar; on a phone the mark sits in a band under it, and scrolling a card to the
   bar alone hid its first third behind that band. */
function headroom(card) {
  var bar = document.querySelector('.top');
  var h = bar ? bar.getBoundingClientRect().height : 0;
  /* The band only exists in the phone layout, so that is the only place to go
     looking for it. Measuring the stage box itself was close enough until the
     splash made it the whole screen for a second and a half: headroom came back
     as the full viewport, every card measured as taller than the room it had,
     the page fell into free scrolling and the observer's root collapsed to a
     strip nothing could ever intersect. The home page stopped advancing its
     cards entirely.

     Asked about a particular card, the answer is that card's: one with its own
     visual fades the band out and has the room to itself. */
  var st = document.querySelector('.stage');
  if (st && bandMQ.matches && !(card && card.dataset.stage === 'off') &&
      !document.documentElement.classList.contains('splash')) {
    h += st.getBoundingClientRect().height;
  }
  return h;
}
function snapGuard() {
  if (!cards.length) return;
  /* Measured against the small viewport on a phone, like the cards themselves.
     innerHeight grows when the URL bar hides, so a card that only just fitted
     flipped the whole page between snapping and free scrolling mid-swipe. */
  var screen = bandMQ.matches ? svh() : innerHeight;
  var tall = false;
  cards.forEach(function (c) {
    var room = screen - headroom(c);
    /* every child, not just the words: on a phone the card's visual stacks
       under them, and counting only the first left a tall card snapping */
    var top = Infinity, bot = -Infinity;
    for (var k = 0; k < c.children.length; k++) {
      var r = c.children[k].getBoundingClientRect();
      if (!r.height) continue;
      top = Math.min(top, r.top); bot = Math.max(bot, r.bottom);
    }
    var hgt = bot > top ? bot - top : c.scrollHeight;
    if (hgt > room - 28) tall = true;
  });
  loose = tall;
  document.documentElement.classList.toggle('loose', tall);
}
function cardIndex() {
  var i = cards.indexOf(liveCard);
  return i < 0 ? 0 : i;
}
function goTo(i) {
  i = Math.max(0, Math.min(cards.length - 1, i));
  var y = cards[i].getBoundingClientRect().top + (scrollY || pageYOffset) - headroom(cards[i]);
  scrollTo({ top: Math.max(0, Math.round(y)), behavior: reduced ? 'auto' : 'smooth' });
  applyCard(cards[i]);
}
var notchLock = false;
function notch(dir) {
  if (notchLock) return;
  var i = cardIndex() + dir;
  if (i < 0 || i > cards.length - 1) return;   /* no lock for a notch that goes nowhere */
  notchLock = true;
  /* long enough to cover the smooth scroll itself, so the observer never gets
     to argue with it halfway */
  setTimeout(function () { notchLock = false; }, reduced ? 60 : 820);
  goTo(i);
}
function ownScroll(node) {
  for (var n = node; n && n !== document.body; n = n.parentElement) {
    if (n.scrollHeight > n.clientHeight + 2) {
      var ov = getComputedStyle(n).overflowY;
      if (ov === 'auto' || ov === 'scroll') return true;
    }
  }
  return false;
}
addEventListener('wheel', function (e) {
  if (loose || !cards.length) return;
  if (Math.abs(e.deltaY) < 4) return;
  if (ownScroll(e.target)) return;
  e.preventDefault();
  notch(e.deltaY > 0 ? 1 : -1);
}, { passive: false });
addEventListener('keydown', function (e) {
  if (loose || !cards.length) return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  var key = e.key;
  if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') { e.preventDefault(); notch(1); }
  else if (key === 'ArrowUp' || key === 'PageUp') { e.preventDefault(); notch(-1); }
  else if (key === 'Home') { e.preventDefault(); goTo(0); }
  else if (key === 'End') { e.preventDefault(); goTo(cards.length - 1); }
});
var ty0 = null;
addEventListener('touchstart', function (e) {
  /* On a phone the cards page by native scroll-snap (site.css). Driving a
     smooth scrollTo from touchend fought the finger's own momentum and the
     page overshot and snapped back. */
  ty0 = (coarse || loose || ownScroll(e.target)) ? null : e.touches[0].clientY;
}, { passive: true });
addEventListener('touchend', function (e) {
  if (ty0 === null) return;
  var dy = ty0 - e.changedTouches[0].clientY; ty0 = null;
  if (Math.abs(dy) > 44) notch(dy > 0 ? 1 : -1);
}, { passive: true });

/* A card clicked in from elsewhere, or a hash landing, still lines up. */
addEventListener('hashchange', function () { snapGuard(); });

[].forEach.call(document.querySelectorAll('[data-assemble]'), splitWords);

if ('IntersectionObserver' in window) {
  var ioH = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('set'); });
  }, { threshold: 0.2 });
  [].forEach.call(document.querySelectorAll('[data-assemble]'), function (h) { ioH.observe(h); });

  /* Two things this has to get right. The ratios are kept in a map and the
     best of ALL cards wins, because the callback only delivers the ones that
     crossed a threshold and picking the best of those made the card you were
     leaving win. And the top of the window is discounted by the headroom, so
     the part of a card hidden behind the bar and the mark band does not count
     as being in front of you. */
  var ratio = new Map(), cardIO = null, ioRoom = null;
  function watchCards() {
    /* the URL bar fires resize constantly and rarely changes this */
    var margin = Math.round(headroom());
    if (cardIO && margin === ioRoom) return;
    ioRoom = margin;
    if (cardIO) cardIO.disconnect();
    cardIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        /* How much of the room it fills, or of itself if it is the smaller. Its
           share of itself alone never reaches the bar on a card much taller than
           the screen, so a long card on a phone could never go live. */
        var room = en.rootBounds ? en.rootBounds.height : innerHeight;
        var v = en.intersectionRect.height /
                Math.max(1, Math.min(en.boundingClientRect.height, room));
        ratio.set(en.target, v);
        /* scrolling freely, the next card is on screen long before it is live
           and should not sit there blank until it is */
        if (loose && v > 0.08) en.target.classList.add('seen');
      });
      /* A smooth scroll passes through every card between here and there, and
         the observer fired for each one: the mark morphed two or three times
         per notch and the headlines re-ran their entrance halfway through.
         While a notch is in flight the destination has already been applied,
         so the observer stays out of it. */
      if (notchLock) return;
      var best = null, bv = 0;
      cards.forEach(function (c) { var v = ratio.get(c) || 0; if (v > bv) { bv = v; best = c; } });
      if (best && bv > 0.45) applyCard(best);
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.55, 0.65, 0.8, 0.9, 1],
         rootMargin: (-margin) + 'px 0px 0px 0px' });
    cards.forEach(function (c) { cardIO.observe(c); });
  }
  if (cards.length) watchCards();
  relayout = function () { snapGuard(); watchCards(); };
} else {
  [].forEach.call(document.querySelectorAll('[data-assemble]'), function (h) { h.classList.add('set'); });
}

/* ── hovering a page in the navigation shows that page's mark ────────────
   Then gives it back. The glitch he caught — home, fast to Mashmoom, fast to
   About us, and the mark lurching back to where it started before setting off
   again — is a leave and an enter firing in that order on two adjacent items.
   Leaving Mashmoom handed the mark back to the home mark, and the enter on
   About us then started a second morph from it. Both were legitimate; running
   them one after the other is what looked cancelled.

   So the hand-back waits. Landing on another peek inside that window cancels
   it, and what is remembered is only ever the mark the card itself asked for. */
var held = null, backTo = 0;
function peekBack() {
  if (hover === null) return;
  hover = null;
  var back = held; held = null;
  if (back) morphTo(back);
}
[].forEach.call(document.querySelectorAll('[data-peek]'), function (a) {
  var f = a.dataset.peek;
  function on() {
    clearTimeout(backTo);
    if (hover === null) held = to;
    hover = f;
    morphTo(f);        /* already on it: returns, and the peek simply holds */
  }
  function off() {
    clearTimeout(backTo);
    backTo = setTimeout(peekBack, 90);
  }
  /* A finger has no hover. A tap fired enter and leave 90ms apart, so the mark
     set off toward the peek and turned straight back: the flicker on every nav
     link and wall word. Keyboard focus still peeks, a tap's focus does not. */
  a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') on(); });
  a.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') off(); });
  a.addEventListener('focus', function () { if (a.matches(':focus-visible')) on(); });
  a.addEventListener('blur', off);
});

addEventListener('pointermove', function (e) {
  /* a finger dragging is a scroll, not a cursor; left in, the mark kept a hole
     where the thumb last lifted */
  if (e.pointerType === 'touch') { mx = my = vmx = vmy = -9e9; return; }
  var b = cv.getBoundingClientRect();
  mx = e.clientX - b.left; my = e.clientY - b.top;
  vmx = e.clientX; vmy = e.clientY;
}, { passive: true });
addEventListener('pointerleave', function () { mx = my = -9e9; vmx = vmy = -9e9; });
var rt = 0, lastW = innerWidth, BW = 0, BH = 0;
addEventListener('resize', function () {
  clearTimeout(rt);
  rt = setTimeout(function () {
    /* A phone's URL bar showing or hiding is a height-only resize that moves
       neither canvas (the band is svh, the field lvh). Rebuilding for it
       resampled every formation mid-scroll and the mark jumped. */
    var mb = cv.getBoundingClientRect(), fb = fctx ? fcv.getBoundingClientRect() : null;
    var still = Math.abs(innerWidth - lastW) < 2 &&
      Math.abs(mb.width - BW) < 1 && Math.abs(mb.height - BH) < 1 &&
      (!fb || Math.abs(Math.round(fb.height) - FH) < 2);
    lastW = innerWidth;
    if (!still) build();
    snapGuard();
    /* the headroom changes with the layout, and it is baked into the observer */
    if (typeof watchCards === 'function') watchCards();
  }, 140);
}, { passive: true });
document.addEventListener('visibilitychange', function () {
  if (document.hidden) { cancelAnimationFrame(raf); raf = 0; tPrev = 0; }
  else if (!raf) raf = requestAnimationFrame(draw);
});

build();
if (cards.length) applyCard(cards[0], true);
/* Arriving from anywhere else in this session is a return, not an arrival. */
if (carried && cameFrom !== location.pathname) { splash = false; }
if (carried && cameFrom !== location.pathname && carried !== to) {
  /* came from another page: start on the mark that page was showing and morph
     across, so the logo is the one thing that does not reload. No splash
     either — it is an arrival, not a return, and sitting through it again
     every time you click Home would be a toll booth. */
  sampleSet(carried);
  intro = false; splash = false; from = carried; mix = 0;
} else if (intro) {
  /* The entrance paints whatever formation the canvas declares, so `to` has to
     agree with it. Left hardcoded to the X it did not: the landing built the
     wordmark, the entrance ended, the engine saw `to` was still 'x' and ran a
     full morph from the X into the wordmark. The lockup blew apart and
     reassembled the moment it had finished arriving, which is the glitch he
     caught on the way in. */
  from = to = INTROFORM;
}
if (splash) setTimeout(function () {
  document.documentElement.classList.remove('splash');
}, 4500);
if (!splash) document.documentElement.classList.remove('splash');
document.documentElement.classList.add('mark-live');
raf = requestAnimationFrame(draw);
snapGuard();
addEventListener('load', snapGuard);
})();
