type GTagEvent = {
    action: string;
    category: string;
    label?: string;
    value?: number;
};

export type AnalyticsEvent =
    | { action: 'submit_form'; category: 'Contact'; label: 'success' | 'error' }
    | { action: 'click_social'; category: 'Social'; label: string }
    | { action: 'view_project'; category: 'Portfolio'; label: string }
    | { action: 'click_case_study'; category: 'Portfolio'; label: string }
    | { action: 'click_live_demo'; category: 'Portfolio'; label: string }
    | { action: 'view_project_gallery'; category: 'Portfolio'; label: string }
    | { action: 'schedule_call'; category: 'Contact'; label?: string }
    | { action: 'click_contra'; category: 'Contact'; label?: string }
    | { action: 'open_faq'; category: 'Engagement'; label?: string };


export const AnalyticsService = {
    GA_MEASUREMENT_ID: 'G-ZVFENY0XPB',

    isEnabled: () => process.env.NODE_ENV === 'production',

    track: ({ action, category, label, value }: GTagEvent) => {
        if (!AnalyticsService.isEnabled()) {
            // eslint-disable-next-line no-console
            console.log(`[Analytics - Dev] Event Skipped: ${action}`, { category, label, value });
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).gtag) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        }
    },

    trackFormSubmission: (success: boolean) => {
        AnalyticsService.track({
            action: 'submit_form',
            category: 'Contact',
            label: success ? 'success' : 'error',
        });
    },

    trackSocialClick: (platform: string) => {
        AnalyticsService.track({
            action: 'click_social',
            category: 'Social',
            label: platform,
        });
    },

    trackProjectInteraction: (action: 'view_project' | 'click_live_demo' | 'view_project_gallery', projectTitle: string) => {
        AnalyticsService.track({
            action,
            category: 'Portfolio',
            label: projectTitle,
        });
    },

    trackCallScheduled: () => {
        AnalyticsService.track({
            action: 'schedule_call',
            category: 'Contact',
        });
    },

    trackContraClick: () => {
        AnalyticsService.track({
            action: 'click_contra',
            category: 'Contact',
        });
    },

    trackFAQOpen: (source: 'desktop' | 'mobile') => {
        AnalyticsService.track({
            action: 'open_faq',
            category: 'Engagement',
            label: source,
        });
    },

    trackPageView: (url: string) => {
        if (!AnalyticsService.isEnabled()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).gtag) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).gtag('config', AnalyticsService.GA_MEASUREMENT_ID, {
                page_path: url,
            });
        }
    },
};
