'use client'

import { authService } from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { browserConsole } from '@/shared/utils/runtimeSafety';
import { User } from '@/shared/types/entities/user';
import { AlertTriangle, AtSign, CheckCircle, Eye, EyeOff, KeyRound, Loader2, Mail, Shield, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserProfileProps {
  user: User | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();
  const { logout } = useAuth();

  // ── Delete account state ──────────────────────────────────────────────────
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Change password state ─────────────────────────────────────────────────
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  if (!user) {
    return (
      <Card className="border-0">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  const resetPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setChangePasswordError(null);
    setChangePasswordSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setChangePasswordError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePasswordError('New passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      setChangePasswordError(
        'Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number.'
      );
      return;
    }

    setIsChangingPassword(true);
    setChangePasswordError(null);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setChangePasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      
      // After 2 seconds, logout and redirect to login page
      setTimeout(async () => {
        await logout();
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; title?: string }; status?: number }; message?: string };
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.message ||
        'Failed to change password. Please check your current password and try again.';
      setChangePasswordError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await authService.deleteAccount();
      // Close dialog and redirect to login
      setIsDeleteDialogOpen(false);
      // Redirect to login page after successful deletion
      router.push('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { title?: string }; status?: number }; message?: string };
      browserConsole.error('Failed to delete account:', error);
      if (err.response?.status === 403) {
        setDeleteError('You are not authorized to delete your account. Contact an administrator.');
      } else if (err.response?.status === 401) {
        setDeleteError('Your session has expired. Please log in again.');
      } else {
        setDeleteError(err.response?.data?.title || 'Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user is SuperAdmin (case-insensitive)
  // Handle cases where roles might be undefined or not an array
  const isSuperAdmin = Array.isArray(user.roles) && 
    user.roles.some(role => role.toLowerCase() === 'superadmin');

  const handleConfirmDelete = () => {
    // If user is a SuperAdmin, show error since they cannot delete their own account
    if (isSuperAdmin) {
      setDeleteError('SuperAdmin accounts cannot be deleted. Contact another administrator.');
      setIsDeleteDialogOpen(true);
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="border-0">
        <CardContent className="p-6 space-y-6">
          {/* Username Section */}
          {user.username && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{user.username}</p>
              </div>
            </div>
          )}

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-base">{user.email}</p>
              {user.emailConfirmed ? (
                <Badge variant="default" className="ml-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Roles Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Roles</label>
            <div className="flex items-center gap-2 flex-wrap">
              <Shield className="h-4 w-4 text-muted-foreground" />
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Account Status</span>
              <Badge variant={user.emailConfirmed ? "default" : "secondary"}>
                {user.emailConfirmed ? "Active" : "Pending Verification"}
              </Badge>
            </div>
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Update your account password.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetPasswordForm();
                  setIsChangePasswordOpen(true);
                }}
                className="whitespace-nowrap"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>

          {/* Danger Zone - Delete Account */}
          <div className="pt-4 border-t border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isSuperAdmin}
                className="whitespace-nowrap"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={(open) => {
        if (!open) resetPasswordForm();
        setIsChangePasswordOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-500" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

           {changePasswordSuccess ? (
             <div className="space-y-4">
               <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-center gap-3">
                 <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                 <p className="text-sm text-green-700 dark:text-green-300">
                   Your password has been changed successfully.
                 </p>
               </div>
               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex items-start gap-3">
                 <div className="text-sm text-blue-700 dark:text-blue-300">
                   <p className="font-medium mb-1">Security Notice</p>
                   <p>For security purposes, you will be logged out and redirected to the login page. Please log in with your new password.</p>
                 </div>
               </div>
               <DialogFooter>
                 <Button onClick={() => { resetPasswordForm(); setIsChangePasswordOpen(false); }} disabled>
                   Close
                 </Button>
               </DialogFooter>
             </div>
           ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {changePasswordError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{changePasswordError}</p>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    disabled={isChangingPassword}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    disabled={isChangingPassword}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label htmlFor="confirmNewPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    disabled={isChangingPassword}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-1">🔒 Password Requirements</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>At least one uppercase letter (A–Z)</li>
                  <li>At least one lowercase letter (a–z)</li>
                  <li>At least one number (0–9)</li>
                </ul>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { resetPasswordForm(); setIsChangePasswordOpen(false); }}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
              All your data, including submitted deals and preferences, will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete My Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
