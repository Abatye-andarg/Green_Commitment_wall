import { Router } from 'express';
import { authenticate, requireOrgAdmin, requireOrgMember } from '../middleware/auth';
import {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  listOrganizations,
  addMember,
  removeMember,
  toggleAdmin,
  getMembers,
  getOrganizationDashboard,
  getOrganizationChallenges,
} from '../controllers/organization.controller';

const router = Router();

// Organization CRUD
router.post('/', authenticate, createOrganization);
router.get('/', listOrganizations);
router.get('/:id', getOrganization);
router.patch('/:id', authenticate, requireOrgAdmin(), updateOrganization);
router.delete('/:id', authenticate, requireOrgAdmin(), deleteOrganization);

// Member management
router.get('/:id/members', authenticate, requireOrgMember(), getMembers);
router.post('/:id/members', authenticate, requireOrgAdmin(), addMember);
router.delete('/:id/members/:userId', authenticate, requireOrgAdmin(), removeMember);
router.patch('/:id/members/:userId/admin', authenticate, requireOrgAdmin(), toggleAdmin);

// Analytics & Dashboard
router.get('/:id/dashboard', authenticate, requireOrgMember(), getOrganizationDashboard);
router.get('/:id/challenges', authenticate, requireOrgMember(), getOrganizationChallenges);

export default router;
