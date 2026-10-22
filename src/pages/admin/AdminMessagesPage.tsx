import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { contactService } from '../../services/contactService';
import { ContactMessage, ContactStatus } from '../../types/contact';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Form';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '../../components/ui/Loading';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Reply,
  Eye,
  Check,
  RefreshCw,
  MessageSquare,
  Sparkles,
  X,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const toast = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<ContactStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected message for detail modal
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');

  // Delete confirmation
  const [deleteCandidate, setDeleteCandidate] = useState<ContactMessage | null>(null);

  const loadData = async () => {
    try {
      const data = await contactService.getMessages({
        status: selectedStatus,
        search: searchTerm
      });
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load contact messages.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, searchTerm]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleUpdateStatus = async (id: string, newStatus: ContactStatus, notes?: string) => {
    try {
      await contactService.updateStatus(id, newStatus, notes);
      toast.success(`Message marked as ${newStatus}.`);
      loadData();
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({
          ...activeMessage,
          status: newStatus,
          adminNotes: notes !== undefined ? notes : activeMessage.adminNotes
        });
      }
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await contactService.deleteMessage(deleteCandidate.id);
      toast.success('Message permanently deleted.');
      if (activeMessage?.id === deleteCandidate.id) {
        setActiveMessage(null);
      }
      setDeleteCandidate(null);
      loadData();
    } catch {
      toast.error('Failed to delete message.');
    }
  };

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === 'unread').length,
    read: messages.filter((m) => m.status === 'read').length,
    resolved: messages.filter((m) => m.status === 'resolved').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-cinzel">
              Contact & Support Messages
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Inquiries, feedback, and template requests submitted via the public contact form.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">All Messages</span>
            <div className="text-2xl font-extrabold text-stone-900 mt-1">{stats.total}</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">Unread</span>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">{stats.unread}</div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-xs text-blue-800 font-bold uppercase tracking-wider">Read</span>
            <div className="text-2xl font-extrabold text-blue-900 mt-1">{stats.read}</div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Resolved</span>
            <div className="text-2xl font-extrabold text-emerald-900 mt-1">{stats.resolved}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {(['all', 'unread', 'read', 'resolved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all ${
                  selectedStatus === st
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {st}
                {st === 'unread' && stats.unread > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px]">
                    {stats.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, email, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-stone-200">
            <Loading text="Loading contact inquiries..." size="md" />
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <EmptyState
              title="No Messages Found"
              description={
                searchTerm
                  ? `No messages match your search term "${searchTerm}".`
                  : `There are currently no messages with status "${selectedStatus}".`
              }
              actionText={searchTerm ? 'Clear Search' : undefined}
              onAction={searchTerm ? () => setSearchTerm('') : undefined}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={msg.id}
                  className={`border rounded-2xl p-4 sm:p-5 bg-white transition-all hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    msg.status === 'unread'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-stone-200'
                  }`}
                >
                  {/* Left Column: Sender Info & Subject */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : msg.status === 'read'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {msg.status}
                      </span>
                      <span className="font-bold text-sm text-stone-900 truncate">
                        {msg.subject}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="font-semibold text-stone-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {msg.name}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-600">{msg.email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {formattedDate}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 pt-1 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Right Column: Quick Status Toggle & Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                    {/* View Details */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setActiveMessage(msg);
                        setAdminNotesInput(msg.adminNotes || '');
                        if (msg.status === 'unread') {
                          handleUpdateStatus(msg.id, 'read');
                        }
                      }}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>

                    {/* Mark status quick dropdown / buttons */}
                    {msg.status !== 'resolved' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleUpdateStatus(msg.id, 'resolved')}
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        Mark Resolved
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-stone-600 hover:bg-stone-100"
                        onClick={() => handleUpdateStatus(msg.id, 'unread')}
                      >
                        Mark Unread
                      </Button>
                    )}

                    {/* Reply via Email */}
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(msg)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Message Details Modal */}
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      activeMessage.status === 'unread'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : activeMessage.status === 'read'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {activeMessage.status}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1 font-cinzel">
                    {activeMessage.subject}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sender Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block text-[11px]">Sender Name</span>
                  <span className="font-bold text-stone-900">{activeMessage.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Email Address</span>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    className="font-mono text-amber-800 hover:underline font-semibold"
                  >
                    {activeMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Submitted At</span>
                  <span className="text-stone-700">
                    {new Date(activeMessage.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Inquiry ID</span>
                  <span className="font-mono text-[10px] text-stone-500">{activeMessage.id}</span>
                </div>
              </div>

              {/* Full Message Body */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Message Content
                </span>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {activeMessage.message}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Internal Support Notes
                </span>
                <Textarea
                  placeholder="Record internal resolution details or response logs here..."
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleUpdateStatus(activeMessage.id, activeMessage.status, adminNotesInput);
                  }}
                >
                  Save Internal Notes
                </Button>
              </div>

              {/* Status Controls Bar */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-500 font-semibold mr-1">Status:</span>
                  {(['unread', 'read', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(activeMessage.id, st, adminNotesInput)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
                        activeMessage.status === st
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-cinzel">
                Delete Message?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently delete the inquiry from{' '}
                <strong>{deleteCandidate.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteCandidate(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
