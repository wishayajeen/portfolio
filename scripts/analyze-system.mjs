#!/usr/bin/env node
/**
 * analyze-system.mjs
 * Generates src/system/system.generated.json from static analysis of src/.
 *
 * Run: node scripts/analyze-system.mjs
 * Or:  npm run analyze-system
 *
 * Auto-detects: imports, source instances, variants, raw CSS class occurrences,
 *               adoption status, blocked usages.
 * Config-driven: raw CSS mimic metadata, runtime estimates, migration opportunity lists.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT CONFIG
// Edit when components or their variants change.
// ══════════════════════════════════════════════════════════════════════════════

const SYSTEM_COMPONENTS = [
  {
    id: 'badge',
    label: 'Badge',
    file: 'src/components/system/Badge.astro',
    metadataFile: 'src/components/system/Badge.metadata.json',
    allVariants: ['tag', 'coming-soon', 'diary-tag', 'skill', 'work-tag'],
  },
  {
    id: 'button',
    label: 'Button',
    file: 'src/components/system/Button.astro',
    metadataFile: 'src/components/system/Button.metadata.json',
    allVariants: ['primary', 'secondary'],
  },
  {
    id: 'card',
    label: 'Card',
    file: 'src/components/system/Card.astro',
    metadataFile: 'src/components/system/Card.metadata.json',
    allVariants: ['default', 'accent', 'diary'],
  },
  {
    id: 'link',
    label: 'Link',
    file: 'src/components/system/Link.astro',
    metadataFile: 'src/components/system/Link.metadata.json',
    allVariants: ['default', 'on-dark', 'nav', 'back', 'footer-nav'],
  },
  {
    id: 'icon-button',
    label: 'Icon Button',
    file: 'src/components/system/IconButton.astro',
    metadataFile: 'src/components/system/IconButton.metadata.json',
    allVariants: ['default'],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// RAW CSS MIMIC CONFIG
// Each entry describes one CSS class pattern and its mapping to a system component.
// Auto-detected: foundIn (files + line numbers).
// Manual: mapsToVariant, element, scope, migrationStatus, migrationNote, runtimeCount.
//
// filterElement: when set, only count occurrences where the guessed element type matches.
//               Used when the same class appears on multiple element types in one file.
// filterFile:   when set, only scan that specific file for this pattern.
// ══════════════════════════════════════════════════════════════════════════════

const RAW_MIMIC_PATTERNS = [
  // ── Badge ─────────────────────────────────────────────────────────────────
  {
    cssClass: 'work-tag',
    componentId: 'badge',
    mapsToVariant: 'work-tag',
    element: 'span',
    scope: 'product',
    migrationStatus: 'blocked',
    migrationNote: 'WorkSection.jsx is a React island — cannot import Badge.astro.',
    runtimeCount: '3 (one per project, static data)',
  },
  {
    cssClass: 'work-coming-soon-badge',
    componentId: 'badge',
    mapsToVariant: 'coming-soon',
    element: 'span',
    scope: 'product',
    migrationStatus: 'blocked',
    migrationNote: "WorkSection.jsx is a React island. Raw JSX manually replicates the two-span DOM structure (outer badge + inner dot span) — correctly matches Badge.astro output.",
    runtimeCount: '2 (conditional on comingSoon: true, 2 of 3 projects)',
  },

  // ── Link — product ────────────────────────────────────────────────────────
  {
    cssClass: 'nav-link',
    componentId: 'link',
    mapsToVariant: 'nav',
    element: 'button',
    scope: 'product',
    migrationStatus: 'permanently-blocked',
    migrationNote: "Two independent blockers: (1) Header.jsx is a React island. (2) These are <button> elements with onClick scroll-to-section behavior; Link always renders <a> and cannot substitute.",
    runtimeCount: 'N (one per nav item, dynamic)',
  },
  {
    cssClass: 'footer-nav-link',
    componentId: 'link',
    mapsToVariant: 'footer-nav',
    element: 'button',
    scope: 'product',
    filterFile: 'src/components/global/Footer.jsx',
    filterElement: 'button',
    migrationStatus: 'permanently-blocked',
    migrationNote: "Same dual blocker as nav-link: React island + onClick scroll behavior requiring <button> element.",
    runtimeCount: 'N (scroll-to-section items, dynamic)',
  },
  {
    cssClass: 'footer-nav-link',
    componentId: 'link',
    mapsToVariant: 'footer-nav',
    element: 'a',
    scope: 'product',
    filterFile: 'src/components/global/Footer.jsx',
    filterElement: 'a',
    migrationStatus: 'blocked',
    migrationNote: "Footer.jsx is a React island — cannot import Link.astro. Could migrate if Footer were converted to Astro.",
    runtimeCount: 'N (external social/nav links, dynamic)',
  },

  // ── Link — ds-pages ───────────────────────────────────────────────────────
  {
    cssClass: 'back-link',
    componentId: 'link',
    mapsToVariant: 'back',
    element: 'a',
    scope: 'ds-pages',
    migrationStatus: 'feasible',
    migrationNote: "All DS pages are Astro files. components.astro already imports Link for demos — could reuse the same import.",
    runtimeCount: '4 (one per DS route, static)',
  },
  {
    cssClass: 'footer-nav-link',
    componentId: 'link',
    mapsToVariant: 'footer-nav',
    element: 'a',
    scope: 'ds-pages',
    migrationStatus: 'feasible',
    migrationNote: "All DS pages are Astro files — feasible to use <Link variant='footer-nav'>. Ironic: the DS components showcase uses raw link classes in its own nav.",
    runtimeCount: '9 (3 per DS route × 3 DS pages, static)',
  },

  // ── IconButton ────────────────────────────────────────────────────────────
  {
    cssClass: 'icon-btn',
    componentId: 'icon-button',
    mapsToVariant: 'default',
    element: 'button',
    scope: 'product',
    migrationStatus: 'blocked',
    migrationNote: "Footer.jsx is a React island — cannot import IconButton.astro. The raw pattern is the documented correct fallback: <button className='icon-btn' aria-label='...'><Icon /></button>.",
    runtimeCount: '1 (copy email button, static)',
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// RUNTIME INSTANCE OVERRIDES
// Source instances count JSX/Astro usages statically (1 per loop, not multiplied).
// Specify total estimated runtime count per component when instances are inside loops.
// Set to null to fall back to the conservative auto-detected source count.
// Update when underlying data arrays change.
// ══════════════════════════════════════════════════════════════════════════════

const RUNTIME_INSTANCE_OVERRIDES = {
  badge: 14,        // ~4 tag + 2 coming-soon + 2 diary-tag + 6 skill
  button: 2,
  card: 6,          // ~1 accent + 3 default + 2 diary
  link: 5,
  'icon-button': 0,
};

// ══════════════════════════════════════════════════════════════════════════════
// MIGRATION OPPORTUNITIES
// Editorial — cannot be auto-detected. Update when migrations complete.
// ══════════════════════════════════════════════════════════════════════════════

const MIGRATION_OPPORTUNITIES = {
  migrated: [
    "Hero.astro — Button primary → <Button variant='primary'>",
    "Hero.astro — Button secondary → <Button variant='secondary'>",
    "Hero.astro — Link on-dark ×2 → <Link variant='on-dark' external>",
    "AboutSection.astro — Badge skill ×6 → <Badge variant='skill'>",
    "diary/[slug].astro — Link back ×3 → <Link variant='back'> (including scroll-to-top via onclick rest prop)",
  ],
  feasible: [
    "design-system/index.astro — Link back (line 23)",
    "design-system/dashboard.astro — Link back + footer-nav ×4",
    "design-system/components.astro — Link back + footer-nav ×4",
    "design-system/foundations.astro — Link back + footer-nav ×4",
  ],
  permanentlyBlocked: [
    "Header.jsx nav-link — React island + scroll-to-section button behavior",
    "Footer.jsx footer-nav-link as button — React island + scroll-to-section button behavior",
  ],
  blocked: [
    "WorkSection.jsx work-tag — React island",
    "WorkSection.jsx work-coming-soon-badge — React island",
    "Footer.jsx footer-nav-link as a — React island",
    "Footer.jsx icon-btn — React island",
  ],
};

// ══════════════════════════════════════════════════════════════════════════════
// SCOPE CONFIG
// ══════════════════════════════════════════════════════════════════════════════

// Import-based adoption tracking (product code only)
const PRODUCT_IMPORT_SCOPE = [
  'src/components/home',
  'src/components/global',
  'src/pages/index.astro',
  'src/pages/diary/[slug].astro',
];

// Raw CSS mimic detection — DS pages (back-link, footer-nav-link in nav bars)
const DS_PAGES_SCOPE = [
  'src/pages/design-system',
];

// ══════════════════════════════════════════════════════════════════════════════
// FILE UTILITIES
// ══════════════════════════════════════════════════════════════════════════════

const SRC_EXTS = new Set(['.astro', '.jsx', '.js', '.ts', '.tsx']);

function walkDir(dirPath) {
  const abs = join(ROOT, dirPath);
  if (!existsSync(abs)) return [];
  const results = [];
  for (const entry of readdirSync(abs)) {
    const full = join(abs, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(relative(ROOT, full)));
    } else if (SRC_EXTS.has(extname(entry))) {
      results.push(relative(ROOT, full));
    }
  }
  return results;
}

function collectScope(includes) {
  const files = [];
  for (const inc of includes) {
    const abs = join(ROOT, inc);
    if (!existsSync(abs)) continue;
    if (statSync(abs).isFile()) {
      if (SRC_EXTS.has(extname(inc))) files.push(inc);
    } else {
      files.push(...walkDir(inc));
    }
  }
  return [...new Set(files)];
}

function readSrc(filePath) {
  return readFileSync(join(ROOT, filePath), 'utf8');
}

// ══════════════════════════════════════════════════════════════════════════════
// PARSING HELPERS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Split an .astro file into { frontmatter, template, templateLineOffset }.
 * The offset is the number of content lines before the template begins,
 * so that line numbers reported in the template section are relative to the full file.
 */
function splitAstro(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', template: content, templateLineOffset: 0 };
  const fmLines = match[1].split('\n').length;
  return {
    frontmatter: match[1],
    template: match[2],
    templateLineOffset: fmLines + 2, // +2 for the two --- delimiter lines
  };
}

/**
 * Find the local import alias for a system component file.
 * Returns the alias string or null if not imported.
 * Handles: import Badge from '../../components/system/Badge.astro'
 *          import Badge from '../system/Badge.astro'
 */
function findImportAlias(content, componentFileName) {
  const stem = componentFileName.replace(/\.astro$/, '');
  const re = new RegExp(
    `import\\s+(\\w+)\\s+from\\s+['"][^'"]*(?:system)/${stem}\\.astro['"]`
  );
  const m = content.match(re);
  return m ? m[1] : null;
}

/**
 * Extract the opening tag from content starting at startIdx.
 * Tracks brace depth and quoted strings to find the real closing `>`.
 * Stops at the first unescaped `>` with brace depth 0.
 */
function extractOpeningTag(content, startIdx) {
  let i = startIdx;
  let inQuote = null;
  let braceDepth = 0;
  while (i < content.length) {
    const ch = content[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === '{') {
      braceDepth++;
    } else if (ch === '}') {
      braceDepth--;
    } else if (ch === '>' && braceDepth === 0) {
      return content.slice(startIdx, i + 1);
    }
    i++;
  }
  // Fallback: return up to 400 chars if no closing > found
  return content.slice(startIdx, Math.min(startIdx + 400, content.length));
}

/**
 * Extract variant value(s) from an opening tag string.
 * Returns an array of resolved string variants, or null for fully dynamic expressions.
 * Handles static strings ("accent"), template literals ({'accent'}), and
 * ternary/conditional expressions (extracting all string literals within the expression).
 */
function extractVariants(tagContent) {
  const staticMatch = tagContent.match(/variant=["']([^"']+)["']/);
  if (staticMatch) return [staticMatch[1]];

  const dynMatch = tagContent.match(/variant=\{([^}]*)\}/);
  if (dynMatch) {
    const strings = [...dynMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
    return strings.length > 0 ? strings : null;
  }

  return null;
}

/**
 * Find all usages of a component by its local alias in template or JSX content.
 * Returns [{ fileLineNumber, variants: string[]|null, rawLine }].
 * lineOffset: added to convert template-local line numbers to full-file line numbers.
 *
 * Variant extraction scans only the opening tag (not children) to avoid
 * capturing variants from nested components.
 */
function findUsages(templateContent, alias, lineOffset) {
  const re = new RegExp(`<${alias}\\b`, 'g');
  const lines = templateContent.split('\n');
  const results = [];
  let match;

  while ((match = re.exec(templateContent)) !== null) {
    const before = templateContent.slice(0, match.index);
    const localLine = before.split('\n').length; // 1-based within template
    const fileLineNumber = localLine + lineOffset;

    const tagContent = extractOpeningTag(templateContent, match.index);
    const variants = extractVariants(tagContent);

    results.push({
      fileLineNumber,
      variants,
      rawLine: lines[localLine - 1]?.trim() ?? '',
    });
  }

  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// RAW CSS CLASS DETECTION
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Find occurrences of cssClass used as a CSS class attribute value.
 * Requires the class to appear inside class=["'] or className=["'] (not text content).
 * Returns [{ lineNumber (1-based), detectedElement: 'a'|'button'|'span'|null }].
 *
 * Uses negative lookbehind/lookahead (?<![a-zA-Z0-9-]) to ensure the class name
 * is not a substring of a longer class (e.g. nav-link must not match footer-nav-link,
 * work-tag must not match work-tag-row).
 */
function findClassAttributeOccurrences(content, cssClass) {
  const lines = content.split('\n');
  const results = [];

  // Matches class or className attribute value containing cssClass as a standalone token.
  // Negative lookbehind/lookahead prevents partial matches inside longer class names.
  const attrRe = new RegExp(
    `class(?:Name)?=["'][^"']*(?<![a-zA-Z0-9-])${cssClass}(?![a-zA-Z0-9-])[^"']*["']`
  );

  for (let i = 0; i < lines.length; i++) {
    if (!attrRe.test(lines[i])) continue;

    // Look at ±3 lines for the element tag
    const windowStart = Math.max(0, i - 3);
    const windowEnd = Math.min(lines.length - 1, i + 1);
    const context = lines.slice(windowStart, windowEnd + 1).join('\n');

    let detectedElement = null;
    // Check from the current line backward (element tag usually precedes className)
    for (let j = i; j >= windowStart; j--) {
      const l = lines[j];
      if (/^[\s,({]*<button\b/.test(l) || /<button\b/.test(l)) { detectedElement = 'button'; break; }
      if (/^[\s,({]*<a\b/.test(l) || /<a\b/.test(l)) { detectedElement = 'a'; break; }
      if (/^[\s,({]*<span\b/.test(l) || /<span\b/.test(l)) { detectedElement = 'span'; break; }
    }

    results.push({ lineNumber: i + 1, detectedElement });
  }

  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT ANALYSIS
// ══════════════════════════════════════════════════════════════════════════════

function analyzeComponent(comp, productFiles, dsPageFiles) {
  const { id, label, file, metadataFile, allVariants } = comp;
  const componentFilename = basename(file);

  const directImportFiles = [];
  const instanceDetails = [];
  const variantsDirectSet = new Set();

  // ── Scan product files for imports + usages ──────────────────────────────
  for (const filePath of productFiles) {
    const content = readSrc(filePath);
    const alias = findImportAlias(content, componentFilename);
    if (!alias) continue;

    directImportFiles.push(filePath);

    let scanContent = content;
    let lineOffset = 0;

    if (filePath.endsWith('.astro')) {
      const { template, templateLineOffset } = splitAstro(content);
      scanContent = template;
      lineOffset = templateLineOffset;
    }

    const usages = findUsages(scanContent, alias, lineOffset);
    for (const u of usages) {
      if (u.variants) for (const v of u.variants) variantsDirectSet.add(v);
      instanceDetails.push({
        file: filePath,
        line: u.fileLineNumber,
        variant: u.variants ? u.variants.join('|') : '(fully dynamic)',
        context: u.rawLine.slice(0, 120),
      });
    }
  }

  // ── Detect raw CSS mimics ────────────────────────────────────────────────
  const rawMimics = [];
  const processedKeys = new Set(); // prevent double-counting compound patterns

  for (const pattern of RAW_MIMIC_PATTERNS) {
    if (pattern.componentId !== id) continue;

    const targetFiles =
      pattern.scope === 'ds-pages' ? dsPageFiles : productFiles;

    const foundIn = [];

    for (const filePath of targetFiles) {
      if (pattern.filterFile && filePath !== pattern.filterFile) continue;

      const content = readSrc(filePath);
      const occurrences = findClassAttributeOccurrences(content, pattern.cssClass);

      for (const occ of occurrences) {
        if (pattern.filterElement) {
          // Only count if detected element matches, or is null (ambiguous multi-line)
          if (occ.detectedElement !== null && occ.detectedElement !== pattern.filterElement) {
            continue;
          }
        }
        foundIn.push(`${filePath}:${occ.lineNumber}`);
      }
    }

    if (foundIn.length === 0) continue;

    rawMimics.push({
      cssClass: pattern.cssClass,
      mapsToVariant: pattern.mapsToVariant,
      element: pattern.element,
      scope: pattern.scope,
      foundIn,
      runtimeCount: pattern.runtimeCount,
      migrationStatus: pattern.migrationStatus,
      migrationNote: pattern.migrationNote,
    });
  }

  // ── Derive variant sets ──────────────────────────────────────────────────
  const variantsRawSet = new Set(rawMimics.map(m => m.mapsToVariant));
  const variantsNotUsed = allVariants.filter(
    v => !variantsDirectSet.has(v) && !variantsRawSet.has(v)
  );

  // ── Derive blocked usages from raw mimics in .jsx files ──────────────────
  const blockedMap = new Map(); // filePath → { classes[], isPermanent }
  for (const mimic of rawMimics) {
    if (mimic.scope !== 'product') continue;
    for (const location of mimic.foundIn) {
      const filePath = location.split(':')[0];
      if (!filePath.endsWith('.jsx')) continue;
      if (!blockedMap.has(filePath)) blockedMap.set(filePath, { classes: [], isPermanent: false });
      const entry = blockedMap.get(filePath);
      if (!entry.classes.includes(mimic.cssClass)) entry.classes.push(mimic.cssClass);
      if (mimic.migrationStatus === 'permanently-blocked') entry.isPermanent = true;
    }
  }

  const blockedUsages = [...blockedMap.entries()].map(([file, info]) => ({
    file,
    classes: info.classes,
    reason: info.isPermanent
      ? `React island + scroll-to-section <button> behavior. ${label} renders <a> only — cannot substitute. Permanently blocked unless the scroll logic is refactored.`
      : `React island — cannot import ${label}.astro. Blocked unless ${basename(file)} is converted to Astro or ${label} is ported to React.`,
  }));

  // ── Adoption status ──────────────────────────────────────────────────────
  const hasProductRaw = rawMimics.some(m => m.scope === 'product');
  let adoptionStatus;
  if (directImportFiles.length > 0 && !hasProductRaw) {
    adoptionStatus = 'adopted';
  } else if (directImportFiles.length > 0) {
    adoptionStatus = 'partially-adopted';
  } else if (rawMimics.length > 0) {
    adoptionStatus = 'raw-pattern-only';
  } else {
    adoptionStatus = 'not-used';
  }

  // ── Runtime instance estimate ────────────────────────────────────────────
  const runtimeOverride = RUNTIME_INSTANCE_OVERRIDES[id];
  const estimatedRuntimeInstances =
    runtimeOverride != null ? runtimeOverride : instanceDetails.length;

  return {
    id,
    metadataFile,
    adoptionStatus,
    directImportFiles,
    directSourceInstances: instanceDetails.length,
    directSourceInstanceDetail: instanceDetails,
    estimatedRuntimeInstances,
    variantsUsedDirectly: [...variantsDirectSet],
    variantsUsedViaRawCSS: [...variantsRawSet],
    variantsNotUsed,
    rawCssMimics: rawMimics,
    blockedUsages,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════════════════════════════════════════

function buildSummary(components) {
  const statusCounts = {
    adopted: 0,
    'partially-adopted': 0,
    'raw-pattern-only': 0,
    blocked: 0,
    'not-used': 0,
  };
  let totalSource = 0;
  let totalRuntime = 0;
  let productRaw = 0;
  let dsRaw = 0;

  for (const c of components) {
    statusCounts[c.adoptionStatus] = (statusCounts[c.adoptionStatus] ?? 0) + 1;
    totalSource += c.directSourceInstances;
    totalRuntime += c.estimatedRuntimeInstances;
    for (const m of c.rawCssMimics) {
      if (m.scope === 'product') productRaw += m.foundIn.length;
      else dsRaw += m.foundIn.length;
    }
  }

  return {
    adoptionStatusCounts: statusCounts,
    totalImportBasedInstances: {
      sourceInstances: totalSource,
      estimatedRuntimeInstances: totalRuntime,
      note: 'Runtime estimate from RUNTIME_INSTANCE_OVERRIDES config. Conservative (= source count) if override is null.',
    },
    totalRawMimicInstances: {
      productScope: {
        sourceOccurrences: productRaw,
        note: 'CSS class occurrences in product files (not DS pages).',
      },
      dsPagesScope: {
        sourceOccurrences: dsRaw,
        note: 'CSS class occurrences in /design-system/* pages.',
      },
    },
    migrationOpportunities: MIGRATION_OPPORTUNITIES,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const productFiles = collectScope(PRODUCT_IMPORT_SCOPE);
  const dsPageFiles  = collectScope(DS_PAGES_SCOPE);

  console.log(`analyze-system: ${productFiles.length} product files, ${dsPageFiles.length} DS page files`);

  const components = SYSTEM_COMPONENTS.map(comp =>
    analyzeComponent(comp, productFiles, dsPageFiles)
  );

  const summary = buildSummary(components);

  const output = {
    _meta: {
      generatedAt: today,
      methodology: 'Automated static analysis — import detection and CSS class attribute occurrence counting across src/. Component imports and JSX/Astro usages catalogued by file and line number. Runtime instance counts from RUNTIME_INSTANCE_OVERRIDES config (conservative: equals source count when null). Raw CSS mimic metadata (migrationStatus, notes, runtimeCount) is config-driven and requires human review.',
      scope: {
        included: PRODUCT_IMPORT_SCOPE,
        dsPagesRawMimicsOnly: DS_PAGES_SCOPE,
        excluded: [
          'src/pages/design-system/components.astro — imports 5 components for documentation demos, not product usage',
          'src/components/system/*.astro — component definition files themselves',
        ],
        note: 'DS pages included for raw CSS mimic detection only. Import-based adoption counts product scope only.',
      },
      approximateFields: [
        'estimatedRuntimeInstances — from RUNTIME_INSTANCE_OVERRIDES config; equals source instances when not overridden',
        'runtimeCount in rawCssMimics — from config (editorial)',
        'blockedUsages.reason — auto-generated from pattern type, not manually authored',
      ],
    },
    components,
    summary,
  };

  const outPath = join(ROOT, 'src/system/system.generated.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`analyze-system: wrote ${relative(ROOT, outPath)}`);

  for (const c of components) {
    const rawCount = c.rawCssMimics.length;
    const importMark = c.directSourceInstances > 0 ? `${c.directSourceInstances} imports` : 'no imports';
    const rawMark = rawCount > 0 ? `${rawCount} raw patterns` : 'no raw patterns';
    console.log(`  ${c.id.padEnd(12)} ${c.adoptionStatus.padEnd(20)} ${importMark}, ${rawMark}`);
  }
}

main();
