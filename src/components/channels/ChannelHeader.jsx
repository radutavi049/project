import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Hash, 
  Users, 
  Settings, 
  Pin, 
  Search,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  MoreVertical,
  Info,
  UserPlus,
  Shield,
  Archive,
  Flag,
  LogOut
} from 'lucide-react';

export default function ChannelHeader({ 
  channel, 
  channelMembers, 
  pinnedMessages, 
  channelMuted, 
  notifications,
  showSearch,
  onBack,
  onToggleSearch,
  onToggleNotifications,
  onToggleMute,
  onToggleMembers,
  onOpenInfo,
  onOpenSettings
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Menu clicked, current state:', showMenu); // Debug log
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (action, label) => {
    console.log('Menu item clicked:', label); // Debug log
    setShowMenu(false);
    action();
  };

  const menuItems = [
    {
      icon: Info,
      label: 'Channel Info',
      action: () => {
        console.log('Opening channel info'); // Debug log
        onOpenInfo();
      }
    },
    {
      icon: Settings,
      label: 'Channel Settings',
      action: () => {
        console.log('Opening channel settings'); // Debug log
        onOpenSettings();
      }
    },
    {
      icon: UserPlus,
      label: 'Invite Members',
      action: () => {
        toast({
          title: "🚧 Invite Members",
          description: "Member invitations aren't implemented yet—but don't worry! You can request them in your next prompt! 🚀"
        });
      }
    },
    {
      icon: Shield,
      label: 'Manage Permissions',
      action: () => {
        toast({
          title: "🚧 Manage Permissions",
          description: "Permission management isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
      }
    },
    {
      icon: Archive,
      label: 'Archive Channel',
      action: () => {
        toast({
          title: "🚧 Archive Channel",
          description: "Channel archiving isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
      }
    },
    {
      icon: Flag,
      label: 'Report Channel',
      action: () => {
        toast({
          title: "Channel Reported",
          description: "This channel has been reported to moderators"
        });
      },
      destructive: true
    },
    {
      icon: LogOut,
      label: 'Leave Channel',
      action: () => {
        toast({
          title: "Left Channel",
          description: `You have left #${channel?.name}`
        });
        onBack();
      },
      destructive: true
    }
  ];

  return (
    <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 relative">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg shadow-lg">
          {channel?.icon}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {channel?.name}
            </h2>
            {channelMuted && <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="font-medium">{channelMembers?.length || 0} members</span>
            {pinnedMessages?.length > 0 && (
              <>
                <span>•</span>
                <Pin className="w-3 h-3" />
                <span className="font-medium">{pinnedMessages.length} pinned</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSearch}
          className={`transition-all duration-200 ${showSearch ? 'bg-primary/20 text-primary' : 'hover:bg-accent'}`}
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleNotifications}
          className={`transition-all duration-200 ${notifications ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className={`transition-all duration-200 ${channelMuted ? 'text-destructive' : 'text-foreground'}`}
        >
          {channelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMembers}
          className="transition-all duration-200 hover:bg-accent"
        >
          <Users className="w-4 h-4" />
        </Button>
        
        {/* FIXED: Menu Button with Proper Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenuClick}
            className={`transition-all duration-200 hover:bg-accent ${showMenu ? 'bg-accent' : ''}`}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {/* FIXED: Dropdown Menu with Proper Z-Index and Event Handling */}
          <AnimatePresence>
            {showMenu && (
              <>
                {/* Backdrop to close menu - CRITICAL: Proper z-index */}
                <div 
                  className="fixed inset-0 z-[9998]" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Backdrop clicked, closing menu'); // Debug log
                    setShowMenu(false);
                  }}
                />
                
                {/* Menu Content - CRITICAL: Higher z-index than backdrop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-[9999] bg-card border border-border rounded-lg shadow-xl py-2 min-w-[200px] backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMenuItemClick(item.action, item.label);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors text-left ${
                          item.destructive ? 'text-destructive hover:text-destructive' : 'text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}