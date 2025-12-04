#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';

// --- Configuration ---
// Assuming this script is located at 'cli/setup.js'
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);

// Source directory is two levels up from the script location, then into 'template'
const SOURCE_DIR = path.resolve(SCRIPT_DIR, '..', 'template');

// Destination is the user's current working directory (project root)
const DEST_DIR = process.cwd();
// ---------------------

/**
 * Recursively copies a directory's contents from source to destination.
 * @param {string} src The source directory path.
 * @param {string} dest The destination directory path.
 */
async function copyDir(src, dest) {
    try {
        // 1. Create the destination directory if it doesn't exist
        await fs.mkdir(dest, { recursive: true });

        // 2. Read the contents of the source directory
        const entries = await fs.readdir(src, { withFileTypes: true });

        // 3. Process each entry
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                // If it's a directory, recurse
                await copyDir(srcPath, destPath);
            } else if (entry.isFile()) {
                // If it's a file, copy it.
                // COPYFILE_EXCL ensures we do not overwrite existing files,
                // which is often desired for config templates.
                await fs.copyFile(srcPath, destPath, constants.COPYFILE_EXCL);
                console.log(`- Created ${path.relative(DEST_DIR, destPath)}`);
            }
            // Ignore symbolic links and other types
        }
    } catch (err) {
        // If a file already exists due to COPYFILE_EXCL, skip it and continue.
        // Otherwise, throw the error.
        if (err.code === 'EEXIST') {
             // Inform the user that a file was skipped
             console.log(`- Skipped ${path.relative(DEST_DIR, dest)} (File already exists)`);
        } else {
            throw err;
        }
    }
}

async function main() {
    console.log(`🚀 Starting TSConfig setup in: ${DEST_DIR}`);
    console.log(`Source template: ${SOURCE_DIR}`);

    try {
        await copyDir(SOURCE_DIR, DEST_DIR);
        console.log('\n✅ **Setup Complete!** TSConfig template files have been copied.');
        console.log('   Note: Existing files were skipped to prevent accidental overwrites.');
    } catch (error) {
        console.error('\n❌ **Setup Failed!**');
        console.error('An unexpected error occurred during file copying:', error.message);
        process.exit(1);
    }
}

main();