import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper to get store state
async function getStoreState(page: Page, storeName: string = '__SETTINGS_STORE__') {
    return await page.evaluate((name) => {
        const store = (window as any)[name];
        if (!store) return null;
        return store.getState();
    }, storeName);
}

// Helper to wait for a specific state in a store
async function waitForStoreState(page: Page, storeName: string, checkFn: (state: any) => boolean, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const state = await getStoreState(page, storeName);
        if (checkFn(state)) return true;
        await page.waitForTimeout(100);
    }
    return false;
}

const sections = [
    'account',
    'privacy',
    'personalization',
    'notifications',
    'language',
    'devices',
    'subscription',
    'data',
    'accessibility',
];

interface TestResult {
    section: string;
    setting: string;
    status: 'PASS' | 'FAIL';
    duration: number;
    error?: string;
    observation?: string;
}

const testResults: TestResult[] = [];

test.describe('Settings Test Robot v3', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/settings');
        // Wait for stores to be available
        await page.waitForFunction(() =>
            (window as any).__SETTINGS_STORE__ !== undefined &&
            (window as any).__THEME_STORE__ !== undefined
        );
    });

    test('Robot: Comprehensive Settings Audit', async ({ page }) => {
        test.setTimeout(180000); // 3 minutes

        for (const section of sections) {
            const sectionStartTime = Date.now();
            console.log(`[Robot] Auditing section: ${section}`);

            // Navigation
            try {
                if (section !== 'account') {
                    const navBtn = page.locator(`button[data-section="${section}"]`);
                    await expect(navBtn).toBeVisible({ timeout: 10000 });
                    await navBtn.click();
                    await page.waitForTimeout(500);
                }
            } catch (err: any) {
                console.error(`Failed to navigate to section ${section}: ${err.message}`);
                testResults.push({
                    section,
                    setting: 'Navigation',
                    status: 'FAIL',
                    duration: Date.now() - sectionStartTime,
                    error: `Navigation failed: ${err.message}`,
                });
                continue;
            }

            // 1. Account Info
            if (section === 'account') {
                const state = await getStoreState(page);
                if (state?.userProfile) {
                    testResults.push({
                        section,
                        setting: 'Profile Data Presence',
                        status: 'PASS',
                        duration: Date.now() - sectionStartTime,
                        observation: `User: ${state.userProfile.name}`,
                    });
                }
            }

            // 2. Privacy
            if (section === 'privacy') {
                const privacyToggles = [
                    { testId: 'toggle-perfil-público', key: 'showProfile' },
                    { testId: 'toggle-compartilhar-progresso', key: 'shareProgress' },
                ];

                for (const t of privacyToggles) {
                    const toggleContainer = page.getByTestId(t.testId);
                    const toggle = toggleContainer.locator('button');
                    await expect(toggle).toBeVisible();

                    const initialState = (await getStoreState(page)).privacy[t.key];
                    await toggle.click();

                    const success = await waitForStoreState(page, '__SETTINGS_STORE__',
                        (state) => state.privacy[t.key] !== initialState
                    );

                    expect(success).toBe(true);
                    testResults.push({ section, setting: t.testId, status: 'PASS', duration: Date.now() - sectionStartTime });
                }
            }

            // 3. Personalization (Theme)
            if (section === 'personalization') {
                // Theme Toggle (Pistachio)
                await page.click('button:has-text("Pistachio")');
                const successPistachio = await waitForStoreState(page, '__THEME_STORE__', state => state.theme === 'pistachio');
                expect(successPistachio).toBe(true);
                testResults.push({ section, setting: 'Theme Switch (Pistachio)', status: 'PASS', duration: Date.now() - sectionStartTime });

                await page.click('button:has-text("Cyber Luxe")');
                const successLuxe = await waitForStoreState(page, '__THEME_STORE__', state => state.theme === 'cyber-luxe');
                expect(successLuxe).toBe(true);

                // Compact Mode
                const compactToggle = page.getByTestId('toggle-modo-compacto').locator('button');
                const initialCompact = (await getStoreState(page)).compactMode;
                await compactToggle.click();
                const successCompact = await waitForStoreState(page, '__SETTINGS_STORE__', state => state.compactMode !== initialCompact);
                expect(successCompact).toBe(true);
                testResults.push({ section, setting: 'Compact Mode Toggle', status: 'PASS', duration: Date.now() - sectionStartTime });
            }

            // 4. Accessibility
            if (section === 'accessibility') {
                const hcToggle = page.getByTestId('toggle-alto-contraste').locator('button');
                await hcToggle.click();
                const successHC = await waitForStoreState(page, '__SETTINGS_STORE__', state => state.accessibility.highContrast === true);
                expect(successHC).toBe(true);
                expect(await page.evaluate(() => document.documentElement.classList.contains('high-contrast'))).toBe(true);
                testResults.push({ section, setting: 'High Contrast Mode', status: 'PASS', duration: Date.now() - sectionStartTime });
            }

            // 5. Data Section
            if (section === 'data') {
                const backupBtn = page.locator('button:has-text("Fazer Backup")');
                if (await backupBtn.isVisible()) {
                    await backupBtn.click();
                    await expect(page.locator('text=Backup realizado com sucesso!')).toBeVisible({ timeout: 10000 });
                    testResults.push({ section, setting: 'Cloud Backup', status: 'PASS', duration: Date.now() - sectionStartTime });
                }
            }

            await page.screenshot({ path: `tests/screenshots/${section}.png`, fullPage: true });
        }

        // Export results
        const resultsDir = path.join(process.cwd(), 'tests');
        fs.writeFileSync(path.join(resultsDir, 'results.json'), JSON.stringify(testResults, null, 2));
    });
});
