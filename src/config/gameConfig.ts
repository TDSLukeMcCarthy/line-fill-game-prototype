export const gameFeatures = {
  portalsEnabled: true  // Always show portal UI, but functionality controlled by user preference
};

export interface PortalConfig {
  enabled: boolean;
  maxPortals: number;
  allowSelfPortals: boolean;
}

export const defaultPortalConfig: PortalConfig = {
  enabled: false,        // Default to off
  maxPortals: 3,
  allowSelfPortals: false
};

// User preference for portals (can be toggled in-game)
export interface UserPreferences {
  portalsEnabled: boolean;
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  portalsEnabled: false
};
