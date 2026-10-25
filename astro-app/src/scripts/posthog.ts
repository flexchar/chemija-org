import type { PostHog } from 'posthog-js';

const CONSENT = 'chemija_analytics';
const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.PUBLIC_POSTHOG_HOST;
let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

function consent(): string | undefined {
    return document.cookie.split('; ').find((part) => part.startsWith(`${CONSENT}=`))?.split('=')[1];
}

function setConsent(value: '1' | '0'): void {
    const domain = location.hostname === 'chemija.org' || location.hostname.endsWith('.chemija.org') ? '; Domain=.chemija.org' : '';
    document.cookie = `${CONSENT}=${value}; Path=/; Max-Age=15552000; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
    if (value === '0') document.cookie = `chemija_source=; Path=/; Max-Age=0; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
}

function cleanUrl(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:' ? `${url.origin}${url.pathname}` : undefined;
    } catch { return undefined; }
}

async function analytics(): Promise<PostHog | null> {
    if (consent() !== '1' || !token || host !== 'https://eu.i.posthog.com' || !import.meta.env.PROD || !['chemija.org', 'www.chemija.org'].includes(location.hostname)) return null;
    if (client) return client;
    if (loading) return loading;
    loading = import('posthog-js').then(({ default: posthog }) => {
        if (consent() !== '1') return null;
        posthog.init(token, {
            api_host: host,
            defaults: '2026-08-30',
            autocapture: false,
            capture_pageview: false,
            capture_pageleave: false,
            disable_session_recording: true,
            advanced_disable_flags: true,
            cross_subdomain_cookie: true,
            before_send(event) {
                if (!event) return event;
                const props = event.properties ?? {};
                const protocol: Record<string, string | number> = {};
                for (const key of ['distinct_id', '$device_id', '$user_id', '$session_id', '$insert_id', '$time', '$lib', '$lib_version']) {
                    const value = props[key];
                    if (typeof value === 'string' && /^[a-zA-Z0-9._:-]{1,128}$/.test(value)) protocol[key] = value;
                    if (typeof value === 'number' && Number.isFinite(value)) protocol[key] = value;
                }
                event.properties = {
                    ...protocol,
                    ...(props.token === token ? { token } : {}),
                    ...(typeof props.source === 'string' && ['nav', 'home', 'exams', 'direct'].includes(props.source) ? { source: props.source } : {}),
                    ...(cleanUrl(props.$current_url) ? { $current_url: cleanUrl(props.$current_url) } : {}),
                    $process_person_profile: false,
                };
                return event;
            },
        });
        client = posthog;
        return posthog;
    }).catch(() => null).finally(() => { loading = null; });
    return loading;
}

function displayConsent(): void {
    const panel = document.getElementById('chemija-analytics-consent');
    if (panel) panel.hidden = consent() !== undefined;
}

async function pageview(): Promise<void> {
    const sdk = await analytics();
    if (sdk && consent() === '1') sdk.capture('$pageview', { $current_url: `${location.origin}${location.pathname}` });
}

document.addEventListener('astro:page-load', () => {
    displayConsent();
    void pageview();
    if (consent() !== undefined) void fetch('https://praktika.chemija.org/api/analytics/consent', { method: 'POST', credentials: 'include' }).catch(() => {});
});

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-analytics-choice], [data-analytics-settings], a[data-analytics-source]') : null;
    if (!target) return;
    if (target.dataset.analyticsSettings !== undefined) {
        const panel = document.getElementById('chemija-analytics-consent');
        if (panel) panel.hidden = false;
    } else if (target.dataset.analyticsChoice === 'yes') {
        setConsent('1');
        client?.opt_in_capturing({ captureEventName: false });
        displayConsent();
        void pageview();
        void fetch('https://praktika.chemija.org/api/analytics/consent', { method: 'POST', credentials: 'include' }).catch(() => {});
    } else if (target.dataset.analyticsChoice === 'no') {
        setConsent('0');
        client?.reset();
        client?.opt_out_capturing();
        displayConsent();
        void fetch('https://praktika.chemija.org/api/analytics/consent', { method: 'POST', credentials: 'include' }).catch(() => {});
    } else if (target.dataset.analyticsSource && consent() === '1') {
        void analytics().then((sdk) => sdk?.capture('practice_link_clicked', { source: target.dataset.analyticsSource }));
    }
});
