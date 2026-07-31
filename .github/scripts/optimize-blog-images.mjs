import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Converts oversized CMS-uploaded images to web-friendly WebP and updates
// markdown references. Runs in CI before the blog build; idempotent.

const IMAGE_DIR = process.argv[2] || 'assets/Photos/blog';
const POSTS_DIR = process.argv[3] || 'blog/_posts';
const SIZE_THRESHOLD = 150 * 1024; // leave small images alone
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 82;

const candidates = fs.readdirSync(IMAGE_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .filter(f => fs.statSync(path.join(IMAGE_DIR, f)).size > SIZE_THRESHOLD);

if (candidates.length === 0) {
    console.log('No oversized images to optimize.');
    process.exit(0);
}

const renames = [];
for (const file of candidates) {
    const src = path.join(IMAGE_DIR, file);
    const webpName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const out = path.join(IMAGE_DIR, webpName);
    const before = fs.statSync(src).size;
    try {
        await sharp(src)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(out);
        fs.unlinkSync(src);
        renames.push([file, webpName]);
        console.log(`${file}: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(fs.statSync(out).size / 1024).toFixed(0)}KB (${webpName})`);
    } catch (err) {
        // Leave the original in place if conversion fails; the post still works.
        console.error(`SKIP ${file}: ${err.message}`);
        if (fs.existsSync(out)) fs.unlinkSync(out);
    }
}

// Update markdown references (featured_image, download_file, inline body images)
for (const mdFile of fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))) {
    const mdPath = path.join(POSTS_DIR, mdFile);
    let content = fs.readFileSync(mdPath, 'utf8');
    let changed = false;
    for (const [oldName, newName] of renames) {
        if (content.includes(oldName)) {
            content = content.split(oldName).join(newName);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(mdPath, content);
        console.log(`Updated references in ${mdFile}`);
    }
}
console.log(`Optimized ${renames.length} image(s).`);
