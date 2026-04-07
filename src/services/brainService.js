/**
 * Brain Service Layer
 * Helper functions and utilities for working with brain configurations
 */

import { getBrainConfig } from '../config/brainConfig';

/**
 * Get brain metadata for UI display
 */
export function getBrainMetadata(brainType) {
  const config = getBrainConfig(brainType);
  return {
    name: config.name,
    subtitle: config.subtitle,
    color: config.color,
    accentColor: config.accentColor
  };
}

/**
 * Validate brain type
 */
export function isValidBrainType(brainType) {
  return ['staff', 'owner', 'client'].includes(brainType);
}

/**
 * Get default brain for new users
 */
export function getDefaultBrainForRole(role) {
  const roleToDefault = {
    staff: 'staff',
    owner: 'owner',
    client: 'client'
  };
  return roleToDefault[role] || 'staff';
}

/**
 * Check if user can access a brain
 */
export function canUserAccessBrain(userRole, brainType) {
  if (!isValidBrainType(brainType)) return false;

  const accessMap = {
    staff: ['staff'],
    owner: ['staff', 'owner'],
    client: ['client']
  };

  return accessMap[userRole]?.includes(brainType) || false;
}

export default {
  getBrainMetadata,
  isValidBrainType,
  getDefaultBrainForRole,
  canUserAccessBrain
};
