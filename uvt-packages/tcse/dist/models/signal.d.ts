export type TCSESignalCategory = 'ad' | 'cookie_banner' | 'chat_widget' | 'newsletter_popup' | 'survey_popup' | 'consent_manager' | 'recommendation_widget' | 'social_embed' | 'analytics_overlay' | 'popup_modal' | 'analytics_pixel' | 'third_party_iframe' | 'unknown';
export interface TCSESignalBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface TCSESignal {
    id: string;
    category: TCSESignalCategory;
    type?: string;
    selector: string;
    vendor?: string;
    source?: string;
    confidenceScore: number;
    confidence?: number;
    reason?: string;
    suggestedAction?: 'HIDE' | 'REMOVE' | 'MASK';
    boundingBox?: TCSESignalBoundingBox;
    attributes?: Record<string, string>;
    metadata?: Record<string, unknown>;
    timestamp: number;
}
export declare function createTCSESignal(params: Omit<TCSESignal, 'id' | 'timestamp'> & {
    id?: string;
    timestamp?: number;
}): TCSESignal;
//# sourceMappingURL=signal.d.ts.map