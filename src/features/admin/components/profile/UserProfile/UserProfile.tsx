import { User } from '@/shared/types/entities/user';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Mail, Shield, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  // Debug: Log user data
  console.log('UserProfile - user data:', user);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>No user data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>Your account information and details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-base font-medium">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email || 'Name not available'}
            </p>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}