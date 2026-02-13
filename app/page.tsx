'use client';

import { useState, useEffect } from 'react';

interface Email {
  id: number;
  from: string;
  to?: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  attachments?: string[];
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emails');
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
        setError(null);
      } else {
        setError('Error al cargar emails');
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getPreview = (body: string, length: number = 70) => {
    return body.length > length ? body.substring(0, length) + '...' : body;
  };

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
      
      try {
        await fetch('/api/emails', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailId: email.id })
        });
      } catch (err) {
        console.error('Error marking email as read:', err);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'urgent': return '🔥';
      case 'high': return '⚡';
      default: return '💌';
    }
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <>
      {/* Star background */}
      <div className="stars"></div>

      <div className="min-h-screen anime-bg relative z-10 p-4 md:p-8">
        {/* Header with anime styling */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h1 className="text-6xl md:text-8xl font-bold shimmer mb-2 float">
              ✉️ EVIL MAIL ✨
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light">
              Tu bandeja de mensajes kawaii
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-4 border-2 border-white/30 shadow-2xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchEmails}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold anime-btn shadow-lg hover:shadow-pink-500/50"
                disabled={loading}
              >
                {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
              </button>
              
              {unreadCount > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-bold badge-pulse shadow-lg">
                  {unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="text-white font-medium">
              📬 Total: <span className="font-bold text-pink-300">{emails.length}</span> mensajes
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl text-red-200 text-center font-medium shadow-lg">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de emails */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/30 shadow-xl">
              <div className="flex items-center justify-between text-white font-medium">
                <span>📨 Bandeja</span>
                <span className="text-pink-300">💟 {unreadCount} sin leer</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto anime-scrollbar pr-2">
              {loading ? (
                <div className="text-center text-white py-12">
                  <div className="text-6xl mb-4 float">⏳</div>
                  <div className="text-xl font-medium shimmer">Cargando mensajes...</div>
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center text-white/70 py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <div className="text-xl font-medium">No hay mensajes</div>
                </div>
              ) : emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 cursor-pointer
                    border-2 transition-all duration-300 anime-card shadow-xl
                    ${selectedEmail?.id === email.id 
                      ? 'border-pink-400 shadow-pink-500/50 bg-white/20' 
                      : 'border-white/30 hover:border-purple-400'
                    }
                    ${!email.read ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' : ''}`}
                >
                  {/* Priority badge */}
                  <div className={`absolute -top-2 -left-2 ${getPriorityColor(email.priority)} 
                    rounded-full px-3 py-1 text-white text-xs font-bold shadow-lg z-10`}>
                    {getPriorityIcon(email.priority)} {email.priority.toUpperCase()}
                  </div>

                  {/* Unread indicator */}
                  {!email.read && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 
                      rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg badge-pulse z-10">
                      N
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="text-purple-300 text-xs font-semibold mb-1 truncate">
                      👤 {email.from}
                    </div>
                    <h3 className={`text-base font-bold mb-2 truncate ${
                      !email.read ? 'text-white' : 'text-white/70'
                    }`}>
                      {email.subject}
                    </h3>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">
                      {getPreview(email.body, 60)}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyan-300 font-medium">
                        📅 {formatDate(email.date)}
                      </span>
                      {email.attachments && email.attachments.length > 0 && (
                        <span className="text-yellow-300">
                          📎 {email.attachments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email detail view */}
          <div className="lg:col-span-2">
            {selectedEmail ? (
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl overflow-hidden">
                {/* Decorative gradient orb */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-30"></div>

                <div className="relative z-10">
                  {/* Priority badge */}
                  <div className={`inline-block ${getPriorityColor(selectedEmail.priority)} 
                    rounded-full px-4 py-2 text-white text-sm font-bold shadow-lg mb-6`}>
                    {getPriorityIcon(selectedEmail.priority)} Prioridad: {selectedEmail.priority.toUpperCase()}
                  </div>

                  {/* Header */}
                  <div className="border-b-2 border-white/20 pb-6 mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 anime-glow">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300 font-semibold">De:</span>
                        <span className="text-white bg-white/10 px-3 py-1 rounded-full text-sm">
                          👤 {selectedEmail.from}
                        </span>
                      </div>
                      {selectedEmail.to && (
                        <div className="flex items-center gap-2">
                          <span className="text-purple-300 font-semibold">Para:</span>
                          <span className="text-white bg-white/10 px-3 py-1 rounded-full text-sm">
                            📧 {selectedEmail.to}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300 font-semibold">Fecha:</span>
                        <span className="text-cyan-300 bg-white/10 px-3 py-1 rounded-full text-sm">
                          📅 {formatDate(selectedEmail.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/20">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedEmail.body}
                    </p>
                  </div>
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border-2 border-purple-400/30 mb-6">
                      <div className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        📎 Archivos Adjuntos ({selectedEmail.attachments.length})
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div key={index} 
                            className="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-all cursor-pointer">
                            <span className="text-2xl">📄</span>
                            <span className="text-white text-sm font-medium truncate">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold anime-btn shadow-lg flex items-center gap-2">
                      ↩️ Responder
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold anime-btn shadow-lg flex items-center gap-2">
                      ➡️ Reenviar
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-bold anime-btn shadow-lg flex items-center gap-2">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/30 
                flex items-center justify-center min-h-[500px] shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 text-6xl opacity-20 float">💌</div>
                <div className="absolute bottom-10 right-10 text-6xl opacity-20 float" style={{animationDelay: '1s'}}>✨</div>
                
                <div className="text-center relative z-10">
                  <div className="text-8xl mb-6 float">📬</div>
                  <p className="text-white text-2xl font-bold mb-3 shimmer">
                    Selecciona un mensaje
                  </p>
                  <p className="text-white/60 text-lg">
                    Tienes {emails.length} mensaje{emails.length !== 1 ? 's' : ''} en tu bandeja
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/30 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span className="font-semibold">Evil Mail v3.0</span>
              </div>
              <div className="text-sm text-white/70">
                Powered by MCP & Next.js
              </div>
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                ONLINE
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-10 text-4xl opacity-30 pointer-events-none float">⭐</div>
        <div className="fixed bottom-40 left-10 text-5xl opacity-20 pointer-events-none float" style={{animationDelay: '0.5s'}}>🌸</div>
        <div className="fixed top-1/2 right-1/4 text-3xl opacity-25 pointer-events-none float" style={{animationDelay: '1.5s'}}>💫</div>
      </div>
    </>
  );
}
