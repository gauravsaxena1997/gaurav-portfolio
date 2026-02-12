type GTagEvent = {
    action: string;
    category: string;
    label?: string;
    value?: number;
};

// Define custom event types for type safety
export type AnalyticsEvent =
    | { action: 'submit_form'; category: 'Contact'; label: 'success' | 'error' }
    | { action: 'click_social'; category: 'Social'; label: string }
    | { action: 'view_project'; category: 'Portfolio'; label: string } // Label = Project Title
    | { action: 'click_case_study'; category: 'Portfolio'; label: string }
    | { action: 'click_live_demo'; category: 'Portfolio'; label: string }
    | { action: 'schedule_call'; category: 'Contact'; label?: string };


export const AnalyticsService = {
    // Measurement ID
    GA_MEASUREMENT_ID: 'G-ZVFENY0XPB',

    // Check if analytics should be enabled (Production only)
    isEnabled: () => {
        return process.env.NODE_ENV === 'production';
    },

    // Generic track event
    track: ({ action, category, label, value }: GTagEvent) => {
        if (!AnalyticsService.isEnabled()) {
            console.log(`[Analytics - Dev] Envent Skipped: ${action}`, { category, label, value });
            return;
        }

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        }
    },

    // Specific Actions
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

    trackProjectInteraction: (action: 'view_project' | 'click_live_demo', projectTitle: string) => {
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
    }
};
