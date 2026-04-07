/**
 * Brain Service Layer
 * Helper functions and utilities for working with brain configurations
 */

import { getBrainConfig, getSystemPrompt } from '../config/brainConfig';
import { getShopInfo } from '../config/shopData';

/**
 * Get complete system prompt with shop context
 * Used by frontend and backend to construct the final prompt for Claude
 */
export function buildSystemPrompt(brainType, shopId) {
  const systemPrompt = getSystemPrompt(brainType);
  const shopInfo = getShopInfo(shopId);

  return `${systemPrompt}\n\nYou're currently supporting the ${shopInfo.name} location (${shopInfo.address}).`;
}

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
  buildSystemPrompt,
  getBrainMetadata,
  isValidBrainType,
  getDefaultBrainForRole,
  canUserAccessBrain
};
