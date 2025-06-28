import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { X, UserPlus, Search, MoreVertical, Crown, Shield, User, Ban, Trash2, Edit, Copy, Send, Check, AlertTriangle, Users, Settings, Eye, EyeOff, Volume2, VolumeX, MessageSquare, MessageSquare as MessageSquareOff } from 'lucide-react';

const memberRoles = [
  { 
    id: 'owner', 
    name: 'Owner', 
    icon: Crown, 
    color: 'text-yellow-500',
    permissions: ['all'],
    description: 'Full control over the channel'
  },
  { 
    id: 'admin', 
    name: 'Admin', 
    icon: Shield, 
    color: 'text-red-500',
    permissions: ['manage_members', 'manage_messages', 'manage_settings', 'invite_members'],
    description: 'Can manage members and channel settings'
  },
  { 
    id: 'moderator', 
    name: 'Moderator', 
    icon: Shield, 
    color: 'text-blue-500',
    permissions: ['manage_messages', 'kick_members', 'mute_members'],
    description: 'Can moderate messages and members'
  },
  { 
    id: 'member', 
    name: 'Member', 
    icon: User, 
    color: 'text-gray-500',
    permissions: ['send_messages', 'react_messages'],
    description: 'Regular channel member'
  }
];

const permissions = [
  { id: 'send_messages', name: 'Send Messages', description: 'Can send messages in the channel' },
  { id: 'react_messages', name: 'React to Messages', description: 'Can add reactions to messages' },
  { id: 'manage_messages', name: 'Manage Messages', description: 'Can delete and pin messages' },
  { id: 'invite_members', name: 'Invite Members', description: 'Can invite new members to the channel' },
  { id: 'kick_members', name: 'Kick Members', description: 'Can remove members from the channel' },
  { id: 'mute_members', name: 'Mute Members', description: 'Can mute/unmute members' },
  { id: 'manage_members', name: 'Manage Members', description: 'Can change member roles and permissions' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Can modify channel settings' }
];

export default function ChannelMemberManager({ 
  channel, 
  isOpen, 
  onClose, 
  onUpdateMembers,
  currentUserRole = 'member'
}) {
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberMenu, setShowMemberMenu] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteLink, setInviteLink] = useState('');
  const [showBanConfirm, setShowBanConfirm] = useState(null);
  const menuRef = useRef(null);

  // Mock channel members - in real app this would come from props/API
  const [channelMembers, setChannelMembers] = useState([
    {
      id: 'user-1',
      username: 'Alex Chen',
      avatar: '👨‍💻',
      email: 'alex@example.com',
      role: 'owner',
      joinedAt: '2024-01-15T10:00:00Z',
      lastActive: new Date().toISOString(),
      status: 'online',
      permissions: ['all'],
      isMuted: false,
      isBanned: false
    },
    {
      id: 'user-2',
      username: 'Sarah Wilson',
      avatar: '👩‍🎨',
      email: 'sarah@example.com',
      role: 'admin',
      joinedAt: '2024-01-16T14:30:00Z',
      lastActive: new Date(Date.now() - 300000).toISOString(),
      status: 'online',
      permissions: ['manage_members', 'manage_messages', 'manage_settings', 'invite_members'],
      isMuted: false,
      isBanned: false
    },
    {
      id: 'user-3',
      username: 'Mike Johnson',
      avatar: '🧑‍🚀',
      email: 'mike@example.com',
      role: 'moderator',
      joinedAt: '2024-01-17T09:15:00Z',
      lastActive: new Date(Date.now() - 1800000).toISOString(),
      status: 'away',
      permissions: ['manage_messages', 'kick_members', 'mute_members'],
      isMuted: false,
      isBanned: false
    },
    {
      id: 'user-4',
      username: 'Emma Davis',
      avatar: '👩‍💼',
      email: 'emma@example.com',
      role: 'member',
      joinedAt: '2024-01-18T16:45:00Z',
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      status: 'offline',
      permissions: ['send_messages', 'react_messages'],
      isMuted: false,
      isBanned: false
    },
    {
      id: 'user-5',
      username: 'James Brown',
      avatar: '👨‍🔬',
      email: 'james@example.com',
      role: 'member',
      joinedAt: '2024-01-19T11:20:00Z',
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      status: 'offline',
      permissions: ['send_messages', 'react_messages'],
      isMuted: true,
      isBanned: false
    }
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMemberMenu(null);
      }
    };

    if (showMemberMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMemberMenu]);

  const filteredMembers = channelMembers.filter(member =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleInfo = (roleId) => {
    return memberRoles.find(role => role.id === roleId) || memberRoles[3];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastActive = (dateString) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const canManageMember = (targetMember) => {
    const currentRole = getRoleInfo(currentUserRole);
    const targetRole = getRoleInfo(targetMember.role);
    
    // Owner can manage everyone
    if (currentUserRole === 'owner') return true;
    
    // Can't manage yourself
    if (targetMember.id === 'current-user-id') return false;
    
    // Can't manage owner
    if (targetMember.role === 'owner') return false;
    
    // Admin can manage moderators and members
    if (currentUserRole === 'admin' && ['moderator', 'member'].includes(targetMember.role)) return true;
    
    // Moderator can manage members
    if (currentUserRole === 'moderator' && targetMember.role === 'member') return true;
    
    return false;
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to invite",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would send an API request
    toast({
      title: "Invitation Sent! 📧",
      description: `Invitation sent to ${inviteEmail} as ${getRoleInfo(inviteRole).name}`
    });

    setInviteEmail('');
    setInviteRole('member');
    setShowInviteModal(false);
  };

  const generateInviteLink = () => {
    const link = `https://securechat.app/invite/${channel?.id}/${Math.random().toString(36).substr(2, 9)}`;
    setInviteLink(link);
    
    navigator.clipboard.writeText(link);
    toast({
      title: "Invite Link Generated! 🔗",
      description: "Link copied to clipboard. Valid for 7 days."
    });
  };

  const handleChangeRole = (memberId, newRole) => {
    setChannelMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const roleInfo = getRoleInfo(newRole);
        return {
          ...member,
          role: newRole,
          permissions: roleInfo.permissions
        };
      }
      return member;
    }));

    const member = channelMembers.find(m => m.id === memberId);
    toast({
      title: "Role Updated! 👑",
      description: `${member?.username} is now a ${getRoleInfo(newRole).name}`
    });

    setShowRoleModal(false);
    setSelectedMember(null);
    setShowMemberMenu(null);
  };

  const handleToggleMute = (memberId) => {
    setChannelMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        return { ...member, isMuted: !member.isMuted };
      }
      return member;
    }));

    const member = channelMembers.find(m => m.id === memberId);
    toast({
      title: member?.isMuted ? "Member Unmuted" : "Member Muted",
      description: `${member?.username} has been ${member?.isMuted ? 'unmuted' : 'muted'}`
    });

    setShowMemberMenu(null);
  };

  const handleKickMember = (memberId) => {
    const member = channelMembers.find(m => m.id === memberId);
    setChannelMembers(prev => prev.filter(m => m.id !== memberId));
    
    toast({
      title: "Member Kicked! 👢",
      description: `${member?.username} has been removed from the channel`
    });

    setShowMemberMenu(null);
  };

  const handleBanMember = (memberId) => {
    const member = channelMembers.find(m => m.id === memberId);
    setChannelMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, isBanned: true, status: 'banned' };
      }
      return m;
    }));
    
    toast({
      title: "Member Banned! 🚫",
      description: `${member?.username} has been banned from the channel`
    });

    setShowBanConfirm(null);
    setShowMemberMenu(null);
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, count: channelMembers.length },
    { id: 'roles', label: 'Roles', icon: Crown, count: memberRoles.length },
    { id: 'permissions', label: 'Permissions', icon: Settings, count: permissions.length }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg">
              {channel?.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Member Management</h3>
              <p className="text-sm text-muted-foreground">#{channel?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowInviteModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Members List */}
                  <div className="space-y-2">
                    {filteredMembers.map((member) => {
                      const roleInfo = getRoleInfo(member.role);
                      const RoleIcon = roleInfo.icon;
                      
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                                {member.avatar}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                              {member.isMuted && (
                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <VolumeX className="w-2 h-2 text-white" />
                                </div>
                              )}
                              {member.isBanned && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                                  <Ban className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">{member.username}</h4>
                                <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />
                                <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color} bg-current/10`}>
                                  {roleInfo.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{member.email}</span>
                                <span>Joined {formatDate(member.joinedAt)}</span>
                                <span>Active {formatLastActive(member.lastActive)}</span>
                              </div>
                            </div>
                          </div>

                          {canManageMember(member) && (
                            <div className="relative" ref={menuRef}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>

                              {showMemberMenu === member.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-10 min-w-[160px]"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      setSelectedMember(member);
                                      setShowRoleModal(true);
                                    }}
                                  >
                                    <Crown className="w-3 h-3 mr-2" />
                                    Change Role
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleToggleMute(member.id)}
                                  >
                                    {member.isMuted ? (
                                      <>
                                        <Volume2 className="w-3 h-3 mr-2" />
                                        Unmute
                                      </>
                                    ) : (
                                      <>
                                        <VolumeX className="w-3 h-3 mr-2" />
                                        Mute
                                      </>
                                    )}
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-orange-500"
                                    onClick={() => handleKickMember(member.id)}
                                  >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Kick
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-destructive"
                                    onClick={() => setShowBanConfirm(member)}
                                  >
                                    <Ban className="w-3 h-3 mr-2" />
                                    Ban
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Roles Tab */}
              {activeTab === 'roles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Channel Roles</h4>
                    <Button variant="outline" size="sm">
                      <Crown className="w-4 h-4 mr-2" />
                      Create Role
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {memberRoles.map((role) => {
                      const Icon = role.icon;
                      const memberCount = channelMembers.filter(m => m.role === role.id).length;
                      
                      return (
                        <div key={role.id} className="p-4 bg-muted/30 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon className={`w-6 h-6 ${role.color}`} />
                              <div>
                                <h5 className="font-medium">{role.name}</h5>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{memberCount} members</div>
                              <div className="text-xs text-muted-foreground">
                                {role.permissions.length} permissions
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 4).map((perm) => (
                              <span key={perm} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {perm === 'all' ? 'All Permissions' : perm.replace('_', ' ')}
                              </span>
                            ))}
                            {role.permissions.length > 4 && (
                              <span className="text-xs text-muted-foreground">
                                +{role.permissions.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Channel Permissions</h4>
                  
                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{permission.name}</h5>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {memberRoles.filter(role => 
                              role.permissions.includes(permission.id) || role.permissions.includes('all')
                            ).length} roles
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Invite Members</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <Label htmlFor="inviteEmail">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="inviteRole">Role</Label>
                  <select
                    id="inviteRole"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {memberRoles.filter(role => role.id !== 'owner').map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button onClick={generateInviteLink} variant="outline" className="w-full mb-3">
                    <Copy className="w-4 h-4 mr-2" />
                    Generate Invite Link
                  </Button>
                  
                  {inviteLink && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Invite Link (expires in 7 days)</p>
                      <code className="text-xs break-all">{inviteLink}</code>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleInviteMember}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Change Modal */}
      <AnimatePresence>
        {showRoleModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Change Role</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowRoleModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedMember.username}</h4>
                    <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select New Role</Label>
                  {memberRoles.filter(role => role.id !== 'owner').map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleChangeRole(selectedMember.id, role.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedMember.role === role.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${role.color}`} />
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          </div>
                          {selectedMember.role === role.id && (
                            <Check className="w-4 h-4 text-primary ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ban Confirmation Modal */}
      <AnimatePresence>
        {showBanConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg w-full max-w-md"
            >
              <div className="p-4">
                <div className="text-center mb-4">
                  <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Ban Member?</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to ban <strong>{showBanConfirm.username}</strong>? 
                    They will be removed from the channel and won't be able to rejoin.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBanConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleBanMember(showBanConfirm.id)}
                  >
                    Ban Member
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}